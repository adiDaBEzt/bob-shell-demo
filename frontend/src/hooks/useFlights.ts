import { useQuery } from '@tanstack/react-query';
import { getFlights, getFlightById } from '@/api/endpoints';

export function useFlights() {
  return useQuery({
    queryKey: ['flights'],
    queryFn: getFlights,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFlight(id: number) {
  return useQuery({
    queryKey: ['flight', id],
    queryFn: () => getFlightById(id),
    enabled: !!id,
  });
}

// Made with Bob
