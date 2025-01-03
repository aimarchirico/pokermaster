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
      paddingHorizontal: 30,
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
      fontFamily: "GoogleSans-Bold",
    },
    header: {
      fontFamily: "GoogleSans-Bold",
      padding: 16,
      fontSize: 25,
      width: "200%",
    },
    buttonText: {
      textAlign: "center",
      fontFamily: "GoogleSans-Bold",
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
    list: {
      width: "100%",
    },
    listItem: {
      height: 65,
      width: "100%",
    },
    listText: {
      fontSize: 16,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
      width: 300,
      padding: 20,
      backgroundColor: colors.card,
      borderRadius: 10,
      alignItems: "center",
    },
    modalButtonText: {
      fontFamily: "GoogleSans-Bold",
      color: colors.text,
      fontSize: 16,
    },
    modalText: {
      fontFamily: "GoogleSans-Regular",
      color: colors.text,
      fontSize: 18,
      marginBottom: 20,
    },
    modalButton: {
      backgroundColor: colors.notification,
      paddingVertical: 10,
      paddingHorizontal: 20,
      marginHorizontal: 10,
      borderRadius: 5,
      alignItems: 'center',
      flexGrow: 1
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
