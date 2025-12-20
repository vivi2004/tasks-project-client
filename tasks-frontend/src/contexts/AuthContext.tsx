import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.ts';
import type { User } from '../types/auth.types';

// Using User type from auth.types.ts

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
  user?: User | null;
};

export const AuthProvider = ({ children, user: initialUser = null }: AuthProviderProps) => {
  const [user, setUser] = useLocalStorage<User | null>('user', initialUser);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    // Clear user from state
    setUser(null);
    // Clear any additional auth-related data from localStorage
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
