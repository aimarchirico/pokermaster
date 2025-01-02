import { useTheme } from "@react-navigation/native";
import React, { createContext, useContext } from "react";
import { StyleSheet } from "react-native";
import { StylesContextType, StylesProviderProps } from "../types/StylesTypes";

const StylesContext = createContext<StylesContextType | undefined>(undefined);

export const StylesProvider = ({ children }: StylesProviderProps) => {
  const { colors } = useTheme();

  const globalStyles = StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: colors.background,
      flexDirection: "column",
      width: "100%",
    },
    flexContainer: {
      padding: 16,
      flex: 1,
    },
    card: {
      backgroundColor: colors.card,
      flexDirection: "row",
      marginVertical: 6,
      borderRadius: 5,
      height: 65,
      padding: 16,
      alignItems: "center",
    },
    text: {
      fontFamily: "GoogleSans-Regular",
      color: colors.text,
      fontSize: 16,
      flex: 1,
      width: "100%",
    },
    smallText: {
      fontSize: 10,
    },
    header: {
      fontFamily: "GoogleSans-Bold",
      padding: 16,
      fontSize: 25,
      width: "200%",
    },
    buttonText: {
      textAlign: "center",
    },
    input: {
      borderColor: colors.border,
      flex: 0.5,
      borderWidth: 2,
      borderRadius: 5,
      padding: 10,
      height: 40,
      textAlign: "right",
      margin: 10,
    },
    subheader: {
      fontSize: 14,
    },
    rightSubheader: {
      fontSize: 14,
      textAlign: "right",
    },
  });

  return (
    <StylesContext.Provider value={{ globalStyles }}>
      {children}
    </StylesContext.Provider>
  );
};

export const useStyles = () => {
  const context = useContext(StylesContext);
  if (context === undefined) {
    throw new Error("useStyles must be used within a StylesProvider.");
  }
  return context;
};
