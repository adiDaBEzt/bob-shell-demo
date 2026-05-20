import { Link } from 'react-router-dom';
import { Rocket, Zap, Globe, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RegistrationModal from '@/components/customer/RegistrationModal';
import { useUserStore } from '@/store/userStore';

export default function HomePage() {
  const user = useUserStore((state) => state.user);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-12">
        <div className="inline-block">
          <Rocket className="h-16 w-16 text-cosmic-indigo mx-auto mb-4 animate-float" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold">
          <span className="text-gradient">Explore the Galaxy</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Book your next interplanetary adventure with Galaxium Travels. 
          Experience the future of space tourism today.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Link to="/flights">
            <Button size="lg" className="gap-2">
              <Star className="h-5 w-5" />
              Browse Flights
            </Button>
          </Link>
          {!user && <RegistrationModal />}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-6">
        <Card className="glass-effect border-cosmic-indigo/20 hover:border-cosmic-indigo/40 transition-all">
          <CardHeader>
            <Zap className="h-10 w-10 text-cosmic-indigo mb-2" />
            <CardTitle>Fast Travel</CardTitle>
            <CardDescription>
              State-of-the-art propulsion systems get you to your destination in record time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Our advanced spacecraft utilize quantum drives for unprecedented speed and efficiency.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-cosmic-purple/20 hover:border-cosmic-purple/40 transition-all">
          <CardHeader>
            <Star className="h-10 w-10 text-cosmic-purple mb-2" />
            <CardTitle>Premium Service</CardTitle>
            <CardDescription>
              Luxury accommodations and world-class amenities throughout your journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Experience zero-gravity lounges, gourmet dining, and panoramic viewing decks.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-cosmic-cyan/20 hover:border-cosmic-cyan/40 transition-all">
          <CardHeader>
            <Globe className="h-10 w-10 text-cosmic-cyan mb-2" />
            <CardTitle>Multiple Destinations</CardTitle>
            <CardDescription>
              Choose from a variety of planets and space stations across the solar system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              From Mars colonies to Jupiter's moons, explore the wonders of our solar system.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-12">
        <Card className="glass-effect border-cosmic-indigo/30 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl">Ready for Your Adventure?</CardTitle>
            <CardDescription className="text-base">
              Join thousands of space travelers who have already experienced the journey of a lifetime
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Browse our available flights and book your seat today. 
              New destinations are added regularly!
            </p>
            <Link to="/flights">
              <Button size="lg" className="w-full md:w-auto">
                View All Flights
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

// Made with Bob
