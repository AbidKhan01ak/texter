from app import db
from datetime import datetime
import logging

# Set up logging
logger = logging.getLogger(__name__)

class History(db.Model):
    __tablename__ = 'history'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    action = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    user = db.relationship('User', backref=db.backref('history', lazy=True))
    
    @staticmethod
    def clean_up_history(user_id, limit=50):
        try:
            # Fetch history entries for the user, ordered by timestamp (most recent first)
            user_history = (
                db.session.query(History)
                .filter_by(user_id=user_id)
                .order_by(History.timestamp.desc())  # Order by most recent first
                .all()
            )
            
            # Remove duplicates - Keep only the most recent action
            seen_actions = set()
            duplicate_entries = []
            for entry in user_history:
                if entry.action in seen_actions:
                    duplicate_entries.append(entry)
                else:
                    seen_actions.add(entry.action)
            
            # Delete the duplicate entries
            if duplicate_entries:
                db.session.query(History).filter(History.id.in_([entry.id for entry in duplicate_entries])).delete(synchronize_session=False)
                logger.info(f"Removed {len(duplicate_entries)} duplicate history entries for user {user_id}")

            # Re-fetch the updated history after removing duplicates
            user_history = (
                db.session.query(History)
                .filter_by(user_id=user_id)
                .order_by(History.timestamp.desc())
                .all()
            )

            # Check if history exceeds the limit after removing duplicates
            if len(user_history) > limit:
                # Fetch the least recently used (oldest) entries beyond the limit
                excess_entries = user_history[limit:]  # Entries beyond the limit
                db.session.query(History).filter(History.id.in_([entry.id for entry in excess_entries])).delete(synchronize_session=False)
                db.session.commit()  # Commit the changes
                logger.info(f"Cleaned up {len(excess_entries)} history entries for user {user_id}, keeping the most recent {limit} actions")

        except Exception as e:
            db.session.rollback()  # Rollback in case of an error
            logger.error(f"Error during history cleanup for user {user_id}: {e}")  # Log the error

