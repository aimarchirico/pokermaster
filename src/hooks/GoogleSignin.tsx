import {
  GoogleOneTapSignIn,
  GoogleSignin,
  OneTapUser,
  User,
} from "@react-native-google-signin/google-signin";
import { useAuth } from "../contexts/AuthContext";
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useState } from 'react';
import { GoogleAuthProvider, getAuth, signInWithCredential } from '@react-native-firebase/auth';

WebBrowser.maybeCompleteAuthSession();

const useGoogleSignin = () => {
  const { auth, setAuth } = useAuth();

const googleAuthConfig = {
      clientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
      androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive',
      ]
    };

  const [sheetsRequest, sheetsResponse, promptSheetsAsync] = Google.useAuthRequest(googleAuthConfig);

  const getUser = async () => {
    try {
      await GoogleSignin.signInSilently();
      let user: OneTapUser | User = GoogleSignin.getCurrentUser();
      if (!user) {
        user = await signIn();
        console.log(user)
      }
      if (!user) {
        throw new Error("User not signed in");
      }
      await GoogleSignin.signInSilently();
      const tokens = await GoogleSignin.getTokens();
      console.log(tokens.accessToken)
        setAuth({
        account: user.user.email,
        accessToken: tokens.accessToken,
        });
    } catch (error) {
      console.error("Error getting user:", error);
    }
  }

  const signIn = async () => {
    try {
      GoogleOneTapSignIn.configure({
        webClientId: 'autoDetect'
      });
      
      await GoogleOneTapSignIn.checkPlayServices();
      const signInResponse = await GoogleOneTapSignIn.signIn();
      if (signInResponse.type === 'success') {
        console.log('Google Sign In successful:', signInResponse);
        return signInResponse.data;
      } else if (signInResponse.type === 'noSavedCredentialFound') {
        const createResponse = await GoogleOneTapSignIn.createAccount();
        if (createResponse.type === 'success') {
          console.log('Account created successfully:', createResponse);
          setTimeout(() => {requestSheetsAndDriveAccess();}, 2000);
          const googleCredential = GoogleAuthProvider.credential(createResponse.data.idToken);
          signInWithCredential(getAuth(), googleCredential);
          return createResponse.data;
        }
      }
    } catch (error) {
      console.error("Google Sign In failed:", error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await GoogleOneTapSignIn.revokeAccess("");
      setAuth(null);
    } catch (error) {
      console.error("Sign out error:", error);
      throw error;
    }
  };

  const refreshToken = async () => {
    try {
      GoogleSignin.clearCachedAccessToken(auth.accessToken);
      const { accessToken } = await GoogleSignin.getTokens();
      const newAuth = {
        ...auth,
        accessToken
      }
      setAuth(newAuth);
      return accessToken;
    } catch (error) {
      console.error(error);
    }
  };

  const requestSheetsAndDriveAccess = async () => {
    try {
      
      if (promptSheetsAsync) {
        const authResponse = await promptSheetsAsync();
        if (authResponse.type === 'success') {
          const { authentication } = authResponse;
          if (authentication?.accessToken) {
            console.log('Access Token for Sheets/Drive:', authentication.accessToken);
            return authentication.accessToken;
          }
        } else {
          console.warn('Sheets/Drive access denied or cancelled:', authResponse);
        }
      }
      getUser();
    } catch (error) {
      console.error('Error requesting Sheets/Drive access:', error);
      throw error;
    }
    return null;
  };

  return {
    signIn,
    signOut,
    getUser,
    refreshToken,
    requestSheetsAndDriveAccess
  };
};

export default useGoogleSignin;
