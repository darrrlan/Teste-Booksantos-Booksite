from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Apartment(db.Model):
    __tablename__ = 'apartaments'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100), nullable=False)
    state = db.Column(db.String(100), nullable=False)
    max_guests = db.Column(db.Integer, nullable=False)
    daily_rate = db.Column(db.Numeric(10,2), nullable=False)

class Contact(db.Model):
    __tablename__ = 'contacts'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    type = db.Column(db.String(20), nullable=False)
    document = db.Column(db.String(20), nullable=False, unique=True)
    
class Reservation(db.Model):
    __tablename__ = 'reservations'
    id = db.Column(db.Integer, primary_key=True)
    apartment_id = db.Column(db.Integer, db.ForeignKey('apartaments.id'), nullable=False)
    contact_id = db.Column(db.Integer, db.ForeignKey('contacts.id'), nullable=False)
    checkin_date = db.Column(db.Date, nullable=False)
    checkout_date = db.Column(db.Date, nullable=False)
    guests = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Numeric(10,2), nullable=False)
    channel = db.Column(db.String(20), nullable=False)

    apartment = db.relationship('Apartment', backref='reservations')
    contact = db.relationship('Contact', backref='reservations')
