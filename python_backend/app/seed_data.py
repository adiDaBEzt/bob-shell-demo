"""
Database seeding script for demo data
"""
from datetime import datetime, timedelta
from app.database import get_db_context, init_db
from app.models import User, Flight, Booking


def seed_database():
    """Seed the database with demo data"""
    
    # Initialize database
    init_db()
    
    with get_db_context() as db:
        # Clear existing data
        db.query(Booking).delete()
        db.query(Flight).delete()
        db.query(User).delete()
        db.commit()
        
        # Create sample users
        users = [
            User(name="Luna Starwalker", email="luna.starwalker@galaxy.com"),
            User(name="Orion Nebula", email="orion.nebula@cosmos.net"),
            User(name="Nova Celestia", email="nova.celestia@space.io"),
            User(name="Atlas Voyager", email="atlas.voyager@stellar.com"),
            User(name="Vega Moonlight", email="vega.moonlight@astro.org"),
            User(name="Sirius Blackhole", email="sirius.blackhole@universe.com"),
            User(name="Andromeda Swift", email="andromeda.swift@galaxy.net"),
            User(name="Phoenix Stardust", email="phoenix.stardust@cosmos.io"),
            User(name="Cassiopeia Ray", email="cassiopeia.ray@space.com"),
            User(name="Draco Skywalker", email="draco.skywalker@stellar.org"),
            User(name="Lyra Constellation", email="lyra.constellation@astro.com"),
            User(name="Perseus Galaxy", email="perseus.galaxy@universe.net"),
        ]
        
        for user in users:
            db.add(user)
        db.commit()
        
        # Create sample flights
        base_time = datetime.utcnow() + timedelta(days=1)
        
        flights = [
            Flight(
                origin="Earth",
                destination="Mars",
                departure_time=base_time + timedelta(hours=2),
                arrival_time=base_time + timedelta(hours=8),
                price=5000,
                available_seats=50
            ),
            Flight(
                origin="Mars",
                destination="Jupiter",
                departure_time=base_time + timedelta(hours=12),
                arrival_time=base_time + timedelta(days=2),
                price=15000,
                available_seats=30
            ),
            Flight(
                origin="Earth",
                destination="Moon",
                departure_time=base_time + timedelta(hours=1),
                arrival_time=base_time + timedelta(hours=2),
                price=1000,
                available_seats=100
            ),
            Flight(
                origin="Moon",
                destination="Earth",
                departure_time=base_time + timedelta(hours=4),
                arrival_time=base_time + timedelta(hours=5),
                price=1000,
                available_seats=100
            ),
            Flight(
                origin="Earth",
                destination="Venus",
                departure_time=base_time + timedelta(hours=6),
                arrival_time=base_time + timedelta(hours=10),
                price=4500,
                available_seats=40
            ),
            Flight(
                origin="Mars",
                destination="Saturn",
                departure_time=base_time + timedelta(days=1),
                arrival_time=base_time + timedelta(days=5),
                price=25000,
                available_seats=20
            ),
            Flight(
                origin="Jupiter",
                destination="Saturn",
                departure_time=base_time + timedelta(days=2),
                arrival_time=base_time + timedelta(days=4),
                price=18000,
                available_seats=25
            ),
            Flight(
                origin="Earth",
                destination="Mercury",
                departure_time=base_time + timedelta(hours=3),
                arrival_time=base_time + timedelta(hours=7),
                price=3500,
                available_seats=60
            ),
            Flight(
                origin="Venus",
                destination="Mars",
                departure_time=base_time + timedelta(hours=14),
                arrival_time=base_time + timedelta(hours=20),
                price=6000,
                available_seats=35
            ),
            Flight(
                origin="Saturn",
                destination="Earth",
                departure_time=base_time + timedelta(days=6),
                arrival_time=base_time + timedelta(days=12),
                price=28000,
                available_seats=15
            ),
            Flight(
                origin="Mars",
                destination="Earth",
                departure_time=base_time + timedelta(hours=16),
                arrival_time=base_time + timedelta(hours=22),
                price=5000,
                available_seats=45
            ),
            Flight(
                origin="Jupiter",
                destination="Earth",
                departure_time=base_time + timedelta(days=3),
                arrival_time=base_time + timedelta(days=7),
                price=20000,
                available_seats=18
            ),
        ]
        
        for flight in flights:
            db.add(flight)
        db.commit()
        
        # Create sample bookings
        bookings = [
            # Luna's bookings
            Booking(
                user_id=1,
                flight_id=1,
                status="booked",
                booking_time=datetime.utcnow() - timedelta(hours=2)
            ),
            Booking(
                user_id=1,
                flight_id=3,
                status="completed",
                booking_time=datetime.utcnow() - timedelta(days=5)
            ),
            # Orion's bookings
            Booking(
                user_id=2,
                flight_id=2,
                status="booked",
                booking_time=datetime.utcnow() - timedelta(hours=5)
            ),
            Booking(
                user_id=2,
                flight_id=5,
                status="cancelled",
                booking_time=datetime.utcnow() - timedelta(days=1)
            ),
            # Nova's bookings
            Booking(
                user_id=3,
                flight_id=1,
                status="booked",
                booking_time=datetime.utcnow() - timedelta(hours=1)
            ),
            Booking(
                user_id=3,
                flight_id=4,
                status="booked",
                booking_time=datetime.utcnow() - timedelta(hours=3)
            ),
            # Atlas's bookings
            Booking(
                user_id=4,
                flight_id=6,
                status="booked",
                booking_time=datetime.utcnow() - timedelta(hours=8)
            ),
            Booking(
                user_id=4,
                flight_id=3,
                status="completed",
                booking_time=datetime.utcnow() - timedelta(days=10)
            ),
            # Vega's bookings
            Booking(
                user_id=5,
                flight_id=7,
                status="booked",
                booking_time=datetime.utcnow() - timedelta(hours=4)
            ),
            Booking(
                user_id=5,
                flight_id=8,
                status="cancelled",
                booking_time=datetime.utcnow() - timedelta(days=2)
            ),
            # Sirius's bookings
            Booking(
                user_id=6,
                flight_id=9,
                status="booked",
                booking_time=datetime.utcnow() - timedelta(hours=6)
            ),
            # Andromeda's bookings
            Booking(
                user_id=7,
                flight_id=10,
                status="booked",
                booking_time=datetime.utcnow() - timedelta(hours=7)
            ),
            Booking(
                user_id=7,
                flight_id=1,
                status="booked",
                booking_time=datetime.utcnow() - timedelta(minutes=30)
            ),
            # Phoenix's bookings
            Booking(
                user_id=8,
                flight_id=11,
                status="booked",
                booking_time=datetime.utcnow() - timedelta(hours=9)
            ),
            Booking(
                user_id=8,
                flight_id=3,
                status="completed",
                booking_time=datetime.utcnow() - timedelta(days=7)
            ),
            # Cassiopeia's bookings
            Booking(
                user_id=9,
                flight_id=12,
                status="booked",
                booking_time=datetime.utcnow() - timedelta(hours=10)
            ),
            # Draco's bookings
            Booking(
                user_id=10,
                flight_id=2,
                status="cancelled",
                booking_time=datetime.utcnow() - timedelta(days=3)
            ),
            Booking(
                user_id=10,
                flight_id=5,
                status="booked",
                booking_time=datetime.utcnow() - timedelta(hours=11)
            ),
            # Lyra's bookings
            Booking(
                user_id=11,
                flight_id=6,
                status="booked",
                booking_time=datetime.utcnow() - timedelta(hours=12)
            ),
            # Perseus's bookings
            Booking(
                user_id=12,
                flight_id=7,
                status="booked",
                booking_time=datetime.utcnow() - timedelta(hours=13)
            ),
            Booking(
                user_id=12,
                flight_id=4,
                status="completed",
                booking_time=datetime.utcnow() - timedelta(days=8)
            ),
        ]
        
        for booking in bookings:
            db.add(booking)
        
        # Adjust available seats based on active bookings
        for booking in bookings:
            if booking.status == "booked":
                flight = db.query(Flight).filter(Flight.id == booking.flight_id).first()
                if flight:
                    flight.available_seats -= 1
        
        db.commit()
        
        print("✅ Database seeded successfully!")
        print(f"   - Created {len(users)} users")
        print(f"   - Created {len(flights)} flights")
        print(f"   - Created {len(bookings)} bookings")


if __name__ == "__main__":
    seed_database()