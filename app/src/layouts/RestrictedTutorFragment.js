import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/theme";
import BottomNav from "../components/TutorBottomNav";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RestrictedBottomNav from "../components/RestrictedTutorBottomNav";

export const RestrictedTutorFragment = ({ children, activeLink }) => {
  return (
    <>
      <View style={styles.headerContainer}>
        {/* Your header content goes here */}
      </View>
      <View style={styles.container}>{children}</View>
      <RestrictedBottomNav activeLink={activeLink} />
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
