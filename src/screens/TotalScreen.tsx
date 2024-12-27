import React from "react";
import { View, StyleSheet } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RootTabParamList } from "../types/RootTabParamList";
import { PlayerTotal } from "../components/PlayerTotal";

type TotalScreenProps = BottomTabScreenProps<RootTabParamList, "Total">;

export const TotalScreen = ({ route }: TotalScreenProps) => {

    const { players } = route.params;

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