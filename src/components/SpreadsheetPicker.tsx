import React, { useEffect, useState } from "react";
import useGoogleSheets from "../hooks/GoogleSheets";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useStyles } from "../styles/StylesContext";
import CustomAlert from "./CustomAlert";
import { SpreadsheetPickerProps } from "../types/Props";

const SpreadsheetPicker = ({ setShowPicker }: SpreadsheetPickerProps) => {
  const { spreadsheets, fetchSpreadsheets, selectSpreadsheet } =
    useGoogleSheets();

  const [filter, setFilter] = useState("");

  const { globalStyles } = useStyles();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchSpreadsheets(filter);
  }, [fetchSpreadsheets, filter]);

  const handleSelectSpreadsheet = async (id, name) => {
    try {
      await selectSpreadsheet(id, name);
      setShowPicker(false);
    } catch (error) {
      setAlertMessage(error.message);
      setAlertVisible(true);
    }
  };

  const styles = StyleSheet.create({
    list: {
      width: "100%",
    },
    listItem: {
      height: 65,
      width: "100%",
    },
    listText: {
      fontSize: 16,
    },
  });

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.card}>
        <Text style={globalStyles.text}>Filter spreadsheets:</Text>
        <TextInput
          style={StyleSheet.compose(globalStyles.text, globalStyles.input)}
          value={filter}
          onChangeText={(text: string) => setFilter(text)}
          keyboardType="ascii-capable"
        />
      </View>

      <FlatList
        contentContainerStyle={StyleSheet.compose(
          globalStyles.container,
          styles.list
        )}
        data={spreadsheets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={StyleSheet.compose(globalStyles.card, styles.listItem)}
            onPress={() => handleSelectSpreadsheet(item.id, item.name)}
          >
            <Text
              style={StyleSheet.compose(globalStyles.text, styles.listText)}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

export default SpreadsheetPicker;
