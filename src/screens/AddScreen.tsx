import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { PlayerAdd } from "../components/PlayerAdd";
import { usePlayers } from "../contexts/PlayersContext";
import { useGoogleSheets } from '../hooks/GoogleSheets'
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "@react-navigation/native";

export const AddScreen = () => {

  const { players, setPlayers } = usePlayers();
  const [inputAmounts, setInputAmounts] = useState<{ [key: string]: string }>({});
  const [resetTrigger, setResetTrigger] = useState(0);
  const { appendData } = useGoogleSheets();
  const { auth } = useAuth();
  const { colors } = useTheme();

  const handleAmountChange = (name: string, amount: string) => {
    setInputAmounts(prev => ({
      ...prev,
      [name]: amount
    }));
  };

  const handleConfirm = () => {
    try {
      const data = players.map(player => inputAmounts[player.name] || "0");
      appendData(data)
      const updatedPlayers = [...players];
      updatedPlayers.forEach(player => {
        player.updateBalance(parseFloat(inputAmounts[player.name]) || 0);
      });
      setPlayers(updatedPlayers);
      setInputAmounts({})
      setResetTrigger(prev => prev + 1)
    }
    catch (error) {
      console.error(error)
    }
    
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
    button: {
      backgroundColor: colors.card,
      padding: 10,
      marginVertical: 5,
      borderRadius: 5
    },
    text: {
      color: colors.text
    },
  });

  return (
    <View style={styles.container}>
      {players?.map(player => (
        <PlayerAdd
          key={player.name}
          player={player}
          onAmountChange={(amount) => handleAmountChange(player.name, amount)}
          resetTrigger={resetTrigger}
        />
      ))}
      <TouchableOpacity 
        style={styles.button}
        onPress={handleConfirm}>
        <Text style={styles.text}>Confirm changes</Text>
      </TouchableOpacity>
    </View>
  );
};


