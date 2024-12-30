import React, { useState } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import useGoogleSignin from "../hooks/GoogleSignin";
import { useAuth } from "../contexts/AuthContext";
import SpreadsheetPicker from "../components/SpreadsheetPicker";
import { useTheme } from "@react-navigation/native";
import { useStyles } from "../styles/StylesContext";

export const LoginScreen = () => {
  const { signIn, signOut } = useGoogleSignin();
  const { auth } = useAuth();
  const { globalStyles } = useStyles();
  const [showPicker, setShowPicker] = useState(false);

  const handleShowPicker = () => {
    setShowPicker(true);
  }

  return (
    <View style={StyleSheet.compose(globalStyles.container,globalStyles.flexContainer)}>
      {!auth ? (
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
      ) : (
        showPicker ? (
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
          </>
        )
        
          
      )}
    </View>
  );
};
