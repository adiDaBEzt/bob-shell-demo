import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface UserState {
  user: User | null;
  isAgent: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  toggleMode: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAgent: false,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      toggleMode: () => set((state) => ({ isAgent: !state.isAgent })),
    }),
    {
      name: 'galaxium-user-storage',
    }
  )
);

// Made with Bob
