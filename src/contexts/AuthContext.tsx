import React, { createContext, useContext, useState, ReactNode, FC } from 'react';

/**
 * Types
 */
export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextProps {
  /** Currently authenticated user or null if not logged in */
  user: User | null;
  /** Attempts to log in a user using the backend API */
  login: (username: string, password: string) => Promise<void>;
  /** Logs out the current user */
  logout: () => void;
}

/**
 * Create a React context with a default value that will be overridden by the provider.
 * The default throws an error if used outside of a provider – this helps catch
 * misuse during development.
 */
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

/**
 * AuthProvider component – wraps part of the app that needs authentication state.
 * It keeps the authenticated user in component state (memory only). No data is stored
 * in localStorage or any other persistent client‑side storage, which avoids the
 * security issues present in the previous implementation.
 */
export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  /**
   * Login implementation.
   * Calls a backend endpoint (e.g., /api/login) that validates credentials and
   * returns the user payload. The backend should set an HttpOnly, Secure cookie
   * containing the session token, keeping the token out of JavaScript scope.
   */
  const login = async (username: string, password: string): Promise<void> => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include', // ensures cookies are sent/received
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }

    const data: User = await response.json();
    setUser(data);
  };

  /**
   * Logout implementation.
   * Calls a backend endpoint to clear the session cookie and then clears the
   * client‑side user state.
   */
  const logout = async (): Promise<void> => {
    await fetch('/api/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for consuming the AuthContext.
 * Throws an error if used outside of an AuthProvider.
 */
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
