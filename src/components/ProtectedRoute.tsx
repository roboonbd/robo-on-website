"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Loader2 } from "lucide-react";
import { ADMIN_EMAILS } from "@/lib/firebase";

export default function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading) {
      console.log("--- ProtectedRoute Debug ---");
      console.log("Path:", window.location.pathname);
      console.log("User:", user?.email);
      console.log("Role:", role);
      console.log("RequireAdmin:", requireAdmin);
      console.log("Email Verified:", user?.emailVerified);
      const isEmailAdmin = ADMIN_EMAILS.includes(user?.email || "");
      console.log("Is Email in ADMIN_EMAILS:", isEmailAdmin);

      if (!user) {
        console.log("Redirecting to login: No user");
        const currentPath = window.location.pathname;
        router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
      } else if (!user.emailVerified && !isEmailAdmin) {
        // If the user's email is not verified and they are not an admin, redirect back to login
        console.log("Redirecting to login: Email not verified and not admin");
        router.push("/login?unverified=true");
      } else if (requireAdmin && role !== 'admin' && role !== 'moderator' && !isEmailAdmin) {
        // Only allow admin or moderator to access admin routes
        // We also check isEmailAdmin as a fallback to prevent race conditions with role state
        console.log("Redirecting to home: Role is not admin/moderator and not admin email", role);
        router.push("/");
      } else {
        console.log("Access Granted. Role:", role, "IsEmailAdmin:", isEmailAdmin);
      }
      console.log("----------------------------");
    }
  }, [user, role, loading, router, requireAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  // Final check to prevent content flash before redirect in useEffect
  const isEmailAdmin = ADMIN_EMAILS.includes(user?.email || "");
  if (requireAdmin && role !== 'admin' && role !== 'moderator' && !isEmailAdmin) {
    return null;
  }

  return <>{children}</>;
}
