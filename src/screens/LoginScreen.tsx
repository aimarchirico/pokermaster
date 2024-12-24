import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAuth } from '../api/AuthContext';

export const LoginScreen = () => {
  const { setAuth } = useAuth();

  const signIn = async () => {
    try {
      GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();

      setAuth({
        accessToken: tokens.accessToken
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Sign in with Google" onPress={signIn} />
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
