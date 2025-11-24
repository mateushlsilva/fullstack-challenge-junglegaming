export type AuthState = {
  token: string | null;
  user: {
    userEmail: string,
  } | null;
  isAuthenticated: boolean;

  setAuth: (token: string, user: { userEmail: string }) => void;
  logout: () => void;
};