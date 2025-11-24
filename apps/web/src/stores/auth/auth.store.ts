import { create } from "zustand";
import type { AuthState } from "../../types";


export const useAuthStore = create<AuthState>((set) => ({
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
}));
