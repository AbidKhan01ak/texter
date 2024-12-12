from app import db
from datetime import datetime

class PasswordHistory(db.Model):
    __tablename__ = 'password_history'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    password = db.Column(db.String(255), nullable=False)
    generated_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    user = db.relationship('User', backref=db.backref('password_history', lazy=True, cascade="all, delete-orphan"))

    # Optional: Limit the number of password entries per user
    @staticmethod
    def clean_up_old_history(user_id, limit=5):
        # Delete old history if the user has more than 'limit' number of passwords stored
        history = PasswordHistory.query.filter_by(user_id=user_id).order_by(PasswordHistory.generated_at.desc()).all()
        if len(history) > limit:
            for old_entry in history[limit:]:
                db.session.delete(old_entry)
            db.session.commit()

    def __repr__(self):
        return f'<PasswordHistory user_id={self.user_id} generated_at={self.generated_at}>'
