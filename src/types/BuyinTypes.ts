export interface BuyinContextType {
  buyin: string;
  setBuyin: (buyin: string) => void;
}

export interface BuyinProviderProps {
  children: React.ReactNode;
}