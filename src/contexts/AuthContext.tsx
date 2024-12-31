import React, { createContext, useState, useContext, useEffect } from "react";
import { GoogleAuth, AuthContextType, AuthProviderProps } from "../types/AuthTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<GoogleAuth | null>(null);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedAuth = await AsyncStorage.getItem('auth');
        if (storedAuth) {
          setAuth(JSON.parse(storedAuth));
        }
      } catch (error) {
        console.log('No stored auth found.')
      }
    };
    loadStoredAuth();
  }, []);

  useEffect(() => {
    const storeAuth = async () => {
      try {
        if (auth) {
          await AsyncStorage.setItem('auth',JSON.stringify(auth));
        } else {
          await AsyncStorage.removeItem('auth');
        }
      } catch (error) {
        console.error('Error storing auth.')
      }
    };
    storeAuth();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider.")
  }
  return context;
};
