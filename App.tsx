
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { AddScreen } from './src/screens/AddScreen'
import { TotalScreen } from './src/screens/TotalScreen';;
import { Player } from './src/types/Player';
import { RootTabParamList } from './src/types/RootTabParamList';


const Tab = createBottomTabNavigator<RootTabParamList, "navigatorID">();

const players = [
  new Player("Player 1", 0),
  new Player("Player 2", 0),
  new Player("Player 3", 0),
];

export default function App() {
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
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
});
