import os
import json
import urllib.request
import urllib.parse
from datetime import datetime
from flask import Blueprint, request, jsonify, redirect
from bson.objectid import ObjectId
from extensions import mongo, bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    picture = data.get('picture', '')
    
    if not name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400
        
    # Check if email exists
    existing_user = mongo.db.users.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "Email already exists"}), 400
        
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    new_user = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "google_id": None,
        "picture": picture,
        "created_at": datetime.utcnow()
    }
    
    inserted = mongo.db.users.insert_one(new_user)
    user_id = str(inserted.inserted_id)
    
    token = create_access_token(identity=user_id)
    
    return jsonify({
        "token": token,
        "user": {
            "id": user_id,
            "name": name,
            "email": email,
            "picture": picture
        }
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400
        
    user = mongo.db.users.find_one({"email": email})
    if not user:
        return jsonify({"error": "Invalid email or password"}), 401
        
    # Google users might not have a password
    if not user.get("password"):
        return jsonify({"error": "This account was created with Google. Please use Google Login."}), 401
        
    if not bcrypt.check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401
        
    user_id = str(user["_id"])
    token = create_access_token(identity=user_id)
    
    return jsonify({
        "token": token,
        "user": {
            "id": user_id,
            "name": user["name"],
            "email": user["email"],
            "picture": user.get("picture", "")
        }
    }), 200

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
    user_id = get_jwt_identity()
    try:
        user = mongo.db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        return jsonify({
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "picture": user.get("picture", "")
        }), 200
    except Exception:
        return jsonify({"error": "Invalid token identity format"}), 400

@auth_bp.route('/logout', methods=['GET'])
def logout():
    return jsonify({"message": "Logged out successfully"}), 200

@auth_bp.route('/google')
def google_login():
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    redirect_uri = request.url_root.rstrip('/') + "/auth/google/callback"
    
    # If no Google credentials configured, execute simulation/dev fallback
    if not client_id:
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        demo_user = {
            "name": "Google Creator",
            "email": "google@creator.io",
            "google_id": "google-demo-123",
            "picture": "https://lh3.googleusercontent.com/a/default-user",
            "created_at": datetime.utcnow()
        }
        user = mongo.db.users.find_one({"email": demo_user["email"]})
        if not user:
            inserted = mongo.db.users.insert_one(demo_user)
            user_id = str(inserted.inserted_id)
        else:
            user_id = str(user["_id"])
            
        token = create_access_token(identity=user_id)
        # Redirect back to the frontend with token parameter
        return redirect(f"{frontend_url}/login?token={token}")
        
    google_auth_url = "https://accounts.google.com/o/oauth2/v2/auth"
    params = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "state": "state"
    }
    url = f"{google_auth_url}?{urllib.parse.urlencode(params)}"
    return redirect(url)

@auth_bp.route('/google/callback')
def google_callback():
    code = request.args.get('code')
    if not code:
        return jsonify({"error": "Missing authorization code"}), 400
        
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
    redirect_uri = request.url_root.rstrip('/') + "/auth/google/callback"
    
    token_url = "https://oauth2.googleapis.com/token"
    data = urllib.parse.urlencode({
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code"
    }).encode('utf-8')
    
    try:
        req = urllib.request.Request(token_url, data=data)
        with urllib.request.urlopen(req) as res:
            tokens = json.loads(res.read().decode('utf-8'))
            
        access_token = tokens.get('access_token')
        
        # Retrieve profile details from Google API
        userinfo_url = f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={access_token}"
        with urllib.request.urlopen(userinfo_url) as res:
            google_user = json.loads(res.read().decode('utf-8'))
            
        email = google_user.get('email')
        name = google_user.get('name')
        google_id = google_user.get('sub')
        picture = google_user.get('picture', '')
        
        user = mongo.db.users.find_one({"email": email})
        if not user:
            new_user = {
                "name": name,
                "email": email,
                "password": None,
                "google_id": google_id,
                "picture": picture,
                "created_at": datetime.utcnow()
            }
            inserted = mongo.db.users.insert_one(new_user)
            user_id = str(inserted.inserted_id)
        else:
            # Update user info if google login was used
            mongo.db.users.update_one(
                {"_id": user["_id"]},
                {"$set": {"google_id": google_id, "picture": picture}}
            )
            user_id = str(user["_id"])
            
        token = create_access_token(identity=user_id)
        frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
        return redirect(f"{frontend_url}/login?token={token}")
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
