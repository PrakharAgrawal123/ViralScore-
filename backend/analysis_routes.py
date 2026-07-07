import os
import re
import json
import joblib
from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import google.generativeai as genai

analysis_bp = Blueprint('analysis', __name__)

# Jargon replacements fallback dictionary
JARGON_REPLACEMENTS = [
  { "word": 'paradigm shift', "replacement": 'fundamental change', "reason": 'Too corporate and vague' },
  { "word": 'synergy', "replacement": 'collaboration', "reason": 'Overused buzzword' },
  { "word": 'synergize', "replacement": 'collaborate / align', "reason": 'High corporate jargon factor' },
  { "word": 'deep dive', "replacement": 'close look / analysis', "reason": 'Cliché filler phrase' },
  { "word": 'leverage', "replacement": 'use / build on', "reason": 'Overused marketing term' },
  { "word": 'disruptive', "replacement": 'innovative / unique', "reason": 'Lacks actual descriptive meaning' },
  { "word": 'game changer', "replacement": 'important step', "reason": 'Sensationalist and overplayed' },
  { "word": 'game-changing', "replacement": 'important', "reason": 'Sensationalist and overplayed' },
  { "word": 'revolutionary', "replacement": 'new / advanced', "reason": 'Sounds like hyperbole' },
  { "word": 'stakeholder', "replacement": 'client / partner', "reason": 'Very bureaucratic' },
  { "word": 'maximize roi', "replacement": 'improve results', "reason": 'Sounds dry and spreadsheet-driven' },
  { "word": 'deliverables', "replacement": 'products / output', "reason": 'Sounds like office speak' },
  { "word": 'agile workspace', "replacement": 'flexible team environment', "reason": 'Overused process buzzword' }
]

def split_sentences(text):
    if not text:
        return []
    # Match sentences ending with punctuation or newlines
    sentence_regex = r'[^.!?\n]+[.!?]?'
    matches = re.findall(sentence_regex, text)
    return [s.strip() for s in matches if s.strip()]

def extract_features(text):
    text_lower = text.lower()
    
    # Calculate word count & length
    words = text.split()
    content_length = len(text)
    
    # Calculate hashtags count
    hashtags_count = len([w for w in words if w.startswith('#')])
    
    # Check for media keywords
    has_media = 0
    media_type = 0 # 0=None, 1=Image, 2=Video
    post_type = 0 # 0=Text, 1=Image, 2=Video, 3=Carousel
    
    if "carousel" in text_lower or "slide" in text_lower or "deck" in text_lower:
        has_media = 1
        media_type = 1
        post_type = 3
    elif "video" in text_lower or "clip" in text_lower or "watch" in text_lower or "play" in text_lower or "youtube" in text_lower:
        has_media = 1
        media_type = 2
        post_type = 2
    elif "photo" in text_lower or "image" in text_lower or "pic" in text_lower or "graphic" in text_lower or "screenshot" in text_lower:
        has_media = 1
        media_type = 1
        post_type = 1
    else:
        # Check for placeholders like [Image] or [Video]
        if re.search(r'\[\s*image\s*\]|\[\s*photo\s*\]|\[\s*carousel\s*\]', text_lower):
            has_media = 1
            media_type = 1
            post_type = 3 if "carousel" in text_lower else 1
        elif re.search(r'\[\s*video\s*\]|\[\s*clip\s*\]', text_lower):
            has_media = 1
            media_type = 2
            post_type = 2
            
    # Day of week (0-6) and post hour (0-23)
    now = datetime.utcnow()
    day_of_week = now.weekday()
    post_time_hour = now.hour
    
    return [content_length, hashtags_count, has_media, media_type, post_type, day_of_week, post_time_hour], words

