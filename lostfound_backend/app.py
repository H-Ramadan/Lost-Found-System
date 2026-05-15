import os
from dotenv import load_dotenv

# Load environment variables from .env before anything else
load_dotenv()

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from database import db
from config import Config

def create_app():
    app = Flask(__name__)

    # 1. Load Configuration
    app.config.from_object(Config)

    # 2. Initialize Extensions
    # Allow the Vite dev server (5173) and the preview server (4173) to call the API.
    # In production replace the origins list with your actual domain.
    CORS(app, resources={r"/*": {"origins": [
        "http://localhost:5173",
        "http://localhost:4173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:4173",
        # Go Live (VS Code Live Server) ports
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "http://127.0.0.1:5501",
        "http://localhost:5501",
    ]}}, supports_credentials=True)

    JWTManager(app)
    db.init_app(app)  # Only called once here to avoid duplicate-registration errors

    # 3. Ensure Upload Folder Exists
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])

    with app.app_context():
        # Import models so SQLAlchemy registers them before create_all()
        import models  # noqa: F401
        db.create_all()  # Creates data.db automatically if it doesn't exist

    # 4. Register Blueprints
    from auth import bp as auth_bp
    from posts import bp as posts_bp

    # Register blueprints under /api prefix for Vercel & Consistency
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(posts_bp, url_prefix="/api/posts")

    return app


# Module-level app object (used by WSGI servers like gunicorn)
app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)
