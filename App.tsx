
import React, { useEffect } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AddScreen } from './src/screens/AddScreen'
import { TotalScreen } from './src/screens/TotalScreen';;
import { Player } from './src/types/PlayerTypes';
import { RootTabParamList } from './src/types/RootTabParamList';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { PlayersProvider, usePlayers } from './src/contexts/PlayersContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useGoogleSheets } from './src/hooks/GoogleSheets'; 
import { Ionicons } from '@expo/vector-icons'; 
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';


const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#BB86FC',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    border: '#2C2C2C',
  }
}

const Tab = createBottomTabNavigator<RootTabParamList,"navigatorID">();

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
  webClientId: "51631271989-jfp24tmq4jn4t3lepv19hhh0ddhkiuln.apps.googleusercontent.com"
})


const MainApp = () => {
  const { fetchData } = useGoogleSheets(); 
  const { auth } = useAuth();
  const { setPlayers } = usePlayers();

  const fetchPlayers = async () => {
    if (auth.spreadsheetId) {
      const response  = await fetchData('B1:2');
      const players: Player[] = response[0].map((name: string, i: number) => new Player(name, parseFloat(response[1][i])));
      setPlayers(players);
    }
  }

  useEffect(() => {
    fetchPlayers();
  }, [auth?.spreadsheetId]);
  
  return (
    <NavigationContainer theme={CustomDarkTheme}>
      <View style={styles.container}/>
      <StatusBar style='inverted' />
      <Tab.Navigator id="navigatorID"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        tabBarInactiveTintColor: 'gray'
      }}
      >
        <Tab.Screen 
          name="Add" 
          component={AddScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='add-circle' size={size} color={color} />
            )
          }}
        />
        <Tab.Screen 
          name="Total" 
          component={TotalScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='stats-chart' size={size} color={color} />
            )
          }}
          />
          <Tab.Screen 
          name="Account" 
          component={LoginScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='person' size={size} color={color} />
            )
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <PlayersProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </PlayersProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212'
  },
})