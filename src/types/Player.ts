export class Player {
  name: string;
  balance: number;

  constructor(name: string, balance: number) {
    this.name = name;
    this.balance = 0;
  }

  updateBalance(amount: number): void {
    this.balance += amount;
  }
}



