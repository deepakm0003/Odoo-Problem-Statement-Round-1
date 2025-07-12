import React, { createContext, useContext, useEffect, useState } from 'react';
import { localAuth, LocalUser } from '../lib/localAuth';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  downloadUserData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const currentUser = localAuth.getCurrentUser();
    if (currentUser) {
      setUser(convertLocalUserToUser(currentUser));
    }
    setLoading(false);

    // Create demo user if no users exist
    if (localAuth.getAllUsers().length === 0) {
      localAuth.createDemoUser();
    }
  }, []);

  function convertLocalUserToUser(localUser: LocalUser): User {
    return {
      id: localUser.id,
      email: localUser.email,
      name: localUser.name,
      avatar_url: localUser.avatar_url,
      points: localUser.points,
      created_at: localUser.created_at,
      updated_at: localUser.updated_at
    };
  }

  async function signUp(email: string, password: string, name: string) {
    const { user: newUser, error } = await localAuth.signUp(email, password, name);
    
    if (error) {
      throw new Error(error);
    }

    if (newUser) {
      setUser(convertLocalUserToUser(newUser));
    }
  }

  async function signIn(email: string, password: string) {
    const { user: localUser, error } = await localAuth.signIn(email, password);
    
    if (error) {
      throw new Error(error);
    }

    if (localUser) {
      setUser(convertLocalUserToUser(localUser));
    }
  }

  async function signOut() {
    await localAuth.signOut();
    setUser(null);
  }

  async function updateProfile(data: Partial<User>) {
    if (!user) throw new Error('No user logged in');

    const { user: updatedUser, error } = await localAuth.updateUser(user.id, data);
    
    if (error) {
      throw new Error(error);
    }

    if (updatedUser) {
      setUser(convertLocalUserToUser(updatedUser));
    }
  }

  function downloadUserData() {
    localAuth.downloadUserData();
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    downloadUserData,
  };

  return (
    <AuthContext.Provider value={value}>
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