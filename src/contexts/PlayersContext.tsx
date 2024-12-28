import React, { createContext, useState, useContext } from "react";
import { Player, PlayersContextType, PlayersProviderProps } from "../types/PlayerTypes";

const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

export const PlayersProvider = ({ children }: PlayersProviderProps) => {
  const [players, setPlayers] = useState<Player[] | []>([]);

  return (
    <PlayersContext.Provider value={{ players, setPlayers }}>
      {children}
    </PlayersContext.Provider>
  );
};

export const usePlayers = () => {
  const context = useContext(PlayersContext)
  if (context === undefined) {
    throw new Error("usePlayers must be used within a PlayersProvider.")
  }
  return context;
};
