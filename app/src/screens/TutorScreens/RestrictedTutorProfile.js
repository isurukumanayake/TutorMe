import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { TutorFragment } from "../../layouts/TutorFragment";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import UserContext from "../../contexts/UserContext";
import { COLORS } from "../../constants/theme";
import { RestrictedTutorFragment } from "../../layouts/RestrictedTutorFragment";

const RestrictedTutorProfile = ({ navigation }) => {
  const { userData, setUserData } = useContext(UserContext);

  return (
    <RestrictedTutorFragment activeLink="profile">
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.tutorInfo}>
            <Image
              source={
                userData.photoURL === null
                  ? require("../../assets/images/profile.png")
                  : { uri: userData.photoURL }
              }
              style={styles.tutorImage}
            />
            <View style={styles.tutorDetails}>
              <Text style={styles.tutorName}>
                {userData.firstName} {userData.lastName}
              </Text>
              <Text style={styles.tutorFaculty}>{userData.faculty}</Text>
              <Text style={styles.tutorYear}>
                {userData.academicYear} {userData.semester}
              </Text>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("editProfile")}
            >
              <View style={styles.box}>
                <Image
                  source={require("../../assets/icons/user-avatar.png")}
                  style={styles.buttonImage}
                />
              </View>
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              // onPress={() => changePassword()}
            >
              <View style={styles.box}>
                <Image
                  source={require("../../assets/icons/padlock.png")}
                  style={styles.buttonImage}
                />
              </View>
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              // onPress={() => navigation.navigate("myClasses")}
            >
              <View style={styles.box}>
                <Image
                  source={require("../../assets/icons/class.png")}
                  style={styles.buttonImage}
                />
              </View>
              <Text style={styles.buttonText}>My Classes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              // onPress={() => navigation.navigate("calendar")}
            >
              <View style={styles.box}>
                <Image
                  source={require("../../assets/icons/calendarSeleceted.png")}
                  style={styles.buttonImage}
                />
              </View>
              <Text style={styles.buttonText}>My Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              // onPress={() => navigation.navigate("smList")}
            >
              <View style={styles.box}>
                <Image
                  source={require("../../assets/icons/open-book-selected.png")}
                  style={styles.buttonImage}
                />
              </View>
              <Text style={styles.buttonText}>Study Materials</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={
                styles.button
              } /*onPress={() => navigation.navigate("Login")}*/
            >
              <View style={styles.box}>
                <Image
                  source={require("../../assets/icons/wallet-filled-money-tool.png")}
                  style={styles.buttonImage}
                />
              </View>
              <Text style={styles.buttonText}>My Wallet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => FIREBASE_AUTH.signOut()}
            >
              <View style={styles.box}>
                <Image
                  source={require("../../assets/icons/logout.png")}
                  style={styles.buttonImage}
                />
              </View>
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </RestrictedTutorFragment>
  );
};

export default RestrictedTutorProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 80,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginLeft: 5,
    marginRight: 10,
  },
  imageContainer: {
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  buttonsContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    marginRight: 40,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginLeft: 10,
  },
  buttonImage: {
    width: 50,
    height: 50,
    backgroundColor: "#50CC8B",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    marginLeft: 20,
  },
  box: {
    backgroundColor: "#50CC8B",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  tutorInfo: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    padding: 30,
    marginTop: 20,
  },
  tutorImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  tutorDetails: {
    alignItems: "flex-end",
  },
  tutorName: {
    textAlign: "right",
    fontSize: 23,
    fontWeight: "400",
    color: COLORS.darkGray,
  },
  tutorFaculty: {
    fontSize: 16,
    marginVertical: 4,
    color: COLORS.darkGray,
  },
  tutorYear: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
});
