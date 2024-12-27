
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AddScreen } from './src/screens/AddScreen'
import { TotalScreen } from './src/screens/TotalScreen';;
import { Player } from './src/types/PlayerTypes';
import { RootTabParamList } from './src/types/RootTabParamList';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { PlayersProvider, usePlayers } from './src/contexts/PlayersContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { GoogleSignin } from '@react-native-google-signin/google-signin';




const Tab = createBottomTabNavigator<RootTabParamList, "navigatorID">();

const players = [
  new Player('Bob', 0),
  new Player('Kåre', 0),
  new Player('Arne', 0),
].sort((p1,p2) => p1.name.localeCompare(p2.name));

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive'],
  webClientId: "51631271989-jfp24tmq4jn4t3lepv19hhh0ddhkiuln.apps.googleusercontent.com"
})


const MainApp = () => {
  const { setPlayers } = usePlayers();

  useEffect(() => {
    setPlayers(players);
  }, []);
  
  return (
    <NavigationContainer>
      <Tab.Navigator id="navigatorID">
        <Tab.Screen 
          name="Add" 
          component={AddScreen}
          initialParams={{
            players: players
          }}
        />
        <Tab.Screen 
          name="Total" 
          component={TotalScreen}
          initialParams={{
            players: players
          }}
          />
          <Tab.Screen 
          name="Account" 
          component={LoginScreen}
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
