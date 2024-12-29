import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { PlayerAddProps } from "../types/PlayerTypes";
import { useStyles } from "../styles/StylesContext";
import { useTheme } from "@react-navigation/native";

export const PlayerAdd = ({
  player,
  onAmountChange,
  resetTrigger
}: PlayerAddProps) => {
  const [inputValue, setInputValue] = useState("0");

  useEffect(() => {
    setInputValue("");
  }, [resetTrigger]);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    const amount = text || "0";
    onAmountChange(amount);
  };

  const { globalStyles } = useStyles();
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    name: {
      fontSize: 20
    },
    input: {
      fontSize: 20,
      borderColor: colors.border, 
      borderWidth: 2,
      borderRadius: 5,
      padding: 10,
      height: 40,
      textAlign: 'right'
    },
  });
  

  return (
    <ScrollView contentContainerStyle={globalStyles.card}>
      <Text style={StyleSheet.compose(globalStyles.text, styles.name)}>{player.name}</Text>
      <TextInput
        style={StyleSheet.compose(globalStyles.text, styles.input)}
        value={inputValue}
        onChangeText={handleInputChange}
        keyboardType="numeric"
      />
    </ScrollView>
  );
};

