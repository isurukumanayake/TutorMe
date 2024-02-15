import React from "react";
import { StyleSheet } from "react-native";

import { COLORS } from "../constants/theme";

const globalStyles = StyleSheet.create({
  boldF24mb2: {
    color: COLORS.darkGreen,
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 2,
  },
  boldF16mb2: {
    color: COLORS.darkGreen,
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
  },
  regularF14: {
    color: COLORS.darkGreen,
    // fontWeight: "bold",
    fontSize: 14,
  },
  rightAline: {
    alignItems: "flex-end",
  },
  boldF24mb8: {
    fontWeight: "bold",
    fontSize: 24,
    marginBottom: 8,
  },
  regularF16: {
    color: COLORS.darkGreen,
    // fontWeight: "bold",
    fontSize: 16,
  },
  boldF16mb8: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
});

export default globalStyles;
