import React, { useEffect, useLayoutEffect, useState } from "react";
import WeekPicker from "../components/WeekPicker";
import {
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useStyles } from "../styles/StylesContext";
import { usePlayers } from "../contexts/PlayersContext";
import PlayerUpdate from "../components/PlayerUpdate";
import { CustomAlert } from "../components/CustomModals";
import useGoogleSheets from "../hooks/GoogleSheets";

import * as Clipboard from "expo-clipboard";
import { Player } from "../types/PlayerTypes";
import {
  NavigationProp,
  useNavigation,
  useTheme,
} from "@react-navigation/native";
import RootTabParamList from "../types/RootTabParamList";
import { useAuth } from "../contexts/AuthContext";
import { useFocusEffect } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { ActivityIndicator } from "react-native";

const HistoryScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();
  const { globalStyles } = useStyles();
  const [showPicker, setShowPicker] = useState(true);
  const { players, setPlayers } = usePlayers();
  const { auth } = useAuth();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const { fetchData } = useGoogleSheets();
  const [inputAmounts, setInputAmounts] = useState<{
    [key: string]: number;
  }>({});
  const { postData } = useGoogleSheets();
  const [row, setRow] = useState(1);
  const [week, setWeek] = useState("");
  const { colors } = useTheme();

  useLayoutEffect(() => {
    if (!showPicker) {
      navigation.setOptions({
        headerTitle: `Week ${week}`,
      });
    }
  }, [navigation, week]);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (!showPicker) {
          setShowPicker(true);
          navigation.setOptions({
            headerTitle: "History",
          });
          return true;
        }
        return false;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [showPicker])
  );

  useEffect(() => {
    const fetchProfit = async () => {
      setIsLoading(true);
      try {
        const response = await fetchData(`A${row}:${row}`);
        const data = response[0].slice(1);
        const fetchedInputAmounts = { ...inputAmounts };
        players.forEach((player, i) => {
          fetchedInputAmounts[player.name] = parseFloat(data[i]);
        });
        setInputAmounts(fetchedInputAmounts);
        setWeek(response[0][0]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfit();
  }, [row]);

  const handleAmountChange = (name: string, amount: number) => {
    setInputAmounts((prev) => ({
      ...prev,
      [name]: amount,
    }));
  };

  const updateBalance = (player: Player) => {
    player.balance += inputAmounts[player.name] || 0;
  };

  const handleConfirm = () => {
    try {
      const data = players.map((player) => inputAmounts[player.name] || 0);
      const sum = data.reduce((a, b) => a + b, 0);
      if (sum !== 0) {
        throw Error(`Sum equals ${sum}. Please ensure sum equals zero.`);
      }
      postData(`B${row}:${row}`, [data.map((value) => value.toString())]);

      const clipboardText =
        players.map((player, i) => `${player.name}: ${data[i]}`).join("\n") +
        `\nhttps://docs.google.com/spreadsheets/d/${auth?.spreadsheetId}`;
      Clipboard.setStringAsync(clipboardText);

      const updatedPlayers = [...players];
      updatedPlayers.forEach((player) => {
        updateBalance(player);
      });
      setPlayers(updatedPlayers);
      navigation.navigate("Total");
    } catch (error) {
      setAlertMessage(error.message);
      setAlertVisible(true);
    }
  };

  return (
    <View
      style={StyleSheet.compose(
        globalStyles.container,
        globalStyles.flexContainer
      )}
    >
      {showPicker ? (
        <WeekPicker setShowPicker={setShowPicker} setRow={setRow} />
      ) : (
        <>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.notification} />
          ) : (
            <>
              <View
                style={StyleSheet.compose(
                  globalStyles.card,
                  globalStyles.subheaderCard
                )}
              >
                <Text
                  style={StyleSheet.compose(
                    globalStyles.text,
                    globalStyles.subheader
                  )}
                >
                  Name
                </Text>
                <Text
                  style={[
                    globalStyles.text,
                    globalStyles.subheader,
                    globalStyles.rightSubheader,
                  ]}
                >
                  Profit
                </Text>
              </View>
              <ScrollView contentContainerStyle={globalStyles.container}>
                {players?.map((player) => (
                  <PlayerUpdate
                    key={player.name}
                    player={player}
                    defaultValue={inputAmounts[player.name]}
                    onAmountChange={(amount) =>
                      handleAmountChange(player.name, amount)
                    }
                  />
                ))}
              </ScrollView>
              <TouchableOpacity
                style={[globalStyles.card, globalStyles.button]}
                onPress={handleConfirm}
              >
                <Text
                  style={StyleSheet.compose(
                    globalStyles.text,
                    globalStyles.buttonText
                  )}
                >
                  Update
                </Text>
              </TouchableOpacity>
              <CustomAlert
                visible={alertVisible}
                message={alertMessage}
                onClose={() => setAlertVisible(false)}
              />
            </>
          )}
        </>
      )}
    </View>
  );
};

export default HistoryScreen;
