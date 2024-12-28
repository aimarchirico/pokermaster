import { Player } from "./PlayerTypes";

export type RootTabParamList = {    
  Add: {
    players: Player[];
  };
  Total: {
    players: Player[];
  };
  Account: {
  };
};