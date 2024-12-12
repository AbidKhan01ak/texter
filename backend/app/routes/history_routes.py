from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.history import History
from app.models.user import User
import logging

history_bp = Blueprint('history', __name__)

# Configure logger
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

@history_bp.route('/log', methods=['POST'])
@jwt_required()
def log_action():
    user_id = get_jwt_identity()
    data = request.get_json()

    action = data.get('action')

    if not action:
        logger.warning("No action provided in the request")
        return jsonify({'error': 'Action is required'}), 400

    try:
        # Clean up history if necessary before adding new log entry
        History.clean_up_history(user_id)

        # Create a new history entry
        new_history = History(user_id=user_id, action=action)
        db.session.add(new_history)
        db.session.commit()
        logger.info(f"Action logged for user {user_id}: {action}")
        
        return jsonify({'message': 'Action logged successfully'}), 201
    except Exception as e:
        logger.error(f"Error logging action for user {user_id}: {str(e)}")
        db.session.rollback()  # Rollback in case of failure
        return jsonify({'error': 'Failed to log action'}), 500

@history_bp.route('/get', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()

    # Pagination parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    try:
        # Clean up history if necessary before fetching history
        History.clean_up_history(user_id)

        # Fetch paginated history data
        history_query = History.query.filter_by(user_id=user_id).order_by(History.timestamp.desc())
        history = history_query.paginate(page, per_page, False)

        # Serialize history data
        history_list = [{'action': h.action, 'timestamp': h.timestamp} for h in history.items]

        # Include pagination info in the response
        return jsonify({
            'history': history_list,
            'total': history.total,
            'pages': history.pages,
            'current_page': page,
            'per_page': per_page
        }), 200
    except Exception as e:
        logger.error(f"Error fetching history for user {user_id}: {str(e)}")
        return jsonify({'error': 'Failed to retrieve history'}), 500
