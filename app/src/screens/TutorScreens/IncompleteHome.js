import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SIZES } from "../../constants/theme";
import loginAndSignUpStyle from "../../global/loginAndSignUpStyle";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import BottomNav from "../../components/TutorBottomNav";
import RestrictedBottomNav from "../../components/RestrictedTutorBottomNav";

const IncompleteHome = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={[COLORS.lightGreen, COLORS.lightGray]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.9 }}
      style={loginAndSignUpStyle.gradientBackground}
    >
      <ImageBackground
        source={require("../../assets/images/incomplete.png")}
        style={loginAndSignUpStyle.bgImage}
      >
        <View style={loginAndSignUpStyle.container}>
          <View style={loginAndSignUpStyle.formContent}>
            <SafeAreaView style={styles.container}>
              <View style={styles.bottomButtonContainer}>
                <Text style={styles.buttonText2}>
                  Complete your profile to get full access
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate("incompleteForm")}
                >
                  <Text style={styles.buttonText}>Complete Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonText}
                  onPress={() => navigation.navigate("restrictedTutorProfile")}
                >
                  <Text style={styles.skip}>Skip</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        </View>
      </ImageBackground>
      <RestrictedBottomNav activeLink="home" />
    </LinearGradient>
  );
};

export default IncompleteHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#14A056",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 200,
    marginLeft: 30,
    marginRight: 30,
  },
  bottomButtonContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#BFFCDC",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  skip: {
    color: "white",
  },
  buttonText2: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
});
