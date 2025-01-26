import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Auth, User, Service } from "@/web-sdk";

interface UserInformation {
  first_name: string;
  last_name: string;
  email: string;
}

interface AuthStateType {
  user: User | null;
  userInformation: UserInformation | null;
  loading: boolean;
}

const AuthContext = createContext<AuthStateType>({
  user: null,
  userInformation: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthStateType>({
    user: null,
    userInformation: null,
    loading: true,
  });
  const router = useRouter();

  const fetchUserInformation = async (user: User) => {
    setAuthState((prev) => ({ ...prev, user, loading: true }));
    try {
      const response = await Service.makeAuthenticatedRequest("user");
      if (!response.error) {
        setAuthState((prev) => ({
          ...prev,
          userInformation: response,
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
      if (user && user.emailVerified) {
        await fetchUserInformation(user);
      } else {
        setAuthState({ user: null, userInformation: null, loading: false });
        router.push("/login");
      }
    };

    const listen = Auth.onAuthStateChange(handleAuthStateChange);

    return () => listen();
  }, []);

  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
