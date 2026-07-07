import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from extensions import mongo, bcrypt, jwt
from auth_routes import auth_bp
from analysis_routes import analysis_bp

# Load environment configuration variables
load_dotenv()

app = Flask(__name__)

# Flask Config parameters
app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/viralscore")
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "your_secret_key_here")

# Initialize app extensions
mongo.init_app(app)
bcrypt.init_app(app)
jwt.init_app(app)

# CORS configuration
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
CORS(app, resources={r"/*": {"origins": [frontend_url, "http://localhost:5173", "https://viral-score-eight.vercel.app"]}}, supports_credentials=True)

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(analysis_bp, url_prefix='/analysis')

@app.route('/')
def index():
    return jsonify({"message": "ViralScore API Server is running!"}), 200

# Error handlers
@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Resource not found"}), 404

if __name__ == '__main__':
    # Listen on all interfaces on port 5000 for local network and container accessibility
    app.run(host='0.0.0.0', port=5000, debug=True)
