import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Starfield from '@/components/shared/Starfield';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Starfield />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

// Made with Bob
