import React, { createContext, useState, useContext, useEffect } from "react";
import {
  BuyinContextType,
  BuyinProviderProps,
} from "../types/BuyinTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BuyinContext = createContext<BuyinContextType | undefined>(undefined);

export const BuyinProvider = ({ children }: BuyinProviderProps) => {
  const [buyin, setBuyin] = useState("");

    useEffect(() => {
      const loadBuyin = async () => {
        try {
          const storedBuyin = await AsyncStorage.getItem('buyin')
          if (storedBuyin) {
            setBuyin(storedBuyin);
          }
        } catch (error) {
          console.error('Error loading buyin:', error);
        }
      };
      loadBuyin();
    }, []);
  
    useEffect(()=> {
      const saveBuyin = async () => {
        try {
          await AsyncStorage.setItem('buyin', buyin);
        } catch (error) {
          console.error('Error laoding buyin:', error);
        }
      };
      if (buyin) {
        saveBuyin();
      }
    }, [buyin]);

  return (
    <BuyinContext.Provider value={{ buyin, setBuyin }}>
      {children}
    </BuyinContext.Provider>
  );
};

export const useBuyin = () => {
  const context = useContext(BuyinContext);
  if (context === undefined) {
    throw new Error("useBuyin must be used within a BuyinProvider.");
  }
  return context;
};
