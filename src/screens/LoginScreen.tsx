import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useGoogleSignin } from '../hooks/GoogleSignin';
import { useAuth } from '../contexts/AuthContext';
import { SpreadsheetPicker } from '../components/SpreadsheetPicker';
import { useTheme } from '@react-navigation/native';

export const LoginScreen = () => {

  const { signIn, signOut } = useGoogleSignin();
  const { auth } = useAuth();
  const { colors } = useTheme()

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 16,
    },
    button: {
      backgroundColor: colors.card,
      padding: 10,
      marginVertical: 5,
      borderRadius: 5
    },
    buttonText: {
      color: colors.text
    },
  });

  return (
    <View style={styles.container}>
      {
        auth === null ? (
          <TouchableOpacity 
            style={styles.button}
            onPress={signIn}>
            <Text style={styles.buttonText}>Sign in with Google</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.button}
            onPress={signOut}>
            <Text style={styles.buttonText}>Sign out from Google</Text>
          </TouchableOpacity>
        )  
      }  
      <SpreadsheetPicker/>
    </View>
  )
}
