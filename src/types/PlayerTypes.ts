export class Player {
  name: string;
  balance: number;

  constructor(name: string, balance: number) {
    this.name = name;
    this.balance = balance;
  }

  updateBalance(amount: number): void {
    this.balance += amount;
  }
}

export interface PlayerTotalProps {
  player: Player;
}

export interface PlayerAddProps {
  player: Player;
  onAmountChange: (type: string, amount: number) => void;
  resetTrigger: number;
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