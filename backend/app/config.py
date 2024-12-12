from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv(".env")  # Change the path if necessary

class Config:
    # Database URI: Check if the variable is set, and provide a helpful error message if not
    SQLALCHEMY_DATABASE_URI = os.getenv("SQLALCHEMY_DATABASE_URI")
    if not SQLALCHEMY_DATABASE_URI:
        raise ValueError("Missing environment variable: SQLALCHEMY_DATABASE_URI")
    
    # Track modifications: Default to False if not set
    SQLALCHEMY_TRACK_MODIFICATIONS = os.getenv("SQLALCHEMY_TRACK_MODIFICATIONS", "False").lower() == "true"
    
    # Secret keys for app and JWT: Check for presence and raise error if missing
    SECRET_KEY = os.getenv("SECRET_KEY")
    if not SECRET_KEY:
        raise ValueError("Missing environment variable: SECRET_KEY")
    
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    if not JWT_SECRET_KEY:
        raise ValueError("Missing environment variable: JWT_SECRET_KEY")
    
    # JWT Access token expiration (in seconds): Use a default value if not set
    JWT_ACCESS_TOKEN_EXPIRES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES", 360000))

    # Optionally, add other configurations like debug mode or the environment type
    DEBUG = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    ENV = os.getenv("FLASK_ENV", "production")  # Set default to 'production'
    
    # CORS settings can be added here, like allowed origins, etc.
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")  # Default to allowing all origins
