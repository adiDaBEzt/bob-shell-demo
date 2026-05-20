import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function AgentBookingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gradient">All Bookings</h1>
        <p className="text-muted-foreground">
          View and manage all customer bookings
        </p>
      </div>

      {/* Info Card */}
      <Card className="glass-effect border-yellow-500/30 max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-yellow-400" />
            <CardTitle>Feature Coming Soon</CardTitle>
          </div>
          <CardDescription>
            This feature requires additional backend endpoints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The "All Bookings" view for agents requires a backend endpoint that returns
            all bookings across all users. This endpoint is not currently implemented
            in the backend API.
          </p>
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm font-medium mb-2">Required Endpoint:</p>
            <code className="text-xs text-cosmic-cyan">GET /bookings</code>
            <p className="text-xs text-muted-foreground mt-2">
              Should return all bookings with user and flight details
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Made with Bob
