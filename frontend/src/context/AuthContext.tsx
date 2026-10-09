import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import type { User } from '../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: 'STUDENT' | 'ORGANIZER') => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    const token = localStorage.getItem('campus-token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get<{ id: string; name: string; email: string; role: User['role']; profileImage?: string; organizerProfile?: any }>('/auth/me');
      setUser({ ...response, profileImage: response.profileImage || undefined });
    } catch {
      localStorage.removeItem('campus-token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post<{ token: string; user: User }>('/auth/login', { email, password });
    localStorage.setItem('campus-token', response.token);
    setUser(response.user);
  };

  const register = async (name: string, email: string, password: string, role: 'STUDENT' | 'ORGANIZER' = 'STUDENT') => {
    const response = await api.post<{ token: string; user: User }>('/auth/register', { name, email, password, role });
    localStorage.setItem('campus-token', response.token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('campus-token');
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, register, logout, refreshUser }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
