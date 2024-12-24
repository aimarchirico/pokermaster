import { Player } from "../types/Player";

export type RootTabParamList = {    
  Add: {
    players: Player[];
  };
  Total: {
    players: Player[];
  };
};