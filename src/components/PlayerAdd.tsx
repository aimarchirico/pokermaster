import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { PlayerAddProps } from "../types/PlayerTypes";
import { useStyles } from "../styles/StylesContext";

const PlayerAdd = ({
  player,
  onAmountChange,
  resetTrigger,
}: PlayerAddProps) => {
  const [startValue, setStartValue] = useState("0");
  const [endValue, setEndValue] = useState("0");

  useEffect(() => {
    setStartValue("");
    setEndValue("");
  }, [resetTrigger]);

  const handleStartChange = (text: string) => {
    setStartValue(text);
    const amount = Number(text) || 0;
    onAmountChange("start", amount);
  };

  const handleEndChange = (text: string) => {
    setEndValue(text);
    const amount = Number(text) || 0;
    onAmountChange("end", amount);
  };

  const { globalStyles } = useStyles();

  return (
    <View style={globalStyles.card}>
      <Text style={globalStyles.text}>{player.name}</Text>
      <TextInput
        style={StyleSheet.compose(globalStyles.text, globalStyles.input)}
        value={startValue}
        onChangeText={handleStartChange}
        keyboardType="numeric"
      />
      <TextInput
        style={StyleSheet.compose(globalStyles.text, globalStyles.input)}
        value={endValue}
        onChangeText={handleEndChange}
        keyboardType="numeric"
      />
    </View>
  );
};

export default PlayerAdd;
