import { create } from "zustand";
import type { User } from "../types/auth.types";
import { getMeApi } from "../api/auth.api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasAttemptedLoad: boolean; // Track if we've attempted to load user at least once
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

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
      isLoading: false,
    }),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  logout: () => {
    localStorage.removeItem("accessToken");
    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      hasAttemptedLoad: false, // Reset so we can load again after logout
    });
  },

  loadUser: async () => {
    const state = get();
    
    // Prevent multiple simultaneous calls
    if (state.hasAttemptedLoad && state.isLoading) {
      return;
    }

    // Check if we have a token before making the API call
    const token = localStorage.getItem("accessToken");
    if (!token) {
      set({
        isLoading: false,
        hasAttemptedLoad: true,
      });
      return;
    }

    // If user already exists and we've attempted load, we're done
    if (state.user && state.hasAttemptedLoad) {
      return;
    }

    // Mark as attempted and set loading
    set({ hasAttemptedLoad: true, isLoading: true });
    
    try {
      const me = await getMeApi();
      set({
        user: me,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      localStorage.removeItem("accessToken");
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));