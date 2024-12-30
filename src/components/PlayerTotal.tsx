import React, { View, Text, StyleSheet } from "react-native";
import { PlayerTotalProps } from "../types/PlayerTypes";
import { useStyles } from "../styles/StylesContext";

const PlayerTotal = ({ player }: PlayerTotalProps) => {
  const { globalStyles } = useStyles();

  const styles = StyleSheet.create({
    balance: {
      textAlign: 'right'
    }
  });

  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.text}>{player.name}</Text>
      <Text style={StyleSheet.compose(globalStyles.text, styles.balance)}>{player.balance}</Text>
    </View>
  );
};

export default PlayerTotal;

