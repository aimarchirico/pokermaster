import { GoogleSignin, } from '@react-native-google-signin/google-signin';
import { useAuth } from './AuthContext';

export const useSignin = () => {
  const {setAuth} = useAuth()

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
  }

  return { signIn }
};

export const useSignout = () => {
  const {setAuth} = useAuth()

  const signOut = async () => {
  
    try {
      await GoogleSignin.signOut();
      setAuth(null);
    } catch (error) {
      console.error(error);
    }
  };

  return { signOut }
};