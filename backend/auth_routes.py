import os
import json
import urllib.request
import urllib.parse
import urllib.error
import smtplib
import random
import secrets
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import Blueprint, request, jsonify, redirect, session
from bson.objectid import ObjectId
from extensions import mongo, bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

def get_frontend_url():
    referer = request.headers.get("Referer")
    if referer and "localhost" in referer:
        from urllib.parse import urlparse
        parsed = urlparse(referer)
        return f"{parsed.scheme}://{parsed.netloc}"
    return os.getenv("FRONTEND_URL", "http://localhost:5173")

def send_notification_email(to_email, subject, body_text, body_html=None):
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = os.getenv("SMTP_PORT")
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    
    if not smtp_server or not smtp_port or not smtp_username or not smtp_password:
        print("\n" + "="*60)
        print(f"[Email Simulation] (DEV)")
        print(f"TO: {to_email}")
        print(f"SUBJECT: {subject}")
        print(f"BODY:\n{body_text}")
        print("="*60 + "\n")
        return True

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"ViralScore <{smtp_username}>"
        msg["To"] = to_email

        part1 = MIMEText(body_text, "plain")
        msg.attach(part1)

        if body_html:
            part2 = MIMEText(body_html, "html")
            msg.attach(part2)

        # Added timeout=5 to prevent Gunicorn worker hangs on blocked/slow SMTP connections
        server = smtplib.SMTP(smtp_server, int(smtp_port), timeout=5)
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.sendmail(smtp_username, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Error: Failed to send email to {to_email}: {e}")
        return False

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
    
    # Send signup email
    subject = "Welcome to ViralScore! 🚀"
    body_text = f"Hi {name},\n\nWelcome to ViralScore! Your account has been registered successfully.\n\nReady to make your LinkedIn posts go viral? Start writing and analyzing your drafts right now!"
    body_html = f"""
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #6366f1; margin-top: 0;">Welcome to ViralScore! 🚀</h2>
        <p>Hi {name},</p>
        <p>Your account has been registered successfully. You are now ready to start optimizing your LinkedIn presence with our machine learning models!</p>
        <p>Start analyzing your hooks, fixing corporate jargon, and generating AI rewrites right now.</p>
        <div style="margin: 25px 0;">
            <a href="https://viral-score-eight.vercel.app/" style="background-color: #6366f1; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Analyze Post Now</a>
        </div>
        <p style="color: #64748b; font-size: 13px;">If you have any questions, feel free to reply to this email.</p>
    </div>
    """
    send_notification_email(email, subject, body_text, body_html)
    
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
    
    # Send login email
    subject = "New Login Alert: ViralScore 🔐"
    login_time = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    body_text = f"Hi {user['name']},\n\nWe detected a new sign-in to your ViralScore account ({email}) at {login_time}.\n\nIf this was you, no action is needed. If this wasn't you, please reset your password immediately."
    body_html = f"""
    <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #6366f1; margin-top: 0;">New Login Alert 🔐</h2>
        <p>Hi {user['name']},</p>
        <p>We detected a new sign-in to your ViralScore account (<strong>{email}</strong>) at <strong>{login_time}</strong>.</p>
        <p>If this was you, no action is needed. If you do not recognize this login, please reset your password immediately to protect your account.</p>
        <div style="margin: 25px 0;">
            <a href="https://viral-score-eight.vercel.app/" style="background-color: #6366f1; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Go to Dashboard</a>
        </div>
    </div>
    """
    send_notification_email(email, subject, body_text, body_html)
    
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
    
    # Read frontend origin dynamically from query parameters or referer header
    frontend_url = request.args.get('frontend_url')
    if not frontend_url:
        referer = request.headers.get("Referer")
        if referer:
            from urllib.parse import urlparse
            parsed = urlparse(referer)
            frontend_url = f"{parsed.scheme}://{parsed.netloc}"
        else:
            frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
            
    session["frontend_url"] = frontend_url
    
    # If no Google credentials configured, execute simulation/dev fallback
    if not client_id:
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
    # Pass frontend_url directly as OAuth state to bypass cross-site cookie restrictions
    params = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "state": frontend_url
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
        import ssl
        import certifi
        ssl_context = ssl.create_default_context(cafile=certifi.where())
        
        req = urllib.request.Request(token_url, data=data)
        # Added timeout=10 to prevent hanging
        with urllib.request.urlopen(req, context=ssl_context, timeout=10) as res:
            tokens = json.loads(res.read().decode('utf-8'))
            
        access_token = tokens.get('access_token')
        
        # Retrieve profile details from Google API
        userinfo_url = f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={access_token}"
        # Added timeout=10 to prevent hanging
        with urllib.request.urlopen(userinfo_url, context=ssl_context, timeout=10) as res:
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
            
            # Send Google signup email
            subject = "Welcome to ViralScore! 🚀"
            body_text = f"Hi {name},\n\nWelcome to ViralScore! Your account has been registered successfully with Google.\n\nReady to make your LinkedIn posts go viral? Start writing and analyzing your drafts right now!"
            body_html = f"""
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                <h2 style="color: #6366f1; margin-top: 0;">Welcome to ViralScore! 🚀</h2>
                <p>Hi {name},</p>
                <p>Your account has been registered successfully with Google. You are now ready to start optimizing your LinkedIn presence with our machine learning models!</p>
                <p>Start analyzing your hooks, fixing corporate jargon, and generating AI rewrites right now.</p>
                <div style="margin: 25px 0;">
                    <a href="https://viral-score-eight.vercel.app/" style="background-color: #6366f1; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; display: inline-block;">Analyze Post Now</a>
                </div>
            </div>
            """
            send_notification_email(email, subject, body_text, body_html)
        else:
            # Update user info if google login was used
            mongo.db.users.update_one(
                {"_id": user["_id"]},
                {"$set": {"google_id": google_id, "picture": picture}}
            )
            user_id = str(user["_id"])
            
            # Send Google login email
            subject = "New Login Alert: ViralScore 🔐"
            login_time = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
            body_text = f"Hi {user['name']},\n\nWe detected a new Google sign-in to your ViralScore account ({email}) at {login_time}.\n\nIf this was you, no action is needed."
            body_html = f"""
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                <h2 style="color: #6366f1; margin-top: 0;">New Login Alert 🔐</h2>
                <p>Hi {user['name']},</p>
                <p>We detected a new Google sign-in to your ViralScore account (<strong>{email}</strong>) at <strong>{login_time}</strong>.</p>
                <p>If this was you, no action is needed.</p>
            </div>
            """
            send_notification_email(email, subject, body_text, body_html)
            
        token = create_access_token(identity=user_id)
        
        # Determine the frontend redirect URL: first check OAuth state param, then session, then env var
        state = request.args.get('state')
        frontend_url = None
        if state and (state.startswith("http://") or state.startswith("https://")):
            frontend_url = state
            
        if not frontend_url:
            frontend_url = session.get("frontend_url") or os.getenv("FRONTEND_URL", "http://localhost:5173")
            
        return redirect(f"{frontend_url}/login?token={token}")
        
    except Exception as e:
        if isinstance(e, urllib.error.HTTPError):
            try:
                error_body = e.read().decode('utf-8')
                return jsonify({
                    "error": f"HTTP {e.code}: {e.reason}",
                    "details": json.loads(error_body)
                }), 500
            except Exception as read_err:
                return jsonify({"error": str(e), "read_error": str(read_err)}), 500
        return jsonify({"error": str(e)}), 500


