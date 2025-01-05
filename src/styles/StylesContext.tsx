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
      alignItems: "center",
      width: '100%'
    },
    button: {
      backgroundColor: colors.notification,
      borderRadius: 20,
    },
    text: {
      fontFamily: "GoogleSans-Regular",
      color: colors.text,
      fontSize: 16,
      flex: 1,
      width: "100%",
      height: "100%",
      verticalAlign: "middle",
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
      height: 45,
      textAlign: "right",
      marginLeft: 15,
    },
    subheaderCard: {
      backgroundColor: colors.border,
      height: 50,
    },
    subheader: {
      fontFamily: "GoogleSans-Bold",
    },
    rightSubheader: {
      flexGrow: 0.7,
      textAlign: "center",
      marginLeft: 20,
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
      borderRadius: 20,
      alignItems: "center",
      flexGrow: 1,
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
