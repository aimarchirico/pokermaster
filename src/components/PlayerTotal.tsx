import React, { View, Text, StyleSheet } from "react-native";
import { PlayerTotalProps } from "../types/PlayerTypes";

export const PlayerTotal = ({ player }: PlayerTotalProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{player.name}</Text>
      <Text style={styles.balance}>{player.balance}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  name: {
    flex: 1,
    fontSize: 20,
  },
  balance: {
    flex: 1,
    fontSize: 16,
  },
});
