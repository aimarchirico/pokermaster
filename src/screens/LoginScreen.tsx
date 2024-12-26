import React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { useGoogleSignin } from '../hooks/GoogleSignin';
import { useAuth } from '../contexts/AuthContext';
import { SpreadsheetPicker } from '../components/SpreadsheetPicker';

export const LoginScreen = () => {

  const { signIn, signOut } = useGoogleSignin();
  const { auth } = useAuth();

  return (
    <View style={styles.container}>
      {
        auth === null ? (
          <Button title="Sign in with Google" onPress={signIn} />
        ) : (
          <Button title="Sign out with Google" onPress={signOut} />
        )  
      }  
      <SpreadsheetPicker/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  }
});
