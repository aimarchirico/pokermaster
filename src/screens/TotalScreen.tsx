import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { PlayerTotal } from "../components/PlayerTotal";
import { usePlayers } from "../contexts/PlayersContext";
import { useStyles } from "../styles/StylesContext";

export const TotalScreen = () => {

    const { players } = usePlayers();
    const { globalStyles } = useStyles();

    return (
        <ScrollView contentContainerStyle={globalStyles.container}>
            {players.map(player => (
                <PlayerTotal
                key={player.name}
                player={player}
                />
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
  });