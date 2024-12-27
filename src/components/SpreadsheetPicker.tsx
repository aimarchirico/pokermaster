import React, { useEffect, useState } from "react";
import { useGoogleSheets } from "../hooks/GoogleSheets";
import { View, Text, FlatList, Button , StyleSheet, TextInput } from "react-native";

export const SpreadsheetPicker = () => {
  const {
    spreadsheets,
    fetchSpreadsheets,
    selectSpreadsheet,
    fetchData
  } = useGoogleSheets();

  const [filter, setFilter] = useState("");
  
  const handleInputChange = (text: string) => {
    setFilter(text);
  }

  useEffect(() => {
    fetchSpreadsheets(filter);
  }, [fetchSpreadsheets, filter]);

  return (
    <View>
      <Text>Spreadsheets:</Text>
      <TextInput
              style={styles.input}
              value={filter}
              onChangeText={handleInputChange}
              keyboardType="ascii-capable"
            />
      <FlatList
        style={styles.list}
        data={spreadsheets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Button
            title={item.name}
            onPress={() => selectSpreadsheet(item.id)}
          />
        )}
      />


    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    height: '30%',
    padding: 16,
  },
  input: {
    width: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    borderRadius: 5,
  }
});