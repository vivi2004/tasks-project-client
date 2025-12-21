import { create } from "zustand";
import type { User } from "../types/auth.types";
import { getMeApi } from "../api/auth.api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasAttemptedLoad: boolean;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useUserStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  hasAttemptedLoad: false,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
      hasAttemptedLoad: true,
    });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      hasAttemptedLoad: false,
    });
  },

  loadUser: async () => {
    const state = get();
    
    // Prevent multiple simultaneous calls
    if (state.isLoading && state.hasAttemptedLoad) {
      return;
    }

    set({ isLoading: true, hasAttemptedLoad: true });

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        set({ isLoading: false, isAuthenticated: false, user: null });
        return;
      }

      const userData = await getMeApi();
      if (userData) {
        set({
          user: {
            ...userData,
            name: userData.name || userData.email?.split('@')[0] || 'User'
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        // If no user data but we have a token, clear the invalid token
        localStorage.removeItem("accessToken");
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      localStorage.removeItem("accessToken");
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));