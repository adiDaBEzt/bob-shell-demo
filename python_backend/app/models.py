"""
Database models for Galaxium Travels Booking System
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()


class User(Base):
    """User model for customer accounts"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)

    # Relationship
    bookings = relationship("Booking", back_populates="user")

    def to_dict(self):
        """Convert user to dictionary"""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email
        }


class Flight(Base):
    """Flight model for interplanetary routes"""
    __tablename__ = "flights"

    id = Column(Integer, primary_key=True, autoincrement=True)
    origin = Column(String, nullable=False)
    destination = Column(String, nullable=False)
    departure_time = Column(DateTime, nullable=False)
    arrival_time = Column(DateTime, nullable=False)
    price = Column(Integer, nullable=False)
    available_seats = Column(Integer, nullable=False)

    # Constraint to ensure seats don't go negative
    __table_args__ = (
        CheckConstraint('available_seats >= 0', name='check_seats_non_negative'),
    )

    # Relationship
    bookings = relationship("Booking", back_populates="flight")

    def to_dict(self):
        """Convert flight to dictionary"""
        return {
            "id": self.id,
            "origin": self.origin,
            "destination": self.destination,
            "departure_time": self.departure_time.isoformat(),
            "arrival_time": self.arrival_time.isoformat(),
            "price": self.price,
            "available_seats": self.available_seats
        }


class Booking(Base):
    """Booking model for flight reservations"""
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    flight_id = Column(Integer, ForeignKey("flights.id"), nullable=False)
    status = Column(String, nullable=False)  # booked, cancelled, completed
    booking_time = Column(DateTime, nullable=False, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="bookings")
    flight = relationship("Flight", back_populates="bookings")

    def to_dict(self):
        """Convert booking to dictionary"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "flight_id": self.flight_id,
            "status": self.status,
            "booking_time": self.booking_time.isoformat()
        }