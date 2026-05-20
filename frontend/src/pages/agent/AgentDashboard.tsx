import { Users, Plane, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AgentDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gradient">Agent Dashboard</h1>
        <p className="text-muted-foreground">
          Manage bookings and assist customers with their space travel needs
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="glass-effect border-cosmic-indigo/20">
          <CardHeader>
            <Users className="h-8 w-8 text-cosmic-indigo mb-2" />
            <CardTitle>Total Customers</CardTitle>
            <CardDescription>Registered users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-cosmic-indigo">-</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-cosmic-purple/20">
          <CardHeader>
            <Plane className="h-8 w-8 text-cosmic-purple mb-2" />
            <CardTitle>Active Flights</CardTitle>
            <CardDescription>Available routes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-cosmic-purple">-</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-cosmic-cyan/20">
          <CardHeader>
            <Calendar className="h-8 w-8 text-cosmic-cyan mb-2" />
            <CardTitle>Total Bookings</CardTitle>
            <CardDescription>All time</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-cosmic-cyan">-</p>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="glass-effect border-cosmic-indigo/20 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Agent Features</CardTitle>
          <CardDescription>What you can do in agent mode</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-cosmic-indigo mt-2" />
            <div>
              <p className="font-medium">View All Bookings</p>
              <p className="text-sm text-muted-foreground">
                Access and manage bookings for all customers
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-cosmic-purple mt-2" />
            <div>
              <p className="font-medium">Customer Management</p>
              <p className="text-sm text-muted-foreground">
                Search and assist customers with their bookings
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="h-2 w-2 rounded-full bg-cosmic-cyan mt-2" />
            <div>
              <p className="font-medium">Booking Operations</p>
              <p className="text-sm text-muted-foreground">
                Create and cancel bookings on behalf of customers
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Made with Bob
