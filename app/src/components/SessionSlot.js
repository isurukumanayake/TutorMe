import React from "react";
import { StyleSheet, View, Text } from "react-native";

import { COLORS } from "../constants/theme";

export default function SessionSlot({ sessionSlot }) {
  return (
    <View style={styles.sessionBar}>
      <View style={styles.sessionDetails}>
        <Text style={styles.sessionInfo}>{sessionSlot.day}</Text>
        <Text style={styles.sessionInfo}>
          {sessionSlot.startTime} - {sessionSlot.endTime}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sessionBar: {
    backgroundColor: COLORS.white,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  sessionDetails: {
    color: COLORS.darkGreen,
    fontWeight: "bold",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 16,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  sessionInfo: {
    color: COLORS.darkGreen,
    // fontWeight: "bold",
    fontSize: 16,
  },
});
