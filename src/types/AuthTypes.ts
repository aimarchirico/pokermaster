export interface GoogleAuth {
  accessToken: string;
  spreadsheetId?: string;
}

export interface AuthContextType {
  auth: GoogleAuth | null;
  setAuth: (auth: GoogleAuth | null) => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}
