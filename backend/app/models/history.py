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
            # Get the total count of history entries for the user
            history_count = db.session.query(History).filter_by(user_id=user_id).count()

            # Check if history count exceeds the limit
            if history_count > limit:
                # Fetch the oldest entries beyond the limit
                excess_entries = (
                    db.session.query(History)
                    .filter_by(user_id=user_id)
                    .order_by(History.timestamp.asc())
                    .offset(limit)  # Skip the first 'limit' number of records
                    .all()
                )
                
                # Bulk delete the excess entries
                db.session.query(History).filter(History.id.in_([entry.id for entry in excess_entries])).delete(synchronize_session=False)
                db.session.commit()  # Commit the changes
                
                logger.info(f"Cleaned up {len(excess_entries)} history entries for user {user_id}")
        
        except Exception as e:
            db.session.rollback()  # Rollback in case of an error
            logger.error(f"Error during history cleanup for user {user_id}: {e}")  # Log the error

