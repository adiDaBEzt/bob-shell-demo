import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Plane } from 'lucide-react';
import { useFlight } from '@/hooks/useFlights';
import { useCreateBooking } from '@/hooks/useBookings';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatDateTime, calculateDuration, formatPrice, getErrorMessage } from '@/lib/utils';

export default function BookingPage() {
  const { flightId } = useParams<{ flightId: string }>();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { data: flight, isLoading } = useFlight(Number(flightId));
  const createBooking = useCreateBooking();

  const [name, setName] = useState(user?.name || '');
  const [confirmed, setConfirmed] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Please register or log in first');
      return;
    }

    if (!confirmed) {
      alert('Please confirm your booking');
      return;
    }

    try {
      const booking = await createBooking.mutateAsync({
        user_id: user.id,
        name: name,
        flight_id: Number(flightId),
      });
      console.log('Booking created:', booking);
      setBookingId(booking.id);
      setBookingSuccess(true);
    } catch (error: any) {
      console.error('Booking error:', error);
      alert(getErrorMessage(error));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cosmic-indigo mx-auto"></div>
          <p className="text-muted-foreground">Loading flight details...</p>
        </div>
      </div>
    );
  }

  if (!flight) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="glass-effect border-red-500/30 max-w-md">
          <CardHeader>
            <CardTitle className="text-red-400">Flight Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The flight you're looking for doesn't exist.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/flights" className="w-full">
              <Button className="w-full">Browse Flights</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (bookingSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="glass-effect border-green-500/30">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <CardTitle className="text-3xl text-green-400">Booking Confirmed!</CardTitle>
            <CardDescription className="text-base">
              Your interplanetary journey is booked
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <p className="text-sm text-muted-foreground mb-2">Booking ID</p>
              <p className="text-2xl font-bold text-cosmic-indigo">
                #{bookingId !== null ? bookingId : 'Processing...'}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Flight Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Route</p>
                  <p className="font-medium">
                    {flight.origin} <ArrowRight className="inline h-4 w-4 mx-1" /> {flight.destination}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Departure</p>
                  <p className="font-medium">{formatDateTime(flight.departure_time)}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-cosmic-indigo/10 border border-cosmic-indigo/30">
              <p className="text-sm text-muted-foreground mb-1">Total Paid</p>
              <p className="text-2xl font-bold text-cosmic-indigo">{formatPrice(flight.price)}</p>
            </div>
          </CardContent>
          <CardFooter className="flex gap-4">
            <Link to="/my-bookings" className="flex-1">
              <Button variant="outline" className="w-full">View My Bookings</Button>
            </Link>
            <Link to="/flights" className="flex-1">
              <Button className="w-full">Book Another Flight</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gradient">Complete Your Booking</h1>
        <p className="text-muted-foreground">Review your flight details and confirm</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Flight Details */}
        <Card className="glass-effect border-cosmic-indigo/20">
          <CardHeader>
            <Plane className="h-8 w-8 text-cosmic-indigo mb-2" />
            <CardTitle>Flight Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Route</p>
              <p className="text-xl font-bold">
                {flight.origin} <ArrowRight className="inline h-5 w-5 mx-2" /> {flight.destination}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Departure</p>
              <p className="font-medium">{formatDateTime(flight.departure_time)}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Arrival</p>
              <p className="font-medium">{formatDateTime(flight.arrival_time)}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">
                {calculateDuration(flight.departure_time, flight.arrival_time)}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-sm text-muted-foreground">Total Price</p>
              <p className="text-3xl font-bold text-cosmic-indigo">{formatPrice(flight.price)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card className="glass-effect border-cosmic-purple/20">
          <CardHeader>
            <CardTitle>Passenger Information</CardTitle>
            <CardDescription>Confirm your details to complete the booking</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {!user && (
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <p className="text-sm text-yellow-400">
                    Please register or log in to book a flight
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  disabled={!user}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="confirm"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                  disabled={!user}
                />
                <Label htmlFor="confirm" className="text-sm font-normal cursor-pointer">
                  I confirm the booking details and agree to the terms
                </Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={!user || !confirmed || createBooking.isPending}
              >
                {createBooking.isPending ? 'Processing...' : 'Confirm Booking'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

// Made with Bob
