"""
Pydantic schemas for request/response validation
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Literal, Union, Optional
from datetime import datetime


class UserCreate(BaseModel):
    """Schema for user registration"""
    name: str = Field(..., min_length=1, description="User's full name")
    email: EmailStr = Field(..., description="User's email address")


class UserResponse(BaseModel):
    """Schema for user response"""
    id: int
    name: str
    email: str


class UserIdRequest(BaseModel):
    """Schema for getting user ID"""
    name: str
    email: EmailStr


class BookingCreate(BaseModel):
    """Schema for creating a booking"""
    user_id: int = Field(..., gt=0, description="User ID")
    name: str = Field(..., min_length=1, description="User's name for verification")
    flight_id: int = Field(..., gt=0, description="Flight ID")


class BookingResponse(BaseModel):
    """Schema for booking response"""
    id: int
    user_id: int
    flight_id: int
    status: Literal["booked", "cancelled", "completed"]
    booking_time: str


class FlightResponse(BaseModel):
    """Schema for flight response"""
    id: int
    origin: str
    destination: str
    departure_time: str
    arrival_time: str
    price: int
    available_seats: int


class ErrorResponse(BaseModel):
    """Schema for error responses"""
    success: bool = False
    error: str
    error_code: str
    details: str


class SuccessResponse(BaseModel):
    """Schema for success responses"""
    success: bool = True
    data: Optional[Union[dict, list]] = None