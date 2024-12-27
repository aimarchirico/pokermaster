import { GoogleSignin, } from '@react-native-google-signin/google-signin';
import { useAuth } from '../contexts/AuthContext';

export const useGoogleSignin = () => {
  const {setAuth} = useAuth()

  const signIn = async (): Promise<void> => {
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

  const signOut = async (): Promise<void> => {
    try {
      await GoogleSignin.signOut();
      setAuth(null);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    signIn, 
    signOut
  }
}