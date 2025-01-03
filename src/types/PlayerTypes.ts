export interface Player {
  name: string;
  balance: number;
}

export interface PlayerTotalProps {
  player: Player;
}

export interface PlayerAddProps {
  player: Player;
  onAmountChange: (type: string, amount: number) => void;
  resetTrigger: number;
}

export interface PlayerUpdateProps {
  player: Player;
  defaultValue: number;
  onAmountChange: (amount: number) => void;
}

export interface PlayersContextType {
  players: Player[];
  setPlayers: (players: Player[] | []) => void;
}

export interface PlayersProviderProps {
  children: React.ReactNode;
}

export interface AmountData {
  start: number;
  end: number;
}
