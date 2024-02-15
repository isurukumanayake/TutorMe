import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/theme";

export default function WildClassCard({ item, navigation }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("singleNewRequest", { item: item })}
    >
      {/* <Text>Card</Text> */}
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.className}
      </Text>

      <Text style={styles.student} numberOfLines={2}>
        {item.student}
      </Text>

      <View style={styles.cardBottom}>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.subTitle}>Session Date :</Text>
          <Text style={styles.textData} numberOfLines={1}>
            {item.sessionDate}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.subTitle}>Session Time :</Text>
          <Text style={styles.textData} numberOfLines={1}>
            {item.session}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    // width: "45%", // 2 cards per row with a small gap
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

  student: {
    marginBottom: 8,
  },
  duration: {
    fontWeight: "900",
    fontSize: 16,
  },
  subTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginRight: 5,
  },
});
