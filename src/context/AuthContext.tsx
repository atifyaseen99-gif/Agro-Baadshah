import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminSession } from '../types';
import { authService } from '../services';

interface AuthContextType {
  isAuthenticated: boolean;
  session: AdminSession | null;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AdminSession | null>(() => authService.getSession());

  useEffect(() => {
    setSession(authService.getSession());
  }, []);

  const login = (username: string, pass: string): boolean => {
    const success = authService.login(username, pass);
    if (success) {
      setSession(authService.getSession());
    }
    return success;
  };

  const logout = () => {
    authService.logout();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(session?.isAuthenticated),
        session,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
