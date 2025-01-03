import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { PlayerUpdateProps } from "../types/PlayerTypes";
import { useStyles } from "../styles/StylesContext";

const PlayerUpdate = ({
  player,
  defaultValue,
  onAmountChange,
}: PlayerUpdateProps) => {
  const [profitValue, setProfitValue] = useState("");

  useEffect(() => {
    setProfitValue(defaultValue.toString())
  }, [defaultValue])

  const handleProfitChange = (text: string) => {
    setProfitValue(text);
    const amount = Number(text) || 0;
    onAmountChange(amount);
  };

  const { globalStyles } = useStyles();

  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.text}>{player.name}</Text>
      <TextInput
        style={StyleSheet.compose(globalStyles.text, globalStyles.input)}
        value={profitValue}
        onChangeText={handleProfitChange}
        keyboardType="numeric"
      />
    </View>
  );
};

export default PlayerUpdate;
