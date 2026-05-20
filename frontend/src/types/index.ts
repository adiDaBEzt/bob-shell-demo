// User types
export interface User {
  id: number;
  name: string;
  email: string;
}

// Flight types
export interface Flight {
  id: number;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
}

// Booking types
export type BookingStatus = 'booked' | 'cancelled' | 'completed';

export interface Booking {
  id: number;
  user_id: number;
  flight_id: number;
  status: BookingStatus;
  booking_time: string;
  flight?: Flight;
  user?: User;
}

// API Request/Response types
export interface RegisterUserRequest {
  name: string;
  email: string;
}

export interface CreateBookingRequest {
  user_id: number;
  name: string;
  flight_id: number;
}

export interface UserLookupParams {
  name: string;
  email: string;
}

// API Error types
export interface ApiError {
  success: false;
  error: string;
  error_code: string;
  details?: string;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// Error codes
export type ErrorCode =
  | 'EMAIL_EXISTS'
  | 'USER_NOT_FOUND'
  | 'FLIGHT_NOT_FOUND'
  | 'NO_SEATS_AVAILABLE'
  | 'NAME_MISMATCH'
  | 'BOOKING_NOT_FOUND'
  | 'ALREADY_CANCELLED';

// Made with Bob
