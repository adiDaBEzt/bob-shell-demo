import { Link } from 'react-router-dom';
import { Plane, Clock, Users, ArrowRight } from 'lucide-react';
import { useFlights } from '@/hooks/useFlights';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime, calculateDuration, formatPrice } from '@/lib/utils';

export default function FlightsPage() {
  const { data: flights, isLoading, error } = useFlights();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cosmic-indigo mx-auto"></div>
          <p className="text-muted-foreground">Loading flights...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="glass-effect border-red-500/30 max-w-md">
          <CardHeader>
            <CardTitle className="text-red-400">Error Loading Flights</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Unable to load flights. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gradient">Available Flights</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Choose your destination and embark on an unforgettable journey through space
        </p>
      </div>

      {/* Flights Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {flights?.map((flight) => (
          <Card
            key={flight.id}
            className="glass-effect border-cosmic-indigo/20 hover:border-cosmic-indigo/40 transition-all hover:scale-105"
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <Plane className="h-6 w-6 text-cosmic-indigo" />
                <span className="text-xs text-muted-foreground">Flight #{flight.id}</span>
              </div>
              <CardTitle className="text-2xl">
                {flight.origin} <ArrowRight className="inline h-5 w-5 mx-2" /> {flight.destination}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Departure */}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Departure</p>
                <p className="font-medium">{formatDateTime(flight.departure_time)}</p>
              </div>

              {/* Arrival */}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Arrival</p>
                <p className="font-medium">{formatDateTime(flight.arrival_time)}</p>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-cosmic-cyan" />
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">
                  {calculateDuration(flight.departure_time, flight.arrival_time)}
                </span>
              </div>

              {/* Available Seats */}
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-cosmic-purple" />
                <span className="text-muted-foreground">Available Seats:</span>
                <span
                  className={`font-medium ${
                    flight.available_seats < 5 ? 'text-red-400' : 'text-green-400'
                  }`}
                >
                  {flight.available_seats}
                </span>
              </div>

              {/* Price */}
              <div className="pt-2 border-t border-white/10">
                <p className="text-2xl font-bold text-cosmic-indigo">
                  {formatPrice(flight.price)}
                </p>
              </div>
            </CardContent>

            <CardFooter>
              <Link to={`/book/${flight.id}`} className="w-full">
                <Button
                  className="w-full"
                  disabled={flight.available_seats === 0}
                >
                  {flight.available_seats === 0 ? 'Sold Out' : 'Book Now'}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {flights?.length === 0 && (
        <Card className="glass-effect border-cosmic-indigo/20 max-w-md mx-auto">
          <CardHeader>
            <CardTitle>No Flights Available</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              There are currently no flights available. Please check back later.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Made with Bob
