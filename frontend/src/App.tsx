import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import Layout from '@/components/layout/Layout';
import HomePage from '@/pages/customer/HomePage';
import FlightsPage from '@/pages/customer/FlightsPage';
import BookingPage from '@/pages/customer/BookingPage';
import MyBookingsPage from '@/pages/customer/MyBookingsPage';
import AgentDashboard from '@/pages/agent/AgentDashboard';
import AgentBookingsPage from '@/pages/agent/AgentBookingsPage';
import { useUserStore } from '@/store/userStore';

function App() {
  const isAgent = useUserStore((state) => state.isAgent);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Customer Routes */}
            <Route index element={<HomePage />} />
            <Route path="flights" element={<FlightsPage />} />
            <Route path="book/:flightId" element={<BookingPage />} />
            <Route path="my-bookings" element={<MyBookingsPage />} />

            {/* Agent Routes */}
            <Route path="agent" element={<AgentDashboard />} />
            <Route path="agent/bookings" element={<AgentBookingsPage />} />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

// Made with Bob
