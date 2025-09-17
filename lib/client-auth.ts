import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Custom hook to check if user is authenticated and verified
export function useAuth() {
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (status === "loading") {
      setLoading(true);
      return;
    }
    
    if (session?.user) {
      setIsAuthenticated(true);
      // Check if user is verified
      setIsVerified(!!session.user.emailVerified);
    } else {
      setIsAuthenticated(false);
      setIsVerified(false);
    }
    
    setLoading(false);
  }, [session, status]);
  
  return { isAuthenticated, isVerified, loading, session };
}

// Custom hook to protect routes on the client side
export function useProtectedRoute(shouldVerify = true) {
  const router = useRouter();
  const { isAuthenticated, isVerified, loading } = useAuth();
  
  useEffect(() => {
    if (loading) return;
    
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }
    
    if (shouldVerify && !isVerified) {
      router.push("/auth/verify-request");
    }
  }, [isAuthenticated, isVerified, loading, router, shouldVerify]);
  
  return { isAuthenticated, isVerified, loading };
}