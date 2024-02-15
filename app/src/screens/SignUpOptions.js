import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SIZES } from "../constants/theme";
import loginAndSignUpStyle from "../global/loginAndSignUpStyle";

const SignUpOptions = ({ navigation }) => {
  return (
    <LinearGradient
      colors={[COLORS.green, COLORS.darkGreen]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.9 }}
      style={loginAndSignUpStyle.gradientBackground}
    >
      <View style={loginAndSignUpStyle.container}>
        <View style={loginAndSignUpStyle.formContent}>
          <Text style={styles.title}> Sign Up Options</Text>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => navigation.navigate("studentSignUp")}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>As Student</Text>

                <Image
                  source={require("../assets/images/student.png")}
                  style={styles.buttonImage}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => navigation.navigate("tutorSignUp")}
            >
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>As Tutor</Text>
                <Image
                  source={require("../assets/images/male-teacher.png")}
                  style={styles.buttonImage}
                />
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.existingUser}
            onPress={() => navigation.navigate("login")}
          >
            <Text style={styles.login}>Already user? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default SignUpOptions;

const styles = StyleSheet.create({
  title: {
    color: COLORS.white,
    fontSize: SIZES.LargeTitle,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
  },
  optionsContainer: {
    marginVertical: 30,
    alignItems: "center",
  },
  buttonContainer: {
    backgroundColor: "#15AB5C",
    padding: 20,
    borderRadius: 5,
    marginBottom: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 170,
    height: 170,
  },
  buttonContent: {
    flexDirection: "column",
    alignItems: "center",
  },
  buttonImage: {
    marginTop: 5,
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: "#FFFFFF",
  },
  existingUser: {
    alignItems: "center",
    marginTop: 20,
  },
  login: {
    color: COLORS.white,
    fontSize: SIZES.small,
  },
});
