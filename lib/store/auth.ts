import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  id: string;
  email: string;
  nickname: string;
}

export interface AuthPayload {
  user: AuthUser;
}

export interface AuthState {
  isAuthed: boolean;
  user: AuthUser | null;
  setAuth: (payload: AuthPayload) => void;
  clear: () => void;
}

export const userAuthStore = create<AuthState>()(
  persist(
    (set): AuthState => ({
      isAuthed: false,
      user: null,
      setAuth: ({ user }) => set({ isAuthed: true, user }),
      clear: () => set({ isAuthed: false, user: null }),
    }),
    {
      
      name: "auth",
      partialize: (state) => ({
        isAuthed: state.isAuthed,
        user: state.user,
      }),
    },
  ),
);
