import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from "react-native";
import PlayerTotal from "../components/PlayerTotal";
import { usePlayers } from "../contexts/PlayersContext";
import { useStyles } from "../styles/StylesContext";
import { useAuth } from "../contexts/AuthContext";

export const TotalScreen = () => {

    const { players } = usePlayers();
    const { globalStyles } = useStyles();
    const { auth } = useAuth();

    const handleOpen = async () => {
      const url = auth?.spreadsheetId ? `https://docs.google.com/spreadsheets/d/${auth.spreadsheetId}` : null;
      url ? await Linking.openURL(url) : null;
    }

      const styles = StyleSheet.create({
        subheaderCard: {
          justifyContent: 'space-between',
          height: 50,
        },
        
      })

    return (
      <View style={StyleSheet.compose(globalStyles.container,globalStyles.flexContainer)}>
        <View style={StyleSheet.compose(globalStyles.card,styles.subheaderCard)}>
                <Text style={StyleSheet.compose(globalStyles.text,globalStyles.subheader)}>Name</Text>
                <Text style={StyleSheet.compose(globalStyles.text,globalStyles.rightSubheader)}>Total</Text>
              </View>
      <ScrollView contentContainerStyle={globalStyles.container}>
          {players.map(player => (
              <PlayerTotal
              key={player.name}
              player={player}
              />
          ))}
      </ScrollView>
      <TouchableOpacity 
                  style={globalStyles.card}
                  onPress={handleOpen}>
                  <Text style={StyleSheet.compose(globalStyles.text, globalStyles.buttonText)}>Open spreadsheet</Text>
                </TouchableOpacity>
      </View>
    )
}