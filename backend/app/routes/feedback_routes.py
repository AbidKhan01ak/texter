# from flask import Blueprint, request, jsonify, make_response
# import requests
# from app import db

# feedback_bp = Blueprint('feedback', __name__)

# @feedback_bp.route('/proxy/feedback', methods=['POST'])
# def proxy_feedback():
#     try:
#         feedback_data = request.json
#         response = requests.post(
#             'https://openformstack.com/f/cm4ksi6lq0000b3vpc7mk1e0n',
#             json=feedback_data,
#             headers={'Content-Type': 'application/json'}
#         )
#         return jsonify(response.json()), response.status_code
#     except Exception as e:
#         return jsonify({"error": "Failed to submit feedback"}), 500
