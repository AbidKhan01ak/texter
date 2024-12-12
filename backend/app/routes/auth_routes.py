from flask import Blueprint, request, jsonify, current_app
from app.models.user import User
from app import db, bcrypt
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity
import logging
import re

# Initialize Blueprint for Auth Routes
auth_bp = Blueprint('auth', __name__)

# Configure logging for the module
logger = logging.getLogger(__name__)

# Utility function to validate email format
def is_valid_email(email):
    email_regex = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return re.match(email_regex, email) is not None

@auth_bp.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        # Validate input fields
        if not all([first_name, last_name, username, email, password]):
            return jsonify({"error": "All fields are required"}), 400

        if not is_valid_email(email):
            return jsonify({"error": "Invalid email format"}), 400

        # Check if the user already exists
        if User.query.filter_by(email=email).first() or User.query.filter_by(username=username).first():
            return jsonify({"error": "User with this email or username already exists"}), 409

        # Hash the password
        hashed_password = User.hash_password(password)

        # Create new user
        new_user = User(first_name=first_name, last_name=last_name, username=username, email=email, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()

        logger.info(f"New user created: {username} ({email})")
        return jsonify({"message": "User created successfully"}), 201

    except Exception as e:
        logger.error(f"Error during signup: {e}")
        return jsonify({"error": "An unexpected error occurred during signup"}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        identifier = data.get('identifier')
        password = data.get('password')

        if not identifier or not password:
            return jsonify({"error": "Both username/email and password are required"}), 400

        # Check if identifier matches either email or username
        user = User.query.filter((User.email == identifier) | (User.username == identifier)).first()

        if user and bcrypt.check_password_hash(user.password, password):
            # Generate access token and return it
            access_token = create_access_token(identity=user.id)
            logger.info(f"User {user.username} logged in successfully")
            return jsonify({"message": "Login successful", "access_token": access_token, "username": user.username}), 200
        else:
            logger.warning(f"Failed login attempt for identifier: {identifier}")
            return jsonify({"error": "Invalid identifier or password"}), 401

    except Exception as e:
        logger.error(f"Error during login: {e}")
        return jsonify({"error": "An unexpected error occurred during login"}), 500


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    try:
        user_id = get_jwt_identity()
        new_token = create_access_token(identity=user_id)
        logger.info(f"Access token refreshed for user ID: {user_id}")
        return jsonify(access_token=new_token), 200

    except Exception as e:
        logger.error(f"Error during token refresh: {e}")
        return jsonify({"error": "An unexpected error occurred during token refresh"}), 500
