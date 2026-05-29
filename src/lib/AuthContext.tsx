"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, ADMIN_EMAILS } from "./firebase";

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
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("Auth State Changed. User:", currentUser?.email);
      
      const userEmail = currentUser?.email?.toLowerCase() || "";
      const isEmailAdmin = ADMIN_EMAILS.some(email => email.toLowerCase() === userEmail);

      if (currentUser && !currentUser.emailVerified && !isEmailAdmin) {
        console.log("User unverified and not in ADMIN_EMAILS. Clearing state.");
        setUser(null);
        setUserData(null);
        setRole(null);
        setLoading(false);
      } else {
        setUser(currentUser);
        if (currentUser) {
          const innerUserEmail = currentUser.email?.toLowerCase() || "";
          const innerIsEmailAdmin = ADMIN_EMAILS.some(email => email.toLowerCase() === innerUserEmail);
          console.log("User is authenticated. Is Admin by email:", innerIsEmailAdmin);

          // Listen for real-time updates to user data
          import("./firebase").then(({ db }) => {
            import("firebase/firestore").then(({ doc, onSnapshot }) => {
              const userDocRef = doc(db, "users", currentUser.uid);
              const unsubDoc = onSnapshot(userDocRef, (docSnap) => {
                const searchEmail = currentUser.email?.toLowerCase() || "";
                const isFoundAdmin = ADMIN_EMAILS.some(email => email.toLowerCase() === searchEmail);

                let finalRole: 'admin' | 'moderator' | 'customer' = isFoundAdmin ? 'admin' : 'customer';

                if (docSnap.exists()) {
                  const data = docSnap.data();
                  setUserData(data);
                  if (data.role) {
                    finalRole = data.role === 'student' || data.role === 'customer' ? 'customer' : data.role;
                  }
                }

                // Final Override: if email is in admin list, they ARE admin no matter what
                if (isFoundAdmin) finalRole = 'admin';

                console.log("Setting Role:", finalRole);
                setRole(finalRole);
                setLoading(false);
              }, (err) => {
                console.error("Error fetching real-time user role:", err);
                const errUserEmail = currentUser.email?.toLowerCase() || "";
                const errIsEmailAdmin = ADMIN_EMAILS.some(email => email.toLowerCase() === errUserEmail);
                setRole(errIsEmailAdmin ? 'admin' : 'customer');
                setLoading(false);
              });
            });
          });
        } else {
          console.log("No user logged in. Clearing state.");
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
