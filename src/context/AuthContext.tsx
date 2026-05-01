import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
  refreshAdminStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
  refreshAdminStatus: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const resolveAdminStatus = async (uid: string, profileData?: any) => {
    const [adminDoc, userDoc] = await Promise.all([
      getDoc(doc(db, 'admins', uid)),
      profileData ? Promise.resolve({ exists: () => true, data: () => profileData }) : getDoc(doc(db, 'users', uid)),
    ]);

    const role = userDoc.exists() ? userDoc.data()?.role : undefined;
    return adminDoc.exists() || role === 'admin';
  };

  const refreshAdminStatus = async () => {
    if (!auth.currentUser) {
      setIsAdmin(false);
      return;
    }
    try {
      const status = await resolveAdminStatus(auth.currentUser.uid);
      setIsAdmin(status);
    } catch (e) {
      console.error('Failed to refresh admin status:', e);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        let profileData: any;
        if (!userDoc.exists()) {
          profileData = {
            email: currentUser.email,
            name: currentUser.displayName || 'Customer',
            role: 'customer',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(userDocRef, profileData);
        } else {
          profileData = userDoc.data();
        }

        setProfile(profileData);

        const adminStatus = await resolveAdminStatus(currentUser.uid, profileData);
        setIsAdmin(adminStatus);
      } catch (err) {
        console.error('Auth bootstrap failed:', err);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, refreshAdminStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
