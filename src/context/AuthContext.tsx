import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '@/lib/firebase';

interface AuthContextType {
  user: any | null;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
  login: () => Promise<void>;
  loginAnonymously: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  login: async () => {},
  loginAnonymously: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const login = async () => {
    // Local session logic
    const mockUser = { uid: 'local-admin', email: 'admin@jkcabs.com', displayName: 'Admin' };
    setUser(mockUser);
    setProfile({ role: 'admin', name: 'Admin User' });
    sessionStorage.setItem('admin_session', 'true');
    sessionStorage.setItem('admin_unlocked', 'true');
    setIsAdmin(true);
  };

  const loginAnonymously = async () => {
    setUser({ uid: 'guest-' + Math.random().toString(36).substr(2, 9), isAnonymous: true });
  };

  const logout = async () => {
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    sessionStorage.removeItem('admin_session');
    sessionStorage.removeItem('admin_unlocked');
  };

  useEffect(() => {
    const sessionActive = sessionStorage.getItem('admin_session');
    const unlocked = sessionStorage.getItem('admin_unlocked') === 'true';
    if (sessionActive === 'true' || unlocked) {
      setUser({ uid: 'local-admin', email: 'admin@jkcabs.com' });
      setProfile({ role: 'admin', name: 'Admin User' });
      setIsAdmin(true);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, login, loginAnonymously, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
