import { Link } from 'react-router-dom';
import { Rocket, User, Users } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { Button } from '@/components/ui/button';
import RegistrationModal from '@/components/customer/RegistrationModal';

export default function Header() {
  const { user, isAgent, toggleMode } = useUserStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-space-surface/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Rocket className="h-6 w-6 text-cosmic-indigo" />
          <span className="text-xl font-bold bg-cosmic-gradient bg-clip-text text-transparent">
            Galaxium Travels
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {isAgent ? (
            <>
              <Link
                to="/agent"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                to="/agent/bookings"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                All Bookings
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/flights"
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
              >
                Flights
              </Link>
              {user && (
                <Link
                  to="/my-bookings"
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  My Bookings
                </Link>
              )}
            </>
          )}

          {/* Registration / User Info */}
          {!user && !isAgent && <RegistrationModal />}
          
          {user && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <User className="h-4 w-4 text-cosmic-cyan" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          )}

          {/* Mode Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleMode}
            className="gap-2"
          >
            {isAgent ? (
              <>
                <Users className="h-4 w-4" />
                Agent Mode
              </>
            ) : (
              <>
                <User className="h-4 w-4" />
                Customer Mode
              </>
            )}
          </Button>
        </nav>
      </div>
    </header>
  );
}

// Made with Bob
