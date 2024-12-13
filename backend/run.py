import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv

from app import db, bcrypt
from app.config import Config
from app.routes.auth_routes import auth_bp
from app.routes.text_routes import text_bp
from app.routes.history_routes import history_bp

# Load environment variables
load_dotenv()

def create_app():
    """Create and configure the Flask app."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize plugins
    db.init_app(app)
    JWTManager(app)

    CORS(app,
     resources={r"/*": {"origins": ["http://localhost:3000", "https://openformstack.com", "https://polite-profiterole-3feded.netlify.app"]}},
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
     allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
     expose_headers=["Content-Type", "Authorization"],
     supports_credentials=True)



    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(text_bp, url_prefix='/text')
    app.register_blueprint(history_bp, url_prefix='/history')

    with app.app_context():
        # Create tables if they don't exist
        db.create_all()
    
    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            response = jsonify({"message": "Preflight request handled"})
            response.headers.add("Access-Control-Allow-Origin", "*")
            response.headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
            response.headers.add("Access-Control-Allow-Private-Network", "true")
            return response, 200
    # Global error handler
    @app.errorhandler(Exception)
    def handle_exception(e):
        response = {"error": str(e)}
        return jsonify(response), 500

    return app

if __name__ == "__main__":
    app = create_app()
    # Load configuration for production or development
    debug_mode = os.getenv("FLASK_DEBUG", "False").lower() == "true"
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=debug_mode)
