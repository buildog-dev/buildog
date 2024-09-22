import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Auth, User } from "@/web-sdk";

const AuthContext = createContext<{ user: User | null }>({
  user: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<{ user: User | null }>({
    user: null,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleAuthStateChange = (user: User | null) => {
      if (user) {
        if (!user.emailVerified && (pathname === "/login/" || pathname === "/signup/")) {
          setLoading(false);
          return;
        }

        setAuthState({ user });

        // Redirect based on sign-in state and current pathname
        if (pathname === "/login/" || pathname === "/signup/") {
          router.push("/organizations/");
        }
        setLoading(false);
        return;
      }

      if (!(pathname === "/login/" || pathname === "/signup/")) {
        setLoading(false);
        router.push("/login");
      }
    };

    // Listen for auth state changes
    const listen = Auth.onAuthStateChange(handleAuthStateChange);

    // Clean up the auth state listener on unmount
    return () => listen();
  }, [router, pathname]);

  return (
    <AuthContext.Provider value={authState}>
      {loading ? "Loading.." : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
