import React from 'react';
import { Text, View, Button, StyleSheet } from 'react-native';
import { useSignin, useSignout } from '../api/ManageAccount';
import { useAuth } from '../api/AuthContext';

export const LoginScreen = () => {

  const { signIn } = useSignin();
  const { signOut } = useSignout();
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
