import React, { View, Text, StyleSheet } from "react-native";
import { PlayerTotalProps } from "../types/PlayerTypes";
import { useStyles } from "../styles/StylesContext";

export const PlayerTotal = ({ player }: PlayerTotalProps) => {
  const { globalStyles } = useStyles();

  return (
    <View style={globalStyles.card}>
      <Text style={StyleSheet.compose(globalStyles.text, styles.name)}>{player.name}</Text>
      <Text style={StyleSheet.compose(globalStyles.text, styles.balance)}>{player.balance}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  name: {
    fontSize: 20
  },
  balance: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'right'
  },
});
