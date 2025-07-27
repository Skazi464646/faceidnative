import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./encodings.db")
    IMAGES_DIR:    str = os.getenv("IMAGES_DIR", "./images")
    THRESHOLD:     float = float(os.getenv("THRESHOLD", 0.5))
    HOST:          str = os.getenv("HOST", "0.0.0.0")
    PORT:          int = int(os.getenv("PORT", 8000))
    RELOAD:        bool = os.getenv("RELOAD", "true").lower() == "true"

settings = Settings()
