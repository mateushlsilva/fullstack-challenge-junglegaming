import { redirect } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/auth/auth.store";

export function requireAuth() {
  const isAuthenticated = useAuthStore.getState().isAuthenticated;

  if (!isAuthenticated) {
    throw redirect({
      to: "/login",
    });
  }
}
