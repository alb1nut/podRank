// context/AppUtils.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface AppUtilsType {
  isLoggedIn: boolean;
  setIsLoggedIn: (state: boolean) => void;
  setAuthToken: (token: string | null) => void;
  authToken?: string | null;
}

const AppUtilsContext = createContext<AppUtilsType | undefined>(undefined);

export const AppUtilsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authToken,setAuthToken] = useState<null|string>(null)

  // Check for auth state on initial load
  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(loggedIn);
    setAuthToken(token);
  }, []);

  // Persist auth state
  const setAuthState = (value: boolean) => {
    localStorage.setItem('isLoggedIn', String(value));
    setIsLoggedIn(value);
    if (!value) {
      setAuthToken(null);
      localStorage.removeItem('access_token');
    }
  };

  return (
    <AppUtilsContext.Provider value={{ isLoggedIn, setIsLoggedIn: setAuthState,setAuthToken,authToken  }}>
      {children}
    </AppUtilsContext.Provider>
  );
};

export const useAppUtils = () => {
  const context = useContext(AppUtilsContext);
  if (!context) {
    throw new Error("useAppUtils must be used within an AppUtilsProvider");
  }
  return context;
};