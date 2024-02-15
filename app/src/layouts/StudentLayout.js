import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/theme";
import images from "../constants/images";

const StudentLayout = ({ children, name }) => {
  const navigation = useNavigation();

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={images.backButton} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{name}</Text>
      </View>
      <View style={styles.container}>{children}</View>
    </>
  );
};

export default StudentLayout;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 18,
    backgroundColor: COLORS.green,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  backButton: {
    width: 24,
    height: 24,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGreen,
  },
});
