import os
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://root:password@localhost:3306/pain_assessment",
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "change-me-too")
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", "86400"))
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH", str(10 * 1024 * 1024)))
    UPLOAD_ROOT = Path(os.getenv("UPLOAD_ROOT", str(BASE_DIR / "storage" / "uploads")))
    MODEL_BUNDLE_PATH = Path(
        os.getenv(
            "MODEL_BUNDLE_PATH",
            str(BASE_DIR.parent / "prediction model" / "pain_prediction_model.joblib"),
        )
    )
    CORS_ORIGINS = [
        origin.strip()
        for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
        if origin.strip()
    ]
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "").strip()
