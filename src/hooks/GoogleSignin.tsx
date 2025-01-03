import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useAuth } from "../contexts/AuthContext";

const useGoogleSignin = () => {
  const { auth, setAuth } = useAuth();

  const signIn = async (): Promise<void> => {
    try {
      GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();

      setAuth({
        account: userInfo.data.user.email,
        accessToken: tokens.accessToken,
        expirationTime: new Date().getTime() + 3600 * 1000,
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

  const isTokenExpired = () => {
    if (!auth?.expirationTime) return true;
    return new Date().getTime() > auth.expirationTime;
  };

  const refreshToken = async () => {
    try {
      const { accessToken } = await GoogleSignin.getTokens();
      setAuth({
        ...auth,
        accessToken,
        expirationTime: new Date().getTime() + 3600 * 1000,
      });
      console.log("refreshing token now");
    } catch (error) {
      console.error(error);
      await signIn();
    }
  };

  return {
    signIn,
    signOut,
    isTokenExpired,
    refreshToken,
  };
};

export default useGoogleSignin;