@analysis_bp.route('/predict', methods=['POST'])
@jwt_required()
def predict():
    data = request.get_json() or {}
    content = data.get('content', '')
    
    if not content:
        return jsonify({"error": "Content cannot be empty"}), 400
        
    # Extract features
    features, words = extract_features(content)
    
    # Load model and metadata
    models_dir = os.path.join(os.path.dirname(__file__), 'models')
    model_path = os.path.join(models_dir, 'virality_model.pkl')
    metadata_path = os.path.join(models_dir, 'metadata.pkl')
    
    if not os.path.exists(model_path) or not os.path.exists(metadata_path):
        return jsonify({"error": "ML Model is not trained yet. Run train_model.py first."}), 500
        
    model = joblib.load(model_path)
    metadata = joblib.load(metadata_path)
    
    # Predict engagement rate
    predicted_rate = model.predict([features])[0]
    
    # Convert predicted engagement rate to virality score (0 - 100)
    min_rate = metadata.get('min_engagement_rate', 0.5)
    max_rate = metadata.get('max_engagement_rate', 8.0)
    
    if max_rate != min_rate:
        virality_score = round(((predicted_rate - min_rate) / (max_rate - min_rate)) * 100)
    else:
        virality_score = 50
        
    # Cap score between 22 and 98
    virality_score = max(22, min(98, virality_score))
    
    # Sentence analysis
    sentence_strings = split_sentences(content)
    detected_weak_words = []
    sentences = []
    rewrites = []
    
    for index, sentence in enumerate(sentence_strings):
        type_label = 'neutral'
        label = 'Neutral'
        
        # Check jargon
        has_jargon = False
        matched_jargon = None
        
        for item in JARGON_REPLACEMENTS:
            if item['word'] in sentence.lower():
                has_jargon = True
                matched_jargon = item
                detected_weak_words.append(item['word'])
                break
                
        if has_jargon:
            type_label = 'weak'
            label = 'Weak'
            
            # Simple fallback rewrite suggestion
            if matched_jargon:
                regex = re.compile(re.escape(matched_jargon['word']), re.IGNORECASE)
                suggested_text = regex.sub(matched_jargon['replacement'], sentence)
                rewrites.append({
                    "id": f"rw-{index}-{int(datetime.utcnow().timestamp())}",
                    "original": sentence,
                    "suggested": suggested_text,
                    "explanation": matched_jargon['reason']
                })
        elif sentence.endswith('?') or any(kw in sentence.lower() for kw in ['let me know', 'comment', 'discuss']):
            type_label = 'engaging'
            label = 'Engaging'
        elif index == 0 or (index == 1 and len(sentence_strings) > 2 and len(sentence) < 90):
            type_label = 'hook'
            label = 'Hook'
            
        sentences.append({
            "text": sentence,
            "type": type_label,
            "label": label
        })
        
    # Read time
    word_count = len(words)
    read_time_seconds = max(round((word_count / 180) * 60), 3)
    read_time = f"{read_time_seconds} sec read" if read_time_seconds < 60 else f"{round(read_time_seconds/60)} min read"
    
    # Reach and best posting window
    status = 'Average'
    estimated_reach = ""
    if virality_score >= 70:
        status = 'Viral'
        estimated_reach = f"{int(virality_score * 400):,} - {int(virality_score * 1200):,} views"
    elif virality_score < 40:
        status = 'Needs Work'
        estimated_reach = '200 - 800 views'
    else:
        estimated_reach = f"{int(virality_score * 80):,} - {int(virality_score * 180):,} views"
        
    posting_windows = [
        'Tuesday, 8:45 AM EST (Peak mid-week professional engagement)',
        'Wednesday, 9:15 AM EST (Optimal lunch break scrolling hour)',
        'Thursday, 12:30 PM EST (Afternoon professional catch-up window)',
        'Monday, 10:00 AM EST (Weekly corporate strategy review session)'
    ]
    best_time = posting_windows[datetime.utcnow().day % len(posting_windows)]
    
    return jsonify({
        "score": virality_score,
        "status": status,
        "estimatedReach": estimated_reach,
        "readTime": read_time,
        "wordCount": word_count,
        "sentences": sentences,
        "rewrites": rewrites,
        "bestTime": best_time
    }), 200

@analysis_bp.route('/rewrite', methods=['POST'])
@jwt_required()
def suggest_rewrite():
    data = request.get_json() or {}
    sentence = data.get('sentence', '')
    full_post = data.get('full_post', '')
    
    if not sentence:
        return jsonify({"error": "Sentence cannot be empty"}), 400
        
    # Check if Gemini API is configured
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        try:
            genai.configure(api_key=gemini_key)
            model = genai.GenerativeModel('gemini-pro')
            
            prompt = f"""
            You are a world-class copywriter specializing in LinkedIn content.
            I have this weak or corporate-jargon sentence in my post:
            "{sentence}"
            
            The entire post context is:
            "{full_post}"
            
            Task:
            1. Rewrite the sentence to make it punchy, conversational, and highly engaging for LinkedIn.
            2. Keep it to a single sentence.
            3. Provide a brief (1-sentence) explanation of why the rewrite is better.
            
            Return the output strictly as a JSON object, with no markdown wrappers or formatting, matching this schema:
            {{
                "suggested": "your rewritten sentence",
                "explanation": "your explanation"
            }}
            """
            response = model.generate_content(prompt)
            
            # Parse response text
            # Strip any markdown wrappers if LLM returned them
            clean_text = response.text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
            clean_text = clean_text.strip()
            
            result = json.loads(clean_text)
            return jsonify({
                "suggested": result.get("suggested"),
                "explanation": result.get("explanation")
            }), 200
        except Exception as e:
            # Fallback on exception
            pass
            
    # Fallback to local heuristic replacements if Gemini is not configured or fails
    suggested_text = sentence
    explanation = "Reduced jargon for clear, simple messaging."
    
    for item in JARGON_REPLACEMENTS:
        if item['word'] in sentence.lower():
            regex = re.compile(re.escape(item['word']), re.IGNORECASE)
            suggested_text = regex.sub(item['replacement'], sentence)
            explanation = item['reason']
            break
            
    # If no specific jargon matched, generate a general improvement
    if suggested_text == sentence:
        suggested_text = f"Here is a punchy alternative: {sentence.strip()}"
        explanation = "Enhanced sentence readability."
        
    return jsonify({
        "suggested": suggested_text,
        "explanation": explanation
    }), 200
