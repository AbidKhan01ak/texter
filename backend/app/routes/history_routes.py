from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.history import History
from app.models.user import User

history_bp = Blueprint('history', __name__)

@history_bp.route('/log', methods=['POST'])
@jwt_required()
def log_action():
    user_id = get_jwt_identity()
    data = request.get_json()
    action = data.get('action')
    History.clean_up_history(user_id)
    
    if not action:
        return jsonify({'error': 'Action is required'}), 400

    new_history = History(user_id=user_id, action=action)
    db.session.add(new_history)
    db.session.commit()

    return jsonify({'message': 'Action logged successfully'}), 201

@history_bp.route('/get', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    history = History.query.filter_by(user_id=user_id).order_by(History.timestamp.desc()).all()

    history_list = [{'action': h.action, 'timestamp': h.timestamp} for h in history]
    return jsonify(history_list), 200
