import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  home,
  homeSelected,
  profile,
  profileSelected,
  studyMaterial,
  studyMaterialSelected,
  search,
  searchSelected,
} from "../constants/images";
import { useNavigation } from "@react-navigation/native";

const navigationItems = [
  { name: "home", icon: home, selectedIcon: homeSelected, navigation: "home" },
  {
    name: "search",
    icon: search,
    selectedIcon: searchSelected,
    navigation: "search",
  },
  {
    name: "studyMaterials",
    icon: studyMaterial,
    selectedIcon: studyMaterialSelected,
    navigation: "studyMaterials",
  },
  {
    name: "profile",
    icon: profile,
    selectedIcon: profileSelected,
    navigation: "profile",
  },
];

export default function BottomNav({ activeLink }) {
  const navigation = useNavigation();
  return (
    <View style={styles.bottomNav}>
      {navigationItems.map((item) => (
        <View key={item.name} style={styles.linkContainer}>
          <TouchableOpacity
            style={[
              styles.iconContainer,
              activeLink === item.name && { backgroundColor: "green" },
            ]}
            onPress={() => navigation.navigate(item.navigation)}
          >
            <Image
              source={activeLink === item.name ? item.selectedIcon : item.icon}
              style={styles.navIcon}
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: "row",
    height: 80,
    backgroundColor: "white",
    justifyContent: "space-around",
    alignItems: "center",
  },
  linkContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "80%",
    width: 80,
  },
  iconContainer: {
    height: 60,
    width: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  navIcon: {
    height: 40,
    width: 40,
  },
});
