# app/routes/feedback_routes.py
from flask import Blueprint, request, jsonify
from app import db
from app.models.feedback import Feedback  # Define this model in models/feedback.py

feedback_bp = Blueprint('feedback_bp', __name__)

@feedback_bp.route('/submit', methods=['POST'])
def submit_feedback():
    data = request.get_json()

    # Validate the data (basic validation)
    if not data.get('name') or not data.get('email') or not data.get('message'):
        return jsonify({"error": "All fields are required"}), 400

    # Save to database
    feedback = Feedback(
        name=data.get('name'),
        email=data.get('email'),
        message=data.get('message')
    )

    db.session.add(feedback)
    db.session.commit()

    return jsonify({"message": "Feedback submitted successfully!"}), 201
