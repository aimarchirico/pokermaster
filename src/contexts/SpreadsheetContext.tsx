import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Spreadsheet } from "../types/SpreadsheetTypes"; 

// Define the new context type
interface UpdatedSpreadsheetContextType {
  spreadsheet: Spreadsheet;
  setSpreadsheet: (spreadsheet: Partial<Spreadsheet>) => void;
}

const SpreadsheetContext = createContext<UpdatedSpreadsheetContextType | undefined>(undefined);
const SPREADSHEET_DATA_KEY = 'spreadsheetData';

interface SpreadsheetProviderProps {
  children: ReactNode;
}

export const SpreadsheetProvider = ({ children }: SpreadsheetProviderProps) => {
  const [spreadsheetData, setSpreadsheetData] = useState<Spreadsheet>({ id: null, name: null } as Spreadsheet);

  useEffect(() => {
    const loadSpreadsheetData = async () => {
      try {
        const storedData = await AsyncStorage.getItem(SPREADSHEET_DATA_KEY);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setSpreadsheetData({
            id: parsedData.id || null,
            name: parsedData.name || null,
          } as Spreadsheet);
        }
      } catch (error) {
        console.error('Error loading spreadsheet data from AsyncStorage:', error);
      }
    };
    loadSpreadsheetData();
  }, []);

  useEffect(() => {
    const saveSpreadsheetData = async () => {
      try {
        if (spreadsheetData.id !== null || spreadsheetData.name !== null) {
          await AsyncStorage.setItem(SPREADSHEET_DATA_KEY, JSON.stringify(spreadsheetData));
        } else {
          await AsyncStorage.removeItem(SPREADSHEET_DATA_KEY);
        }
      } catch (error) {
        console.error('Error saving spreadsheet data to AsyncStorage:', error);
      }
    };
    
    if (spreadsheetData.id !== null || spreadsheetData.name !== null || AsyncStorage.getItem(SPREADSHEET_DATA_KEY) !== null) {
        saveSpreadsheetData();
    }
  }, [spreadsheetData]);

  const handleSetSpreadsheet = (data: Partial<Spreadsheet>) => {
    setSpreadsheetData(prevData => ({ ...prevData, ...data }));
  };

  return (
    <SpreadsheetContext.Provider value={{ spreadsheet: spreadsheetData, setSpreadsheet: handleSetSpreadsheet }}>
      {children}
    </SpreadsheetContext.Provider>
  );
};

export const useSpreadsheet = () => {
  const context = useContext(SpreadsheetContext);
  if (context === undefined) {
    throw new Error("useSpreadsheet must be used within a SpreadsheetProvider.");
  }
  return context;
};