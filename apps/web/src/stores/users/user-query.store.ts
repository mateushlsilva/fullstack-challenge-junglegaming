import { create } from "zustand";
import type { UserTypeQuery } from "@/types";

type UserStore = {
  users: UserTypeQuery[]
  filtered: UserTypeQuery | null
  addPage: (newTasks: UserTypeQuery[]) => void
  clear: () => void
  update: (id: string, data: Partial<UserTypeQuery>) => void
  remove: (id: string) => void
  find: (id: string | null) => UserTypeQuery | null
}



export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  filtered: null,
  addPage: (newTasks) =>
    set((state) => {
      const existingIds = new Set(state.users.map(t => t.id));

      const filtered = newTasks.filter(user => !existingIds.has(user.id));

      return { users: [...state.users, ...filtered] };
  }),
  clear: () => set({ users: [] }),
  update: (id, data) =>
    set((state) => ({
      users: state.users.map((t) =>
        t.id === Number(id) ? { ...t, ...data } : t
      )
    })),
  remove: (id) =>
    set((state) => ({
      users: state.users.filter((t) => t.id !== Number(id))
    })),
 find: (id) => {
    if (!id) return null;
    return get().users.find((u) => u.id === Number(id)) ?? null;
  },
}))