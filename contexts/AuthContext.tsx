import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, AuthState, LoginCredentials } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });
  const [isLoading] = useState(false); // 常にfalse

  const login = async (credentials: LoginCredentials) => {
    try {
      //!モックログイン（ストレージなし）
      const mockUser: User = {
        id: '1',
        username: credentials.username,
        mode: credentials.mode,
      };

      setAuthState({
        isAuthenticated: true,
        user: mockUser,
        token: 'mock_token',
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
      });
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
