import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plane, ArrowRight, XCircle } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { useUserBookings, useCancelBooking } from '@/hooks/useBookings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime, formatPrice, getStatusColor } from '@/lib/utils';

export default function MyBookingsPage() {
  const { user } = useUserStore();
  const { data: bookings, isLoading } = useUserBookings(user?.id);
  const cancelBooking = useCancelBooking();
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const handleCancel = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await cancelBooking.mutateAsync(bookingId);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="glass-effect border-yellow-500/30 max-w-md">
          <CardHeader>
            <CardTitle>Not Logged In</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Please log in to view your bookings.
            </p>
          </CardContent>
          <CardFooter>
            <Link to="/" className="w-full">
              <Button className="w-full">Go to Home</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cosmic-indigo mx-auto"></div>
          <p className="text-muted-foreground">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gradient">My Bookings</h1>
        <p className="text-muted-foreground">
          View and manage your upcoming space travels
        </p>
      </div>

      {/* Bookings List */}
      {bookings && bookings.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <Card
              key={booking.id}
              className="glass-effect border-cosmic-indigo/20 hover:border-cosmic-indigo/40 transition-all"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Plane className="h-5 w-5 text-cosmic-indigo" />
                    <span className="text-sm text-muted-foreground">
                      Booking #{booking.id}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status.toUpperCase()}
                  </span>
                </div>
                <CardTitle className="text-xl">
                  {booking.flight?.origin}{' '}
                  <ArrowRight className="inline h-4 w-4 mx-1" />{' '}
                  {booking.flight?.destination}
                </CardTitle>
                <CardDescription>
                  Flight #{booking.flight_id}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Departure */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Departure</p>
                  <p className="font-medium">
                    {booking.flight?.departure_time &&
                      formatDateTime(booking.flight.departure_time)}
                  </p>
                </div>

                {/* Arrival */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Arrival</p>
                  <p className="font-medium">
                    {booking.flight?.arrival_time &&
                      formatDateTime(booking.flight.arrival_time)}
                  </p>
                </div>

                {/* Booking Time */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-cosmic-cyan" />
                  <span className="text-muted-foreground">Booked:</span>
                  <span className="font-medium">
                    {formatDateTime(booking.booking_time)}
                  </span>
                </div>

                {/* Price */}
                <div className="pt-2 border-t border-white/10">
                  <p className="text-sm text-muted-foreground">Price Paid</p>
                  <p className="text-2xl font-bold text-cosmic-indigo">
                    {booking.flight?.price && formatPrice(booking.flight.price)}
                  </p>
                </div>
              </CardContent>

              {booking.status === 'booked' && (
                <CardFooter>
                  <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={() => handleCancel(booking.id)}
                    disabled={cancellingId === booking.id}
                  >
                    <XCircle className="h-4 w-4" />
                    {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass-effect border-cosmic-indigo/20 max-w-md mx-auto">
          <CardHeader>
            <CardTitle>No Bookings Yet</CardTitle>
            <CardDescription>
              You haven't booked any flights yet. Start your space adventure today!
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link to="/flights" className="w-full">
              <Button className="w-full">Browse Flights</Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

// Made with Bob
