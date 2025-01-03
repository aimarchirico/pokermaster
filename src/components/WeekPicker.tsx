import React, { Text, FlatList, View, StyleSheet, TouchableOpacity} from "react-native";
import { useStyles } from "../styles/StylesContext";
import { useEffect, useState } from "react";
import useGoogleSheets from "../hooks/GoogleSheets";
import { WeekPickerProps } from "../types/Props";
import { ActivityIndicator } from "react-native";
import { useTheme } from "@react-navigation/native";


const WeekPicker = ({ setShowPicker, setRow }: WeekPickerProps) => {
  const { globalStyles } = useStyles();
  const [weeks, setWeeks] = useState([]); 
  const { fetchData } = useGoogleSheets();
  const [isLoading, setIsLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    const fetchWeeks = async () => {
      try {
        setIsLoading(true);
        const response = await fetchData('A2:A');
        setWeeks(response.map(row => row[0]))
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
      
    }
    fetchWeeks()
  }, [])

  const handleSelectWeek = (index: number) => {
    setRow(weeks.length - index + 1);
    setShowPicker(false);
  }


  return (
    <View style={globalStyles.container}>
      
      {isLoading ? (
        <ActivityIndicator size='large' color={colors.notification} />
      ) : (
      <FlatList
        contentContainerStyle={StyleSheet.compose(
          globalStyles.container,
          globalStyles.list
        )}
        data={weeks.toReversed()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={StyleSheet.compose(globalStyles.card, globalStyles.listItem)}
            onPress={() => handleSelectWeek(index)}
          >
            <Text
              style={StyleSheet.compose(globalStyles.text, globalStyles.listText)}
            >
              {`Week ${item}`}
            </Text>
          </TouchableOpacity>
        )}
      />
      )}

      
    </View>
  );
}

export default WeekPicker;