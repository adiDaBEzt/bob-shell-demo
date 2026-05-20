# Galaxium Travels Booking System - Specification Sheet

## **Project Overview**
Build a REST API service for managing interplanetary flight bookings with comprehensive user management, flight inventory, and booking operations.

## **Core Requirements**

### **Data Models**
The system must manage three core entities:

**Users**
- Unique identifier (auto-generated)
- Name (required)
- Email address (required, unique, validated)

**Flights**
- Unique identifier (auto-generated)
- Origin location (required)
- Destination location (required)
- Departure time (required)
- Arrival time (required)
- Price (required, integer)
- Available seats count (required, integer, decrements on booking)

**Bookings**
- Unique identifier (auto-generated)
- User reference (required)
- Flight reference (required)
- Status (required: "booked", "cancelled", "completed")
- Booking timestamp (required, ISO format)

### **API Endpoints**

**User Management**
- `POST /register` - Create new user account
- `GET /user_id` - Retrieve user by name and email combination

**Flight Operations**
- `GET /flights` - List all available flights with current seat availability

**Booking Operations**
- `POST /book` - Create flight booking (requires user_id, name verification, flight_id)
- `GET /bookings/{user_id}` - Retrieve all bookings for a specific user
- `POST /cancel/{booking_id}` - Cancel existing booking and restore flight seat

## **Business Logic Requirements**

### **User Registration**
- Email addresses must be unique across the system
- Email format validation required
- Auto-generate sequential user IDs
- Return complete user object on successful registration

### **Flight Booking**
- Verify user exists and name matches user_id before booking
- Check flight exists and has available seats
- Decrement available seats count on successful booking
- Generate booking with "booked" status and current timestamp
- Atomic operation (all-or-nothing)

### **Booking Cancellation**
- Verify booking exists and is not already cancelled
- Update booking status to "cancelled"
- Increment flight's available seats count
- Return updated booking object

### **Data Integrity**
- All ID fields must auto-increment
- Seat counts cannot go below zero
- User/flight references must be valid
- Booking operations must be transactional

## **Error Handling Specifications**

### **Agent-Friendly Error Design**
- Return HTTP 200 for business logic errors with structured error response
- Reserve HTTP 4xx/5xx for system/validation errors only
- Include actionable guidance in error messages

### **Required Error Response Format**
```json
{
  "success": false,
  "error": "Human-readable error message",
  "error_code": "MACHINE_READABLE_CODE",
  "details": "Specific guidance on how to resolve the issue"
}
```

### **Standard Error Codes**
- `FLIGHT_NOT_FOUND` - Flight doesn't exist
- `NO_SEATS_AVAILABLE` - Flight fully booked
- `USER_NOT_FOUND` - User not registered
- `NAME_MISMATCH` - User ID doesn't match provided name
- `EMAIL_EXISTS` - Email already registered
- `BOOKING_NOT_FOUND` - Booking doesn't exist
- `ALREADY_CANCELLED` - Booking already cancelled

## **Technical Requirements**

### **API Standards**
- RESTful design principles
- JSON request/response format
- OpenAPI 3.0 specification
- CORS support for web applications
- Input validation and sanitization

### **Data Persistence**
- Relational database with ACID compliance
- Foreign key constraints between entities
- Transaction support for booking operations
- Data seeding capability for demo/testing

### **Testing Requirements**
- 100% code coverage target
- Unit tests for all business logic
- Integration tests for all API endpoints
- Error scenario testing
- Database transaction testing
- Automated test runner with multiple execution modes

### **Deployment Specifications**
- Containerized application (Docker)
- Environment-based configuration
- Health check endpoint
- Graceful shutdown handling
- Port 8082 default (configurable)

## **Quality Standards**

### **Performance**
- Sub-second response times for all operations
- Concurrent request handling
- Database connection pooling
- Efficient query patterns

### **Reliability**
- Comprehensive error handling
- Database rollback on failures
- Input validation at API boundary
- Logging for debugging and monitoring

### **Maintainability**
- Clear code structure and documentation
- Type hints and validation
- Consistent naming conventions
- Modular architecture (models, database, API layers)

## **Success Criteria**
1. All API endpoints function according to specification
2. Business logic correctly handles edge cases
3. Error messages provide actionable guidance for AI agents
4. Test suite achieves 100% coverage and passes consistently
5. Application deploys successfully in containerized environment
6. Database operations maintain data integrity under concurrent access

## **Demo Data Requirements**
System should include seeding capability with:
- 10+ sample users with space-themed details
- 10+ sample flights covering various interplanetary routes
- 20+ sample bookings with mixed statuses
- Realistic pricing and scheduling data

## **Setup**
- There is a venv folder in the root directory. Use it!
- Create a simple start.sh script at the root directory to run the application