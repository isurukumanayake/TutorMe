import React from "react";
import { StyleSheet, Text, View, TextInput, FlatList } from "react-native";
import { COLORS } from "../constants/theme";
import { FontAwesome } from "@expo/vector-icons";

export default function SearchBar({ handleSearch, searchText }) {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        onChangeText={(text) => handleSearch(text)}
        value={searchText}
      />
      <View style={styles.searchIconContainer}>
        <FontAwesome name="search" size={24} color="white" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    width: "85%",
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 10,
  },
  searchContainer: {
    flexDirection: "row",
    padding: 16,
    justifyContent: "space-between",
    alignItems: "center", // Use alignItems to center vertically
  },
  searchIconContainer: {
    height: 40,
    width: 40,
    backgroundColor: COLORS.orange,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
