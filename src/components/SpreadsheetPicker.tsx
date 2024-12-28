import React, { useEffect, useState } from "react";
import { useGoogleSheets } from "../hooks/GoogleSheets";
import { View, Text, FlatList, Button , StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";

export const SpreadsheetPicker = () => {
  const {
    spreadsheets,
    fetchSpreadsheets,
    selectSpreadsheet
  } = useGoogleSheets();

  const [filter, setFilter] = useState('');

  const { colors } = useTheme();

  useEffect(() => {
    fetchSpreadsheets(filter);
  }, [fetchSpreadsheets, filter]);


  const styles = StyleSheet.create({
    list: {
      height: '30%',
      padding: 16,
      backgroundColor: colors.background
    },
    listItem: {
      backgroundColor: colors.card,
      padding: 10,
      marginVertical: 5,
      borderRadius: 5
    },
    text: {
      color: colors.text
    },
    input: {
      width: 100,
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 5,
      borderRadius: 5,
      color: colors.text
    }
  });


  return (
    <View>
      <Text style={styles.text}>Spreadsheets:</Text>
      <TextInput
              style={styles.input}
              value={filter}
              onChangeText={(text: string) => setFilter(text)}
              keyboardType='ascii-capable'
            />
      <FlatList
        style={styles.list}
        data={spreadsheets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.listItem}
            onPress={() => selectSpreadsheet(item.id)}
          >
            <Text style={styles.text}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />


    </View>
  );


  
};

