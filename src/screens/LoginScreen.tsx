import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import useGoogleSignin from "../hooks/GoogleSignin";
import { useAuth } from "../contexts/AuthContext";
import SpreadsheetPicker from "../components/SpreadsheetPicker";
import { useStyles } from "../styles/StylesContext";
import { useBuyin } from "../contexts/BuyinContext";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { BackHandler } from "react-native";
import useGoogleSheets from "../hooks/GoogleSheets";
import { CustomAlert, CustomInput } from "../components/CustomModals";

const LoginScreen = () => {
  const { signIn, signOut } = useGoogleSignin();
  const { auth } = useAuth();
  const { globalStyles } = useStyles();
  const [showPicker, setShowPicker] = useState(false);
  const { buyin, setBuyin } = useBuyin();
  const [showNameModal, setShowNameModal] = useState(false);
  const [showPlayersModal, setShowPlayersModal] = useState(false);
  const [spreadsheetName, setSpreadsheetName] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { postData, createSpreadsheet, selectSpreadsheet } = useGoogleSheets();
  const { colors } = useTheme();

  const handleShowPicker = () => {
    setShowPicker(true);
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (showPicker) {
          setShowPicker(false);
          return true;
        }
        return false;
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      return () =>
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    }, [showPicker])
  );

  const handleCreateSpreadsheet = () => {
    setShowNameModal(true);
  };

  const handleNameConfirm = (name: string) => {
    setSpreadsheetName(name);
    setShowNameModal(false);
    setShowPlayersModal(true);
  };

  const handlePlayersConfirm = async (players: string) => {
    setShowPlayersModal(false);
    setIsLoading(true)
    try {
      const sortedPlayers = players.split(",").map((p) => p.trim());
      sortedPlayers.sort();
      const data = [["Week", ...sortedPlayers]];
      const spreadsheetId = await createSpreadsheet(
        data.length + 1,
        spreadsheetName
      );
      await postData("A1:1", data, spreadsheetId);
      await selectSpreadsheet(spreadsheetId, spreadsheetName);
    } catch (error) {
      setAlertMessage(error.message);
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View
      style={StyleSheet.compose(
      globalStyles.container,
      globalStyles.flexContainer
      )}
    >
      <CustomInput
      visible={showNameModal}
      title="Enter spreadsheet name:"
      placeholder={`Poker List ${new Date().getFullYear()}`}
      onConfirm={handleNameConfirm}
      onCancel={() => setShowNameModal(false)}
      />
      <CustomInput
      visible={showPlayersModal}
      title="Enter players names (comma-seperated):"
      placeholder="Player1, Player2, Player3"
      onConfirm={handlePlayersConfirm}
      onCancel={() => setShowPlayersModal(false)}
      />
      {isLoading ? (
      <ActivityIndicator size="large" color={colors.notification} />
      ) : (
      !auth ? (
        <TouchableOpacity
        style={StyleSheet.compose(globalStyles.card, globalStyles.button)}
        onPress={signIn}
        >
        <Text
          style={StyleSheet.compose(
          globalStyles.text,
          globalStyles.buttonText
          )}
        >
          Sign in with Google
        </Text>
        </TouchableOpacity>
      ) : showPicker ? (
        <SpreadsheetPicker setShowPicker={setShowPicker} />
      ) : (
        <>
        <TouchableOpacity
          style={StyleSheet.compose(globalStyles.card, globalStyles.button)}
          onPress={signOut}
        >
          <Text
          style={StyleSheet.compose(
            globalStyles.text,
            globalStyles.buttonText
          )}
          >
          Sign out from Google
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={StyleSheet.compose(globalStyles.card, globalStyles.button)}
          onPress={handleShowPicker}
        >
          <Text
          style={StyleSheet.compose(
            globalStyles.text,
            globalStyles.buttonText
          )}
          >
          Choose spreadsheet
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={StyleSheet.compose(globalStyles.card, globalStyles.button)}
          onPress={handleCreateSpreadsheet}
        >
          <Text
          style={StyleSheet.compose(
            globalStyles.text,
            globalStyles.buttonText
          )}
          >
          Create new spreadsheet
          </Text>
        </TouchableOpacity>
        <View style={globalStyles.card}>
          <Text style={globalStyles.text}>Account: {auth.account}</Text>
        </View>
        {auth?.spreadsheetId && (
          <View style={globalStyles.card}>
          <Text style={globalStyles.text}>
            Spreadsheet: {auth.spreadsheetName}
          </Text>
          </View>
        )}
        <View style={globalStyles.card}>
          <Text style={globalStyles.text}>Default buy in:</Text>
          <TextInput
          style={StyleSheet.compose(globalStyles.text, globalStyles.input)}
          value={buyin}
          onChangeText={(text: string) => setBuyin(text)}
          keyboardType="number-pad"
          />
        </View>
        </>
      )
      )}
      <CustomAlert
      visible={alertVisible}
      message={alertMessage}
      onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

export default LoginScreen;
