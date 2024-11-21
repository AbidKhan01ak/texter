from app import db
from datetime import datetime

class History(db.Model):
    __tablename__ = 'history'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action = db.Column(db.String(255), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('history', lazy=True))
    
    @staticmethod
    def clean_up_history(user_id):
        try:
            # Get the total count of history entries for the user
            history_count = db.session.query(History).filter_by(user_id=user_id).count()

            if history_count > 50:
            # Fetch the 10 oldest entries as a list
                oldest_entries = (
                    db.session.query(History)
                    .filter_by(user_id=user_id)
                    .order_by(History.timestamp.asc())
                    .limit(10)
                    .all()
            )
            # Delete each entry individually
            for entry in oldest_entries:
                db.session.delete(entry)
            db.session.commit()  # Commit the changes
        except Exception as e:
            db.session.rollback()  # Rollback in case of an error
            print(f"Error during cleanup: {e}")  # Log the error
