# backend/app/models/password_history.py
from app import db
from datetime import datetime

class PasswordHistory(db.Model):
    __tablename__ = 'password_history'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    generated_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('password_history', lazy=True))
