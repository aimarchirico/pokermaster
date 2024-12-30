import { Player } from "./PlayerTypes";

type RootTabParamList = {    
  Add: {
    players: Player[];
  };
  Total: {
    players: Player[];
  };
  Account: {
  };
};

export default RootTabParamList;