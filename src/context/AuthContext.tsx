import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (!user) {
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, 'users', user.uid);
        const adminDocRef = doc(db, 'admins', user.uid);

        const [userDoc, adminDoc] = await Promise.all([
          getDoc(userDocRef),
          getDoc(adminDocRef),
        ]);

        let profileData: any = null;

        if (!userDoc.exists()) {
          profileData = {
            email: user.email,
            name: user.displayName || 'Customer',
            role: 'customer',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          await setDoc(userDocRef, profileData);
        } else {
          profileData = userDoc.data();
        }

        setProfile(profileData);

        const adminByRole = profileData?.role === 'admin';
        const adminByCollection = adminDoc.exists();
        const adminByEmail = user.email === 'darajazb@gmail.com';

        setIsAdmin(Boolean(adminByRole || adminByCollection || adminByEmail));
      } catch (err) {
        console.error('AuthContext admin check error:', err);
        setIsAdmin(user.email === 'darajazb@gmail.com');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
