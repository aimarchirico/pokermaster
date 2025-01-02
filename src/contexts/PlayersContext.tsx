import React, { createContext, useState, useContext, useEffect } from "react";
import {
  Player,
  PlayersContextType,
  PlayersProviderProps,
} from "../types/PlayerTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PlayersContext = createContext<PlayersContextType | undefined>(undefined);

export const PlayersProvider = ({ children }: PlayersProviderProps) => {
  const [players, setPlayers] = useState<Player[] | []>([]);

  useEffect(() => {
    const loadStoredPlayers = async () => {
      try {
        const storedPlayers = await AsyncStorage.getItem("players");
        if (storedPlayers) {
          setPlayers(JSON.parse(storedPlayers));
        }
      } catch (error) {
        console.log(`No stored players found: ${error.message}`);
      }
    };
    loadStoredPlayers();
  }, []);

  useEffect(() => {
    const storePlayers = async () => {
      try {
        if (players) {
          await AsyncStorage.setItem("players", JSON.stringify(players));
        } else {
          await AsyncStorage.removeItem("players");
        }
      } catch (error) {
        console.error(`Error storing players: ${error.message}`);
      }
    };
    storePlayers();
  }, [players]);

  return (
    <PlayersContext.Provider value={{ players, setPlayers }}>
      {children}
    </PlayersContext.Provider>
  );
};

export const usePlayers = () => {
  const context = useContext(PlayersContext);
  if (context === undefined) {
    throw new Error("usePlayers must be used within a PlayersProvider.");
  }
  return context;
};
