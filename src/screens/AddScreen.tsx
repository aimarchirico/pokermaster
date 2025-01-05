import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import PlayerAdd from "../components/PlayerAdd";
import { usePlayers } from "../contexts/PlayersContext";
import { AmountData, Player } from "../types/PlayerTypes";
import useGoogleSheets from "../hooks/GoogleSheets";
import { useStyles } from "../styles/StylesContext";
import { CustomAlert } from "../components/CustomModals";
import {
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import RootTabParamList from "../types/RootTabParamList";
import * as Clipboard from "expo-clipboard";
import { useBuyin } from "../contexts/BuyinContext";
import { useAuth } from "../contexts/AuthContext";

const AddScreen = () => {
  const { players, setPlayers } = usePlayers();
  const [inputAmounts, setInputAmounts] = useState<{
    [key: string]: AmountData;
  }>({});
  const [resetTrigger, setResetTrigger] = useState(0);
  const { appendData } = useGoogleSheets();
  const { globalStyles } = useStyles();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigation = useNavigation<NavigationProp<RootTabParamList>>();
  const { buyin } = useBuyin();
  const { auth } = useAuth();

  const handleAmountChange = (type: string, name: string, amount: number) => {
    setInputAmounts((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        [type]: amount,
      },
    }));
  };

  const updateBalance = (player: Player) => {
    player.balance +=
      inputAmounts[player.name]?.end ||
      0 - inputAmounts[player.name]?.start ||
      0;
  };

  useEffect(() => {
    if (!players) return;

    setInputAmounts((prev) => {
      const updated = { ...prev };
      players.forEach((player) => {
        updated[player.name] = {
          end: updated[player.name]?.end || 0,
          start: parseFloat(buyin) || 0,
        };
      });
      return updated;
    });
  }, [buyin, players]);

  const handleConfirm = () => {
    try {
      const data = players.map(
        (player) =>
          (inputAmounts[player.name]?.end || 0) -
          (inputAmounts[player.name]?.start || 0)
      );
      const sum = data.reduce((a, b) => a + b, 0);
      if (sum !== 0) {
        throw Error(`Sum equals ${sum}. Please ensure sum equals zero.`);
      }
      appendData(data.map((value) => value.toString()));

      const clipboardText =
        players.map((player, i) => `${player.name}: ${data[i]}`).join("\n") +
        `\nhttps://docs.google.com/spreadsheets/d/${auth?.spreadsheetId}`;
      Clipboard.setStringAsync(clipboardText);

      const updatedPlayers = [...players];
      updatedPlayers.forEach((player) => {
        updateBalance(player);
      });
      setPlayers(updatedPlayers);
      setInputAmounts({});
      setResetTrigger((prev) => prev + 1);
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
      <View
        style={StyleSheet.compose(
          globalStyles.card,
          globalStyles.subheaderCard
        )}
      >
        <Text
          style={StyleSheet.compose(globalStyles.text, globalStyles.subheader)}
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
          Start
        </Text>
        <Text
          style={[
            globalStyles.text,
            globalStyles.subheader,
            globalStyles.rightSubheader,
          ]}
        >
          End
        </Text>
      </View>

      <ScrollView contentContainerStyle={globalStyles.container}>
        {players?.map((player) => (
          <PlayerAdd
            key={player.name}
            player={player}
            onAmountChange={(type, amount) =>
              handleAmountChange(type, player.name, amount)
            }
            resetTrigger={resetTrigger}
          />
        ))}
      </ScrollView>
      <TouchableOpacity
        style={[globalStyles.card, globalStyles.button]}
        onPress={handleConfirm}
      >
        <Text
          style={StyleSheet.compose(globalStyles.text, globalStyles.buttonText)}
        >
          Save
        </Text>
      </TouchableOpacity>
      <CustomAlert
        visible={alertVisible}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

export default AddScreen;
