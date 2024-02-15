import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SIZES } from "../constants/theme";
import loginAndSignUpStyle from "../global/loginAndSignUpStyle";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { saveUserProfileImage } from "../services/user";

const TutorSignUp = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access photos is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 3],
      quality: 1,
    });

    if (!pickerResult.cancelled) {
      // Set the selected image
      setProfileImage(pickerResult.assets[0].uri);
    }
  };

  const registerUser = async (
    email,
    password,
    firstName,
    lastName,
    contactNumber,
    confirmPassword
  ) => {
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !contactNumber ||
      !confirmPassword ||
      !profileImage
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
        .then(async (userCredential) => {
          // Send the email verification
          await sendEmailVerification(FIREBASE_AUTH.currentUser, {
            handleCodeInApp: true,
            url: "https://tutorme-ef18e.firebaseapp.com",
          });

          alert("Verification email sent");

          // Set user data in Firestore
          await setDoc(doc(FIRESTORE_DB, "users", userCredential.user.uid), {
            firstName,
            lastName,
            email,
            contactNumber,
            role: "tutor",
            balance: 0,
          });

          saveUserProfileImage(profileImage);
          alert("Registration successful!");
        })
        .catch((error) => {
          console.log(error);
          alert(error.message);
        });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.green, COLORS.darkGreen]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.9 }}
      style={loginAndSignUpStyle.gradientBackground}
    >
      <View style={styles.container}>
        <View style={styles.formContent}>
          <Text style={styles.title}>Tutor Sign Up</Text>

          <View style={styles.buttonImage}>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={
                  profileImage === null
                    ? require("../assets/images/profile.png")
                    : { uri: profileImage }
                }
                style={styles.buttonImageIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputField}>
            <Image
              source={require("../assets/icons/user.png")}
              style={styles.inputFieldIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="First Name"
              onChangeText={(firstName) => setFirstName(firstName)}
              autoCorrect={false}
              placeholderTextColor={COLORS.darkGray}
            />
          </View>

          <View style={styles.inputField}>
            <Image
              source={require("../assets/icons/user.png")}
              style={styles.inputFieldIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              onChangeText={(lastName) => setLastName(lastName)}
              autoCorrect={false}
              placeholderTextColor={COLORS.darkGray}
            />
          </View>

          <View style={styles.inputField}>
            <Image
              source={require("../assets/icons/mail.png")}
              style={styles.inputFieldIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              onChangeText={(email) => setEmail(email)}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor={COLORS.darkGray}
            />
          </View>

          <View style={styles.inputField}>
            <Image
              source={require("../assets/icons/phone.png")}
              style={styles.inputFieldIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Contact Number"
              onChangeText={(contactNumber) => setContactNumber(contactNumber)}
              keyboardType="numeric"
              placeholderTextColor={COLORS.darkGray}
            />
          </View>

          <View style={styles.inputField}>
            <Image
              source={require("../assets/icons/padlock.png")}
              style={styles.inputFieldIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              onChangeText={(password) => setPassword(password)}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
              placeholderTextColor={COLORS.darkGray}
            />
          </View>

          <View style={styles.inputField}>
            <Image
              source={require("../assets/icons/padlock.png")}
              style={styles.inputFieldIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              onChangeText={(confirmPassword) =>
                setConfirmPassword(confirmPassword)
              }
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
              placeholderTextColor={COLORS.darkGray}
            />
          </View>

          <View style={styles.rememberMe}>
            <TouchableOpacity style={styles.checkbox}></TouchableOpacity>
            <Text style={styles.rememberMeText}>
              I agree to the terms and conditions
            </Text>
          </View>

          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() =>
              registerUser(
                email,
                password,
                firstName,
                lastName,
                contactNumber,
                confirmPassword
              )
            }
          >
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.alreadyUser}
            onPress={() => navigation.navigate("login")}
          >
            <Text style={styles.alreadyUserText}>Already user? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default TutorSignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  formContent: {
    width: "80%",
    position: "absolute",
  },
  title: {
    color: COLORS.white,
    fontSize: SIZES.LargeTitle,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputField: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    color: COLORS.darkGray,
    padding: 10,
    fontSize: SIZES.medium,
  },
  inputFieldIcon: {
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  alreadyUser: {
    alignSelf: "center",
    marginTop: 20,
  },
  alreadyUserText: {
    color: COLORS.white,
    fontSize: SIZES.small,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 15,
    height: 15,
    borderWidth: 2,
    borderRadius: 2,
    borderColor: COLORS.white,
    marginRight: 10,
  },
  rememberMeText: {
    color: COLORS.white,
    fontSize: SIZES.small,
  },
  signUpButton: {
    backgroundColor: COLORS.green,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  signUpButtonText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontWeight: "bold",
  },
  buttonImage: {
    alignItems: "center",
    justifyContent: "center",
  },
  buttonImageIcon: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
    borderRadius: 50,
  },
});
