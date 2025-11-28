'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, displayName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate checking for a logged-in user in local storage
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      // ignore, serverside
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password_not_used: string) => {
    // This is a mock login. In a real app, you'd call an API.
    setIsLoading(true);
    const mockUser: User = { uid: 'local-user-123', email: email, displayName: email.split('@')[0] };
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
    router.push('/dashboard');
  };

  const signup = async (email: string, password_not_used: string, displayName: string) => {
    // This is a mock signup.
    setIsLoading(true);
    const mockUser: User = { uid: 'local-user-123', email: email, displayName: displayName };
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
    setIsLoading(false);
    router.push('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
