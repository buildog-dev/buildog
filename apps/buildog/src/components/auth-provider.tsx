import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Auth, User, Service } from "@/web-sdk";

interface UserCredentials {
  first_name: string;
  last_name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  userCredentials: UserCredentials | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userCredentials: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthContextType>({
    user: null,
    userCredentials: null,
    loading: true,
  });
  const router = useRouter();
  const pathname = usePathname();

  const fetchUserCredentials = async (user: User) => {
    try {
      const response = await Service.makeAuthenticatedRequest("user");
      if (!response.error) {
        setAuthState((prev) => ({
          ...prev,
          userCredentials: response,
          loading: false,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch user credentials:", error);
      setAuthState((prev) => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    const handleAuthStateChange = async (user: User | null) => {
      if (user) {
        if (!user.emailVerified && (pathname === "/login/" || pathname === "/signup/")) {
          return;
        }

        setAuthState((prev) => ({ ...prev, user, loading: true }));
        await fetchUserCredentials(user);

        // Redirect based on sign-in state and current pathname
        if (pathname === "/login" || pathname === "/signup") {
          router.push("/organizations/");
        }
        return;
      }

      setAuthState({ user: null, userCredentials: null, loading: false });
      if (!(pathname === "/login" || pathname === "/signup")) {
        router.push("/login");
      }
    };

    // Listen for auth state changes
    const listen = Auth.onAuthStateChange(handleAuthStateChange);

    // Clean up the auth state listener on unmount
    return () => listen();
  }, [router, pathname]);

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
