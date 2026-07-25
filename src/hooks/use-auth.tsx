import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getSession, onAuthStateChange } from "@/lib/api";

interface AuthContextValue {
  isLoggedIn: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ isLoggedIn: false, isLoading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getSession()
      .then((session) => setIsLoggedIn(!!session))
      .catch(() => setIsLoggedIn(false))
      .finally(() => setIsLoading(false));

    const unsubscribe = onAuthStateChange((loggedIn) => setIsLoggedIn(loggedIn));
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}