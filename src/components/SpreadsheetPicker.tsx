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
import { CustomAlert } from "./CustomModals";
import { SpreadsheetPickerProps } from "../types/Props";

import { ActivityIndicator } from "react-native";
import { useTheme } from "@react-navigation/native";

const SpreadsheetPicker = ({ setShowPicker }: SpreadsheetPickerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { spreadsheets, fetchSpreadsheets, selectSpreadsheet } =
    useGoogleSheets();

  const [filter, setFilter] = useState("");

  const { globalStyles } = useStyles();
  const { colors } = useTheme();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const fetchList = async () => {
      try {
        setIsLoading(true);
        await fetchSpreadsheets(filter);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchList();
  }, [filter]);

  const handleSelectSpreadsheet = async (id, name) => {
    setIsLoading(true);
    try {
      await selectSpreadsheet(id, name);
      setShowPicker(false);
    } catch (error) {
      setAlertMessage(error.message);
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

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
      {isLoading ? (
        <ActivityIndicator size="large" color={colors.notification} />
      ) : (
        <>
          <FlatList
            contentContainerStyle={StyleSheet.compose(
              globalStyles.container,
              globalStyles.list
            )}
            data={spreadsheets}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={StyleSheet.compose(
                  globalStyles.card,
                  globalStyles.listItem
                )}
                onPress={() => handleSelectSpreadsheet(item.id, item.name)}
              >
                <Text
                  style={StyleSheet.compose(
                    globalStyles.text,
                    globalStyles.listText
                  )}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

export default SpreadsheetPicker;
