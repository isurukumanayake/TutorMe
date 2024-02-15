import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import React, { useState } from "react";
import { StudentFragment } from "../../layouts/StudentFragment";
import { COLORS } from "../../constants/theme";
import { FontAwesome } from "@expo/vector-icons";
import images from "../../constants/images";

const categories = [
  { name: "Computing", icon: images.computing },
  { name: "Business", icon: images.business },
  { name: "Engineering", icon: images.engineering },
  { name: "Architecture", icon: images.architecture },
  { name: "Law", icon: images.law },
  { name: "Nursing", icon: images.nursing },
  { name: "Psychology", icon: images.psychology },
  { name: "Quantity Surveying", icon: images.quantitySurveying },
  { name: "Biotechnology", icon: images.biotechnology },
  { name: "English", icon: images.english },
  { name: "Science", icon: images.science },
  { name: "Mathematics", icon: images.mathematics },
  { name: "Hospitality", icon: images.hospitality },
  { name: "Cookery", icon: images.cookery },
  { name: "Sports", icon: images.sports },
];

const CategorySearch = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() =>
        navigation.navigate("searchResults", { category: item.name })
      }
    >
      <Image source={item.icon} style={styles.categoryIcon} />
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <StudentFragment activeLink="search">
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Find a Class</Text>
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
        />
        <TouchableOpacity
          style={styles.searchIconContainer}
          onPress={() => {
            navigation.navigate("searchResults", { searchText: searchText });
            setSearchText("");
          }}
        >
          <FontAwesome name="search" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.name}
        numColumns={3} // You can change the number of columns as needed
        style={styles.catalog}
      />
    </StudentFragment>
  );
};

export default CategorySearch;

const styles = StyleSheet.create({
  headerContainer: {
    padding: 18,
    backgroundColor: COLORS.green,
  },
  headerText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: COLORS.white,
  },
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
    alignItems: "center",
  },
  searchIconContainer: {
    height: 40,
    width: 40,
    backgroundColor: COLORS.orange,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  catalog: {
    paddingHorizontal: 10,
  },
  categoryItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    padding: 10,
    backgroundColor: COLORS.white,
    borderRadius: 4,
    shadowColor: COLORS.black,
    shadowRadius: 2,
    elevation: 3,
  },
  categoryIcon: {
    width: 50,
    height: 50,
  },
  categoryName: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
  },
});
