import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Player } from "../types/Player";

interface PlayerTotalProps {
  player: Player;
}

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
