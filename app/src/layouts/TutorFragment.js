import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";
import BottomNav from "../components/TutorBottomNav";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const TutorFragment = ({ children, activeLink }) => {
  return (
    <>
      <View style={styles.headerContainer}>
        {/* Your header content goes here */}
      </View>
      <View style={styles.container}>{children}</View>
      <BottomNav activeLink={activeLink} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGreen,
  },
  headerContainer: {
    // padding: 16,
  },
});
