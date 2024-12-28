import React from "react";
import { View, StyleSheet } from "react-native";
import { PlayerTotal } from "../components/PlayerTotal";
import { usePlayers } from "../contexts/PlayersContext";

export const TotalScreen = () => {

    const { players } = usePlayers();

    return (
        <View style={styles.container}>
            {players.map(player => (
                <PlayerTotal
                key={player.name}
                player={player}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },
  });