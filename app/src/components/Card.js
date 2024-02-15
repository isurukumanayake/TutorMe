import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/theme";

export default function Card({ item, navigation, id }) {
  // const handleCardPress = () => {
  //   navigation.navigate("classDetails");
  // };

  // console.log("id", id);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("classDetails", { item: item })}
    >
      {/* <Text>Card</Text> */}
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.classTitle}
      </Text>
      {item.classDescription != " " ? (
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.classDescription}
        </Text>
      ) : null}
      {item.classTutor != " " ? (
        <Text numberOfLines={1}>{item.classTutor}</Text>
      ) : null}
      <View style={styles.cardBottom}>
        <Text style={styles.duration} numberOfLines={1}>
          {item.duration} hrs
        </Text>
        <Text style={styles.price} numberOfLines={1}>
          Rs: {item.price ? item.price : 0.0}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "45%", // 2 cards per row with a small gap
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    marginLeft: 8,
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "bottom",
  },

  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },

  cardDescription: {
    marginBottom: 8,
  },
  duration: {
    fontWeight: "900",
    fontSize: 16,
  },
  price: {
    backgroundColor: "#FDE8E8",
    padding: 4,
    fontWeight: "900",
    fontSize: 14,
    color: COLORS.orange,
    borderRadius: 4,
  },
});
