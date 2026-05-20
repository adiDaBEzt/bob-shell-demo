"""
Main FastAPI application for Galaxium Travels Booking System
"""
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from typing import List

from app.database import get_db, init_db
from app.models import User, Flight, Booking
from app.schemas import (
    UserCreate, UserResponse, UserIdRequest,
    BookingCreate, BookingResponse,
    FlightResponse, ErrorResponse
)

# Create FastAPI app
app = FastAPI(
    title="Galaxium Travels Booking System",
    description="REST API for managing interplanetary flight bookings",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "Galaxium Travels API"}


@app.post("/register")
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user
    
    - **name**: User's full name (required)
    - **email**: User's email address (required, must be unique)
    """
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        return {
            "success": False,
            "error": "Email address already registered",
            "error_code": "EMAIL_EXISTS",
            "details": "Please use a different email address or retrieve your existing user ID"
        }
    
    try:
        # Create new user
        new_user = User(
            name=user_data.name,
            email=user_data.email
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return new_user.to_dict()
    
    except IntegrityError:
        db.rollback()
        return {
            "success": False,
            "error": "Email address already registered",
            "error_code": "EMAIL_EXISTS",
            "details": "Please use a different email address or retrieve your existing user ID"
        }


@app.get("/user_id")
async def get_user_id(name: str, email: str, db: Session = Depends(get_db)):
    """
    Get user ID by name and email combination
    
    - **name**: User's name
    - **email**: User's email address
    """
    user = db.query(User).filter(
        User.name == name,
        User.email == email
    ).first()
    
    if not user:
        return {
            "success": False,
            "error": "User not found with provided name and email",
            "error_code": "USER_NOT_FOUND",
            "details": "Please check your name and email, or register a new account"
        }
    
    return {"success": True, "data": user.to_dict()}


@app.get("/flights", response_model=List[FlightResponse])
async def get_flights(db: Session = Depends(get_db)):
    """
    Get all available flights with current seat availability
    """
    flights = db.query(Flight).all()
    return [flight.to_dict() for flight in flights]


@app.post("/book")
async def create_booking(booking_data: BookingCreate, db: Session = Depends(get_db)):
    """
    Create a new flight booking
    
    - **user_id**: User ID (required)
    - **name**: User's name for verification (required)
    - **flight_id**: Flight ID (required)
    """
    # Verify user exists
    user = db.query(User).filter(User.id == booking_data.user_id).first()
    if not user:
        return {
            "success": False,
            "error": "User not found",
            "error_code": "USER_NOT_FOUND",
            "details": f"No user found with ID {booking_data.user_id}. Please register first."
        }
    
    # Verify name matches user_id
    if user.name != booking_data.name:
        return {
            "success": False,
            "error": "Name does not match user ID",
            "error_code": "NAME_MISMATCH",
            "details": f"The name '{booking_data.name}' does not match the user with ID {booking_data.user_id}"
        }
    
    # Verify flight exists
    flight = db.query(Flight).filter(Flight.id == booking_data.flight_id).first()
    if not flight:
        return {
            "success": False,
            "error": "Flight not found",
            "error_code": "FLIGHT_NOT_FOUND",
            "details": f"No flight found with ID {booking_data.flight_id}"
        }
    
    # Check seat availability
    if flight.available_seats <= 0:
        return {
            "success": False,
            "error": "No seats available on this flight",
            "error_code": "NO_SEATS_AVAILABLE",
            "details": f"Flight {flight.id} from {flight.origin} to {flight.destination} is fully booked"
        }
    
    try:
        # Create booking and decrement seats atomically
        new_booking = Booking(
            user_id=booking_data.user_id,
            flight_id=booking_data.flight_id,
            status="booked",
            booking_time=datetime.utcnow()
        )
        
        # Decrement available seats
        flight.available_seats -= 1
        
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)
        
        return {"success": True, "data": new_booking.to_dict()}
    
    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "error": "Failed to create booking",
            "error_code": "BOOKING_FAILED",
            "details": str(e)
        }


@app.get("/bookings/{user_id}")
async def get_user_bookings(user_id: int, db: Session = Depends(get_db)):
    """
    Get all bookings for a specific user
    
    - **user_id**: User ID
    """
    # Verify user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {
            "success": False,
            "error": "User not found",
            "error_code": "USER_NOT_FOUND",
            "details": f"No user found with ID {user_id}"
        }
    
    bookings = db.query(Booking).filter(Booking.user_id == user_id).all()
    return {"success": True, "data": [booking.to_dict() for booking in bookings]}


@app.post("/cancel/{booking_id}")
async def cancel_booking(booking_id: int, db: Session = Depends(get_db)):
    """
    Cancel an existing booking and restore flight seat
    
    - **booking_id**: Booking ID to cancel
    """
    # Find booking
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        return {
            "success": False,
            "error": "Booking not found",
            "error_code": "BOOKING_NOT_FOUND",
            "details": f"No booking found with ID {booking_id}"
        }
    
    # Check if already cancelled
    if booking.status == "cancelled":
        return {
            "success": False,
            "error": "Booking already cancelled",
            "error_code": "ALREADY_CANCELLED",
            "details": f"Booking {booking_id} was already cancelled"
        }
    
    try:
        # Update booking status and restore seat
        booking.status = "cancelled"
        
        # Restore seat to flight
        flight = db.query(Flight).filter(Flight.id == booking.flight_id).first()
        if flight:
            flight.available_seats += 1
        
        db.commit()
        db.refresh(booking)
        
        return {"success": True, "data": booking.to_dict()}
    
    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "error": "Failed to cancel booking",
            "error_code": "CANCELLATION_FAILED",
            "details": str(e)
        }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8082)