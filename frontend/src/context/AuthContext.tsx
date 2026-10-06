/**
 * @file AuthContext.tsx
 * @description Global Authentication & Tenant State Context for React.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

export type UserRole = 'SUPER_ADMIN' | 'SCHOOL_ADMIN' | 'TEACHER' | 'STUDENT' | 'PARENT';

export interface UserSchool {
  id: string;
  name: string;
  code: string;
  status: string;
  logoUrl?: string | null;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  school?: UserSchool | null;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  registerSchool: (payload: any) => Promise<AuthUser>;
  logout: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('schoolhub_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  // Check current session on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get('/auth/me');
        if (res.data?.data) {
          const profile = res.data.data;
          const authUser: AuthUser = {
            id: profile.id,
            name: profile.name,
            email: profile.email,
            role: profile.role,
            avatarUrl: profile.avatarUrl,
            school: profile.school,
          };
          setUser(authUser);
          localStorage.setItem('schoolhub_user', JSON.stringify(authUser));
        }
      } catch {
        setUser(null);
        localStorage.removeItem('schoolhub_user');
        localStorage.removeItem('schoolhub_token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    const res = await api.post('/auth/login', { email, password });
    const { user: loggedInUser, accessToken } = res.data.data;
    if (accessToken) {
      localStorage.setItem('schoolhub_token', accessToken);
    }
    localStorage.setItem('schoolhub_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  };

  const registerSchool = async (payload: any): Promise<AuthUser> => {
    const res = await api.post('/auth/register-school', payload);
    const { user: registeredUser, accessToken } = res.data.data;
    if (accessToken) {
      localStorage.setItem('schoolhub_token', accessToken);
    }
    localStorage.setItem('schoolhub_user', JSON.stringify(registeredUser));
    setUser(registeredUser);
    return registeredUser;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore logout failure
    } finally {
      setUser(null);
      localStorage.removeItem('schoolhub_user');
      localStorage.removeItem('schoolhub_token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, registerSchool, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
