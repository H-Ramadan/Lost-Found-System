import os
from datetime import timedelta

class Config:
    # Secret key for JWT signing - load from .env or fallback to a dev default
    SECRET_KEY = os.environ.get("SECRET_KEY", "dev-secret-change-in-production-xyz123")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "jwt-secret-change-in-production-abc456")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=30)

    # SQLite database stored inside the backend folder
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(BASE_DIR, 'data.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Folder where uploaded images are stored
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
