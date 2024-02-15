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
import { COLORS, SIZES } from "../constants/theme";
import loginAndSignUpStyle from "../global/loginAndSignUpStyle";
import { useNavigation } from "@react-navigation/native";
import { sendPasswordResetEmail } from "firebase/auth";
import { FIREBASE_AUTH } from "../../FirebaseConfig";

const ForgetPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");

  //forget password
  const forgetPassword = () => {
    sendPasswordResetEmail(FIREBASE_AUTH, email)
      .then(() => {
        alert("Password reset email sent");
        navigation.navigate("login");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <LinearGradient
      colors={[COLORS.green, COLORS.darkGreen]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.9 }}
      style={loginAndSignUpStyle.gradientBackground}
    >
      <ImageBackground
        source={require("../assets/images/forget.png")}
        style={loginAndSignUpStyle.bgImage}
      >
        <View style={loginAndSignUpStyle.container}>
          <View style={loginAndSignUpStyle.formContent}>
            <Text style={loginAndSignUpStyle.title}>Forgot Your Password</Text>

            <View style={styles.rememberMe}>
              <Text style={styles.rememberMeText}>
                Confirm your email and we'll send the instructions.
              </Text>
            </View>

            <View style={loginAndSignUpStyle.inputField}>
              <Image
                source={require("../assets/icons/mail.png")}
                style={loginAndSignUpStyle.inputFieldIcon}
              />
              <TextInput
                style={loginAndSignUpStyle.input}
                placeholder="Email"
                onChangeText={(email) => setEmail(email)}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={COLORS.darkGray}
              />
            </View>

            <TouchableOpacity
              style={loginAndSignUpStyle.loginButton}
              onPress={forgetPassword}
            >
              <Text style={loginAndSignUpStyle.loginButtonText}>
                Reset Password
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={loginAndSignUpStyle.newUser}
              onPress={() => navigation.navigate("signUpOptions")}
            >
              <Text style={loginAndSignUpStyle.forgotPasswordText}>
                New user? Sign up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </LinearGradient>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  rememberMeText: {
    color: COLORS.white,
    fontSize: 16,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
});
