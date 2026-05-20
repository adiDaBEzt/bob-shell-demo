"""
Comprehensive API tests for Galaxium Travels Booking System
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta

from app.main import app
from app.database import get_db
from app.models import Base, User, Flight, Booking

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    """Override database dependency for testing"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_database():
    """Setup and teardown test database for each test"""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def sample_user():
    """Create a sample user for testing"""
    db = TestingSessionLocal()
    user = User(name="Test User", email="test@example.com")
    db.add(user)
    db.commit()
    db.refresh(user)
    db.close()
    return user


@pytest.fixture
def sample_flight():
    """Create a sample flight for testing"""
    db = TestingSessionLocal()
    flight = Flight(
        origin="Earth",
        destination="Mars",
        departure_time=datetime.utcnow() + timedelta(hours=24),
        arrival_time=datetime.utcnow() + timedelta(hours=30),
        price=5000,
        available_seats=50
    )
    db.add(flight)
    db.commit()
    db.refresh(flight)
    db.close()
    return flight


class TestHealthCheck:
    """Test health check endpoint"""
    
    def test_health_check(self):
        """Test health check returns healthy status"""
        response = client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "service" in data


class TestUserRegistration:
    """Test user registration endpoint"""
    
    def test_register_user_success(self):
        """Test successful user registration"""
        response = client.post(
            "/register",
            json={"name": "John Doe", "email": "john@example.com"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "John Doe"
        assert data["email"] == "john@example.com"
        assert "id" in data
    
    def test_register_duplicate_email(self):
        """Test registration with duplicate email"""
        # First registration
        client.post(
            "/register",
            json={"name": "John Doe", "email": "john@example.com"}
        )
        
        # Second registration with same email
        response = client.post(
            "/register",
            json={"name": "Jane Doe", "email": "john@example.com"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert data["error_code"] == "EMAIL_EXISTS"
    
    def test_register_invalid_email(self):
        """Test registration with invalid email format"""
        response = client.post(
            "/register",
            json={"name": "John Doe", "email": "invalid-email"}
        )
        assert response.status_code == 422  # Validation error


class TestGetUserId:
    """Test get user ID endpoint"""
    
    def test_get_user_id_success(self, sample_user):
        """Test successful user ID retrieval"""
        response = client.get(
            f"/user_id?name={sample_user.name}&email={sample_user.email}"
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["id"] == sample_user.id
    
    def test_get_user_id_not_found(self):
        """Test user ID retrieval with non-existent user"""
        response = client.get(
            "/user_id?name=NonExistent&email=nonexistent@example.com"
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert data["error_code"] == "USER_NOT_FOUND"


class TestFlights:
    """Test flight listing endpoint"""
    
    def test_get_flights_empty(self):
        """Test getting flights when none exist"""
        response = client.get("/flights")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 0
    
    def test_get_flights_with_data(self, sample_flight):
        """Test getting flights with data"""
        response = client.get("/flights")
        assert response.status_code == 200
        data = response.json()
        assert len(data) == 1
        assert data[0]["id"] == sample_flight.id
        assert data[0]["origin"] == sample_flight.origin
        assert data[0]["destination"] == sample_flight.destination


class TestBooking:
    """Test booking creation endpoint"""
    
    def test_create_booking_success(self, sample_user, sample_flight):
        """Test successful booking creation"""
        response = client.post(
            "/book",
            json={
                "user_id": sample_user.id,
                "name": sample_user.name,
                "flight_id": sample_flight.id
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["user_id"] == sample_user.id
        assert data["data"]["flight_id"] == sample_flight.id
        assert data["data"]["status"] == "booked"
        
        # Verify seat was decremented
        flights_response = client.get("/flights")
        flights = flights_response.json()
        assert flights[0]["available_seats"] == sample_flight.available_seats - 1
    
    def test_create_booking_user_not_found(self, sample_flight):
        """Test booking with non-existent user"""
        response = client.post(
            "/book",
            json={
                "user_id": 9999,
                "name": "NonExistent",
                "flight_id": sample_flight.id
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert data["error_code"] == "USER_NOT_FOUND"
    
    def test_create_booking_name_mismatch(self, sample_user, sample_flight):
        """Test booking with name mismatch"""
        response = client.post(
            "/book",
            json={
                "user_id": sample_user.id,
                "name": "Wrong Name",
                "flight_id": sample_flight.id
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert data["error_code"] == "NAME_MISMATCH"
    
    def test_create_booking_flight_not_found(self, sample_user):
        """Test booking with non-existent flight"""
        response = client.post(
            "/book",
            json={
                "user_id": sample_user.id,
                "name": sample_user.name,
                "flight_id": 9999
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert data["error_code"] == "FLIGHT_NOT_FOUND"
    
    def test_create_booking_no_seats(self, sample_user):
        """Test booking when no seats available"""
        # Create flight with 0 seats
        db = TestingSessionLocal()
        flight = Flight(
            origin="Earth",
            destination="Mars",
            departure_time=datetime.utcnow() + timedelta(hours=24),
            arrival_time=datetime.utcnow() + timedelta(hours=30),
            price=5000,
            available_seats=0
        )
        db.add(flight)
        db.commit()
        db.refresh(flight)
        flight_id = flight.id
        db.close()
        
        response = client.post(
            "/book",
            json={
                "user_id": sample_user.id,
                "name": sample_user.name,
                "flight_id": flight_id
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert data["error_code"] == "NO_SEATS_AVAILABLE"


class TestGetBookings:
    """Test get user bookings endpoint"""
    
    def test_get_bookings_success(self, sample_user, sample_flight):
        """Test getting bookings for a user"""
        # Create a booking first
        db = TestingSessionLocal()
        booking = Booking(
            user_id=sample_user.id,
            flight_id=sample_flight.id,
            status="booked",
            booking_time=datetime.utcnow()
        )
        db.add(booking)
        db.commit()
        db.close()
        
        response = client.get(f"/bookings/{sample_user.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert len(data["data"]) == 1
        assert data["data"][0]["user_id"] == sample_user.id
    
    def test_get_bookings_user_not_found(self):
        """Test getting bookings for non-existent user"""
        response = client.get("/bookings/9999")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert data["error_code"] == "USER_NOT_FOUND"
    
    def test_get_bookings_empty(self, sample_user):
        """Test getting bookings when user has none"""
        response = client.get(f"/bookings/{sample_user.id}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert len(data["data"]) == 0


class TestCancelBooking:
    """Test booking cancellation endpoint"""
    
    def test_cancel_booking_success(self, sample_user, sample_flight):
        """Test successful booking cancellation"""
        # Create a booking first
        db = TestingSessionLocal()
        booking = Booking(
            user_id=sample_user.id,
            flight_id=sample_flight.id,
            status="booked",
            booking_time=datetime.utcnow()
        )
        db.add(booking)
        db.commit()
        db.refresh(booking)
        booking_id = booking.id
        
        # Decrement seat
        flight = db.query(Flight).filter(Flight.id == sample_flight.id).first()
        original_seats = flight.available_seats
        flight.available_seats -= 1
        db.commit()
        db.close()
        
        # Cancel booking
        response = client.post(f"/cancel/{booking_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert data["data"]["status"] == "cancelled"
        
        # Verify seat was restored
        flights_response = client.get("/flights")
        flights = flights_response.json()
        assert flights[0]["available_seats"] == original_seats
    
    def test_cancel_booking_not_found(self):
        """Test cancelling non-existent booking"""
        response = client.post("/cancel/9999")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert data["error_code"] == "BOOKING_NOT_FOUND"
    
    def test_cancel_already_cancelled(self, sample_user, sample_flight):
        """Test cancelling already cancelled booking"""
        # Create a cancelled booking
        db = TestingSessionLocal()
        booking = Booking(
            user_id=sample_user.id,
            flight_id=sample_flight.id,
            status="cancelled",
            booking_time=datetime.utcnow()
        )
        db.add(booking)
        db.commit()
        db.refresh(booking)
        booking_id = booking.id
        db.close()
        
        response = client.post(f"/cancel/{booking_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is False
        assert data["error_code"] == "ALREADY_CANCELLED"


class TestDataIntegrity:
    """Test data integrity and edge cases"""
    
    def test_concurrent_bookings(self, sample_user, sample_flight):
        """Test that seat count is properly managed with multiple bookings"""
        initial_seats = sample_flight.available_seats
        
        # Create multiple bookings
        for i in range(3):
            response = client.post(
                "/book",
                json={
                    "user_id": sample_user.id,
                    "name": sample_user.name,
                    "flight_id": sample_flight.id
                }
            )
            assert response.status_code == 200
            assert response.json()["success"] is True
        
        # Check final seat count
        flights_response = client.get("/flights")
        flights = flights_response.json()
        assert flights[0]["available_seats"] == initial_seats - 3
    
    def test_booking_and_cancellation_cycle(self, sample_user, sample_flight):
        """Test booking and cancellation maintains seat count"""
        initial_seats = sample_flight.available_seats
        
        # Create booking
        book_response = client.post(
            "/book",
            json={
                "user_id": sample_user.id,
                "name": sample_user.name,
                "flight_id": sample_flight.id
            }
        )
        booking_id = book_response.json()["data"]["id"]
        
        # Cancel booking
        client.post(f"/cancel/{booking_id}")
        
        # Check seat count restored
        flights_response = client.get("/flights")
        flights = flights_response.json()
        assert flights[0]["available_seats"] == initial_seats