import { useTheme } from '@react-navigation/native';
import { createContext, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { StylesContextType, StylesProviderProps } from '../types/StylesTypes';

const StylesContext = createContext<StylesContextType | undefined>(undefined);

export const StylesProvider = ({ children }: StylesProviderProps) => {
  const { colors } = useTheme();

  const globalStyles = StyleSheet.create({
    container: {
      marginVertical: 10,
      alignItems: 'center',
      backgroundColor: colors.background,
      flexDirection: 'column'
    },
    card: {
      backgroundColor: colors.card,
      padding: 30,
      flexDirection: 'row',
      marginVertical: 6,
      borderRadius: 5
    },
    text: {
      fontFamily: 'GoogleSans-Regular',
      color: colors.text,
      fontSize: 10,
      flex: 1,
    },
    header: {
      fontFamily: 'GoogleSans-Bold',
      color: colors.text,
      fontSize: 20
    },
    input: {
      width: 100,
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 5,
      borderRadius: 5,
      color: colors.text,
    },
  });

  return (
    <StylesContext.Provider value={{globalStyles}}>
      {children}
    </StylesContext.Provider>
  );
};


export const useStyles = () => {
  const context = useContext(StylesContext)
  if (context === undefined) {
    throw new Error("useStyles must be used within a StylesProvider.")
  }
  return context;
};