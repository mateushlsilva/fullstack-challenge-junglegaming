import { create } from "zustand";
import type { AuthState } from "../../types";
import { persist } from 'zustand/middleware';

export const useAuthStore = create<AuthState>()(

persist( (set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  setAuth: (token, user) =>
    set(() => ({
      token,
      user,
      isAuthenticated: true,
    })),

  logout: () =>
    set(() => ({
      token: null,
      user: null,
      isAuthenticated: false,
    })),
  }),
  {
    name: "auth-storage",
  }
));
