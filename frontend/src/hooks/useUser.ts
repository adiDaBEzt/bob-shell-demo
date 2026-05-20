import { useMutation, useQueryClient } from '@tanstack/react-query';
import { registerUser, getUserByNameAndEmail } from '@/api/endpoints';
import { useUserStore } from '@/store/userStore';
import type { RegisterUserRequest, UserLookupParams } from '@/types';

export function useRegisterUser() {
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: RegisterUserRequest) => registerUser(data),
    onSuccess: (user) => {
      setUser(user);
      queryClient.setQueryData(['user', user.id], user);
    },
  });
}

export function useUserLookup() {
  const setUser = useUserStore((state) => state.setUser);

  return useMutation({
    mutationFn: (params: UserLookupParams) => getUserByNameAndEmail(params),
    onSuccess: (user) => {
      setUser(user);
    },
  });
}

// Made with Bob
