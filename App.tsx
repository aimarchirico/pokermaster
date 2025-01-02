import React from "react";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AddScreen } from "./src/screens/AddScreen";
import { TotalScreen } from "./src/screens/TotalScreen";
import RootTabParamList from "./src/types/RootTabParamList";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { PlayersProvider } from "./src/contexts/PlayersContext";
import { LoginScreen } from "./src/screens/LoginScreen";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";;
import { useStyles, StylesProvider } from "./src/styles/StylesContext";
import { getISOWeekNumber } from "./src/utils/dateUtils";
import clientId from "./src/assets/clientId"

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#BB86FC",
    background: "#121212",
    card: "#1E1E1E",
    text: "#FFFFFF",
    border: "#2C2C2C",
  },
};

const Tab = createBottomTabNavigator<RootTabParamList, "navigatorID">();

GoogleSignin.configure({
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
  ],
  webClientId: clientId,
});

SplashScreen.preventAutoHideAsync();

const MainApp = () => {
  const { auth } = useAuth();
  const { globalStyles } = useStyles();

  return (
    <>
      <StatusBar style="inverted" />
      <Tab.Navigator
        id="navigatorID"
        screenOptions={{
          tabBarActiveTintColor: "#e91e63",
          tabBarInactiveTintColor: "gray",
          tabBarLabelStyle: StyleSheet.compose(
            globalStyles.text,
            globalStyles.smallText
          ),
          headerTitleStyle: StyleSheet.compose(
            globalStyles.text,
            globalStyles.header
          ),
        }}
      >
        <Tab.Screen
          name="Add"
          component={
            auth?.accessToken && auth?.spreadsheetId ? AddScreen : LoginScreen
          }
          options={{
            headerTitle: `Week ${getISOWeekNumber(new Date())}`,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Total"
          component={
            auth?.accessToken && auth?.spreadsheetId ? TotalScreen : LoginScreen
          }
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Account"
          component={LoginScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default function App() {
  return (
    <NavigationContainer theme={CustomDarkTheme}>
      <StylesProvider>
        <PlayersProvider>
          <AuthProvider>
            <MainApp />
          </AuthProvider>
        </PlayersProvider>
      </StylesProvider>
    </NavigationContainer>
  );
}
