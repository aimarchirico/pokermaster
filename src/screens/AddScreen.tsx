import React, { useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import { PlayerAdd } from "../components/PlayerAdd";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "../types/RootTabParamList";

type AddScreenProps = BottomTabScreenProps<RootTabParamList, "Add">;

export const AddScreen = ({ route }: AddScreenProps) => {

  const { players } = route.params;

  const [inputAmounts, setInputAmounts] = useState<{ [key: string]: number }>({});
  const [resetTrigger, setResetTrigger] = useState(0);

  const handleAmountChange = (name: string, amount: number) => {
    setInputAmounts(prev => ({
      ...prev,
      [name]: amount
    }));
  };

  const handleConfirm = () => {
    players.forEach(player => {
      const amount = inputAmounts[player.name] || 0;
      player.updateBalance(amount);
    });
    setInputAmounts({})
    setResetTrigger(prev => prev + 1)
  };

  return (
    <View style={styles.container}>
      {players.map(player => (
        <PlayerAdd
          key={player.name}
          player={player}
          onAmountChange={(amount) => handleAmountChange(player.name, amount)}
          resetTrigger={resetTrigger}
        />
      ))}
      <Button title="Confirm Changes" onPress={handleConfirm}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
