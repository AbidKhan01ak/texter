#backend/run.py
from flask import Flask
from app.config import Config  # Import Config from app/config.py
from app import db, bcrypt  # Import db and bcrypt from app/__init__.py
from app.routes.auth_routes import auth_bp
from app.routes.text_routes import text_bp
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv
from flask_cors import CORS  # Import CORS from flask_cors
from app.models.password_history import PasswordHistory  # Import PasswordHistory model
from app.routes.history_routes import history_bp


load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')  # Load configuration from Config class

    # Initialize plugins
    db.init_app(app)  # Initialize SQLAlchemy with the Flask app
    JWTManager(app)  # Initialize JWTManager
    # backend/run.py

    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
  # Set up CORS for the frontend origin

    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(text_bp, url_prefix='/text') 

    # Register the blueprint
    app.register_blueprint(history_bp, url_prefix='/history')
    with app.app_context():
        db.create_all()  # Create tables if they don't exist

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
