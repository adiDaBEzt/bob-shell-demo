# Galaxium Travels Booking System

A REST API service for managing interplanetary flight bookings with comprehensive user management, flight inventory, and booking operations.

## Features

- **User Management**: Register users and retrieve user information
- **Flight Operations**: Browse available interplanetary flights
- **Booking System**: Create, view, and cancel flight bookings
- **Data Integrity**: ACID-compliant transactions with proper seat management
- **Agent-Friendly Errors**: Structured error responses with actionable guidance
- **Comprehensive Testing**: 100% code coverage with unit and integration tests

## Tech Stack

- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **SQLite**: Lightweight database (easily swappable)
- **Pydantic**: Data validation using Python type annotations
- **Pytest**: Testing framework with coverage reporting
- **Docker**: Containerized deployment

## Project Structure

```
python_backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI application and endpoints
│   ├── models.py         # SQLAlchemy database models
│   ├── database.py       # Database configuration
│   ├── schemas.py        # Pydantic schemas for validation
│   └── seed_data.py      # Database seeding script
├── tests/
│   ├── __init__.py
│   └── test_api.py       # Comprehensive API tests
├── requirements.txt      # Python dependencies
├── Dockerfile           # Container configuration
├── pytest.ini           # Pytest configuration
└── README.md            # This file
```

## Setup and Installation

### Prerequisites

- Python 3.11+
- Virtual environment (venv)

### Local Development

1. **Activate the virtual environment** (assuming venv exists in root):
   ```bash
   source ../venv/bin/activate  # On macOS/Linux
   # or
   ..\venv\Scripts\activate     # On Windows
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Seed the database** (optional, for demo data):
   ```bash
   python -m app.seed_data
   ```

4. **Run the application**:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8082 --reload
   ```

5. **Access the API**:
   - API: http://localhost:8082
   - Interactive docs: http://localhost:8082/docs
   - Alternative docs: http://localhost:8082/redoc

### Using Docker

1. **Build the image**:
   ```bash
   docker build -t galaxium-travels .
   ```

2. **Run the container**:
   ```bash
   docker run -p 8082:8082 galaxium-travels
   ```

## API Endpoints

### User Management

- `POST /register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com"
  }
  ```

- `GET /user_id?name={name}&email={email}` - Get user ID by name and email

### Flight Operations

- `GET /flights` - List all available flights

### Booking Operations

- `POST /book` - Create a flight booking
  ```json
  {
    "user_id": 1,
    "name": "John Doe",
    "flight_id": 1
  }
  ```

- `GET /bookings/{user_id}` - Get all bookings for a user

- `POST /cancel/{booking_id}` - Cancel a booking

### Health Check

- `GET /health` - Check API health status

## Testing

### Run all tests:
```bash
pytest
```

### Run tests with coverage:
```bash
pytest --cov=app --cov-report=html
```

### Run specific test class:
```bash
pytest tests/test_api.py::TestUserRegistration -v
```

### View coverage report:
```bash
open htmlcov/index.html  # On macOS
```

## Error Handling

The API uses agent-friendly error responses with HTTP 200 status for business logic errors:

```json
{
  "success": false,
  "error": "Human-readable error message",
  "error_code": "MACHINE_READABLE_CODE",
  "details": "Specific guidance on resolution"
}
```

### Error Codes

- `FLIGHT_NOT_FOUND` - Flight doesn't exist
- `NO_SEATS_AVAILABLE` - Flight fully booked
- `USER_NOT_FOUND` - User not registered
- `NAME_MISMATCH` - User ID doesn't match provided name
- `EMAIL_EXISTS` - Email already registered
- `BOOKING_NOT_FOUND` - Booking doesn't exist
- `ALREADY_CANCELLED` - Booking already cancelled

## Database Schema

### Users
- `id`: Auto-incrementing primary key
- `name`: User's full name
- `email`: Unique email address

### Flights
- `id`: Auto-incrementing primary key
- `origin`: Departure location
- `destination`: Arrival location
- `departure_time`: Departure timestamp
- `arrival_time`: Arrival timestamp
- `price`: Ticket price (integer)
- `available_seats`: Current seat availability

### Bookings
- `id`: Auto-incrementing primary key
- `user_id`: Foreign key to users
- `flight_id`: Foreign key to flights
- `status`: Booking status (booked/cancelled/completed)
- `booking_time`: Booking creation timestamp

## Development

### Code Style
- Follow PEP 8 guidelines
- Use type hints for function parameters and returns
- Document functions with docstrings

### Adding New Features
1. Update models in `app/models.py`
2. Add/update schemas in `app/schemas.py`
3. Implement endpoints in `app/main.py`
4. Write tests in `tests/test_api.py`
5. Run tests to ensure coverage

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please open an issue in the repository.