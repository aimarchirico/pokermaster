export interface GoogleAuth {
  account: string;
  accessToken: string;
}

export interface AuthContextType {
  auth: GoogleAuth | null;
  setAuth: (auth: GoogleAuth | null) => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
