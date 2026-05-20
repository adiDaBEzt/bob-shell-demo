import apiClient from './client';
import type {
  User,
  Flight,
  Booking,
  RegisterUserRequest,
  CreateBookingRequest,
  UserLookupParams,
} from '@/types';

// Health check
export const checkHealth = async (): Promise<{ status: string }> => {
  const response = await apiClient.get('/health');
  return response.data;
};

// User endpoints
export const registerUser = async (data: RegisterUserRequest): Promise<User> => {
  const response = await apiClient.post('/register', data);
  return response.data;
};

export const getUserByNameAndEmail = async (params: UserLookupParams): Promise<User> => {
  const response = await apiClient.get('/user_id', { params });
  // Backend returns {success: true, data: {...}}
  return response.data.data || response.data;
};

// Flight endpoints
export const getFlights = async (): Promise<Flight[]> => {
  const response = await apiClient.get('/flights');
  return response.data;
};

export const getFlightById = async (id: number): Promise<Flight> => {
  const flights = await getFlights();
  const flight = flights.find((f) => f.id === id);
  if (!flight) {
    throw new Error('Flight not found');
  }
  return flight;
};

// Booking endpoints
export const createBooking = async (data: CreateBookingRequest): Promise<Booking> => {
  const response = await apiClient.post('/book', data);
  // Backend returns {success: true, data: {...}}
  return response.data.data || response.data;
};

export const getUserBookings = async (userId: number): Promise<Booking[]> => {
  const response = await apiClient.get(`/bookings/${userId}`);
  // Backend returns {success: true, data: [...]}
  return response.data.data || response.data;
};

export const cancelBooking = async (bookingId: number): Promise<Booking> => {
  const response = await apiClient.post(`/cancel/${bookingId}`);
  // Backend returns {success: true, data: {...}}
  return response.data.data || response.data;
};

// Get all bookings (for agent view)
export const getAllBookings = async (): Promise<Booking[]> => {
  // This would need to be implemented in the backend
  // For now, we'll return an empty array or throw an error
  throw new Error('Not implemented - backend needs to add this endpoint');
};

// Made with Bob
