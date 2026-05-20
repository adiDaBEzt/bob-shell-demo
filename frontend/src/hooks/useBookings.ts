import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getUserBookings, createBooking, cancelBooking } from '@/api/endpoints';
import type { CreateBookingRequest } from '@/types';

export function useUserBookings(userId: number | undefined) {
  return useQuery({
    queryKey: ['bookings', userId],
    queryFn: () => getUserBookings(userId!),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBookingRequest) => createBooking(data),
    onSuccess: (_, variables) => {
      // Invalidate bookings for this user
      queryClient.invalidateQueries({ queryKey: ['bookings', variables.user_id] });
      // Invalidate flights to update available seats
      queryClient.invalidateQueries({ queryKey: ['flights'] });
    },
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingId: number) => cancelBooking(bookingId),
    onSuccess: (data) => {
      // Invalidate bookings for this user
      queryClient.invalidateQueries({ queryKey: ['bookings', data.user_id] });
      // Invalidate flights to update available seats
      queryClient.invalidateQueries({ queryKey: ['flights'] });
    },
  });
}

// Made with Bob
