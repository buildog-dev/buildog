import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Auth, User } from "@/web-sdk";

const AuthContext = createContext<{ isSignedIn: boolean; user: User | null }>({
  isSignedIn: false,
  user: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<{ isSignedIn: boolean; user: User | null }>({
    isSignedIn: false,
    user: null,
  });
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleAuthStateChange = (isSignedIn: boolean, user: User | null) => {
      setAuthState({ isSignedIn, user });

      // Redirect based on sign-in state and current pathname
      if (isSignedIn && (pathname === "/login/" || pathname === "/signup/")) {
        router.push("/blog/");
      } else if (!isSignedIn && (pathname === "/login/" || pathname === "/signup/")) {
        // Allow access to login/signup pages if not signed in
        return;
      } else if (!isSignedIn) {
        router.push("/");
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
