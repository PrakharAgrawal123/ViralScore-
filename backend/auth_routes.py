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
        print(f"📧 [DEV EMAIL SIMULATION]")
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

        server = smtplib.SMTP(smtp_server, int(smtp_port))
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.sendmail(smtp_username, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"❌ Failed to send email to {to_email}: {e}")
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
    
    # Store the referrer (frontend origin) in session
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
        frontend_url = session.get("frontend_url") or os.getenv("FRONTEND_URL", "http://localhost:5173")
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
        import ssl
        import certifi
        ssl_context = ssl.create_default_context(cafile=certifi.where())
        
        req = urllib.request.Request(token_url, data=data)
        with urllib.request.urlopen(req, context=ssl_context) as res:
            tokens = json.loads(res.read().decode('utf-8'))
            
        access_token = tokens.get('access_token')
        
        # Retrieve profile details from Google API
        userinfo_url = f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={access_token}"
        with urllib.request.urlopen(userinfo_url, context=ssl_context) as res:
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

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    try:
        data = request.get_json() or {}
        email = data.get('email')
        
        if not email:
            return jsonify({"error": "Email is required"}), 400
            
        user = mongo.db.users.find_one({"email": email})
        if not user:
            return jsonify({"error": "User with this email does not exist"}), 404
            
        # Generate 6 digit code
        code = f"{random.randint(100000, 999999)}"
        expires_at = datetime.utcnow() + timedelta(minutes=15)
        
        # Save code to DB
        mongo.db.users.update_one(
            {"email": email},
            {"$set": {"reset_code": code, "reset_code_expires": expires_at}}
        )
        
        # Send email
        subject = "Reset your ViralScore Password 🔑"
        body_text = f"Hi {user['name']},\n\nYou requested to reset your password. Use the following 6-digit verification code to complete the reset process:\n\n{code}\n\nThis code will expire in 15 minutes. If you did not request this, please ignore this email."
        
        body_html = f"""
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #6366f1; margin-top: 0;">ViralScore Password Reset</h2>
            <p>Hi {user['name']},</p>
            <p>You requested to reset your password. Use the following 6-digit verification code to complete the reset process:</p>
            <div style="font-size: 24px; font-weight: bold; background: #f1f5f9; padding: 12px; border-radius: 8px; text-align: center; color: #6366f1; border: 1px solid #e2e8f0; margin: 20px 0; letter-spacing: 4px;">
                {code}
            </div>
            <p>This code will expire in <strong>15 minutes</strong>.</p>
            <p style="color: #64748b; font-size: 12px; margin-top: 30px;">If you did not request this, you can safely ignore this email.</p>
        </div>
        """
        
        send_notification_email(email, subject, body_text, body_html)
        
        return jsonify({"message": "Verification code sent to your email"}), 200
    except Exception as e:
        print(f"❌ Forgot Password error: {e}")
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json() or {}
        email = data.get('email')
        code = data.get('code')
        new_password = data.get('new_password')
        
        if not email or not code or not new_password:
            return jsonify({"error": "Email, code, and new password are required"}), 400
            
        user = mongo.db.users.find_one({"email": email})
        if not user:
            return jsonify({"error": "User not found"}), 404
            
        db_code = user.get("reset_code")
        db_expires = user.get("reset_code_expires")
        
        if not db_code or not db_expires:
            return jsonify({"error": "No password reset requested for this account"}), 400
            
        if db_code != str(code).strip():
            return jsonify({"error": "Invalid verification code"}), 400
            
        if datetime.utcnow() > db_expires:
            return jsonify({"error": "Verification code has expired"}), 400
            
        # Update password
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        mongo.db.users.update_one(
            {"email": email},
            {
                "$set": {"password": hashed_password},
                "$unset": {"reset_code": "", "reset_code_expires": ""}
            }
        )
        
        # Send confirmation email
        subject = "Password Changed Successfully 🔒"
        body_text = f"Hi {user['name']},\n\nYour ViralScore account password was successfully changed. If this wasn't you, please contact support immediately."
        body_html = f"""
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
            <h2 style="color: #6366f1; margin-top: 0;">Password Changed</h2>
            <p>Hi {user['name']},</p>
            <p>Your ViralScore account password was successfully changed.</p>
            <p style="color: #ef4444;">If you did not make this change, please contact support or reset your password immediately.</p>
        </div>
        """
        send_notification_email(email, subject, body_text, body_html)
        
        return jsonify({"message": "Password reset successful"}), 200
    except Exception as e:
        print(f"❌ Reset Password error: {e}")
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500
