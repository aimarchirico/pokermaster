import React, { createContext, useState, useContext } from "react";
import { GoogleAuth } from "../types/GoogleAuth";

interface AuthContextType {
  auth: GoogleAuth | null;
  setAuth: (auth: GoogleAuth | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState<GoogleAuth | null>(null);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context;
};
