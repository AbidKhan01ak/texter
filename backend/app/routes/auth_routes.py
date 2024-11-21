# backend/app/routes/auth_routes.py
from flask import Blueprint, request, jsonify
from app.models.user import User
from app import db, bcrypt
from flask_jwt_extended import jwt_required, create_access_token, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not all([first_name, last_name, username, email, password]):
        return jsonify({"error": "All fields are required"}), 400

    # Check if the user already exists
    if User.query.filter_by(email=email).first() or User.query.filter_by(username=username).first():
        return jsonify({"error": "User with this email or username already exists"}), 409

    # Hash the password and create the user
    hashed_password = User.hash_password(password)
    new_user = User(first_name=first_name, last_name=last_name, username=username, email=email, password=hashed_password)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User created successfully"}), 201


# Login route (new)
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    identifier = data.get('identifier')
    password = data.get('password')

    if not identifier or not password:
        return jsonify({"error": "Both username/email and password are required"}), 400

    # Check if identifier matches either an email or a username
    user = User.query.filter((User.email == identifier) | (User.username == identifier)).first()

    if user and bcrypt.check_password_hash(user.password, password):
        # Generate access token if login is successful
        access_token = create_access_token(identity=user.id)
        return jsonify({"message": "Login successful", "access_token": access_token, "username":user.username}), 200
    else:
        return jsonify({"error": "Invalid identifier or password"}), 401
    
@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh_token():
    user_id = get_jwt_identity()
    new_token = create_access_token(identity=user_id)
    return jsonify(access_token=new_token), 200