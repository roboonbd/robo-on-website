"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db, ADMIN_EMAILS } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  userData: any | null;
  role: 'admin' | 'moderator' | 'customer' | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  role: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [role, setRole] = useState<'admin' | 'moderator' | 'customer' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const userEmail = currentUser?.email?.toLowerCase() || "";
      const isEmailAdmin = ADMIN_EMAILS.some(email => email.toLowerCase() === userEmail);

      if (currentUser && !currentUser.emailVerified && !isEmailAdmin) {
        setUser(null);
        setUserData(null);
        setRole(null);
        setLoading(false);
      } else {
        setUser(currentUser);
        if (currentUser) {
          const userDocRef = doc(db, "users", currentUser.uid);
          
          // Use onSnapshot with immediate resolution for loading state
          const unsubDoc = onSnapshot(userDocRef, (docSnap) => {
            const searchEmail = currentUser.email?.toLowerCase() || "";
            const isFoundAdmin = ADMIN_EMAILS.some(email => email.toLowerCase() === searchEmail);

            let finalRole: 'admin' | 'moderator' | 'customer' = isFoundAdmin ? 'admin' : 'customer';

            if (docSnap.exists()) {
              const data = docSnap.data();
              setUserData(data);
              if (data.role) {
                finalRole = (data.role === 'student' || data.role === 'customer') ? 'customer' : data.role;
              }
            }

            if (isFoundAdmin) finalRole = 'admin';
            setRole(finalRole);
            setLoading(false);
          }, (err) => {
            console.error("Error fetching user role:", err);
            setRole(isEmailAdmin ? 'admin' : 'customer');
            setLoading(false);
          });

          return () => unsubDoc();
        } else {
          setUserData(null);
          setRole(null);
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
