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
import { StudentFragment } from "../../layouts/StudentFragment";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import UserContext from "../../contexts/UserContext";

const StudentProfile = ({ navigation }) => {
  const { userData, setUserData } = useContext(UserContext);

  return (
    <StudentFragment activeLink="profile">
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.rowContainer}>
            <Image
              source={
                userData.photoURL === null
                  ? require("../../assets/images/profile.png")
                  : { uri: userData.photoURL }
              }
              style={styles.imageContainer}
            />

            <View style={styles.profileContainer}>
              <Text style={styles.name}>
                {userData.firstName} {userData.lastName}
              </Text>
              <Text style={styles.course}>{userData.email}</Text>
            </View>
          </View>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={
                styles.button
              } /*onPress={() => navigation.navigate("EditProfile")}*/
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
              onPress={() => changePassword()}
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
              onPress={() => navigation.navigate("mySessions")}
            >
              <View style={styles.box}>
                <Image
                  source={require("../../assets/icons/class.png")}
                  style={styles.buttonImage}
                />
              </View>
              <Text style={styles.buttonText}>My Sessions</Text>
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
    </StudentFragment>
  );
};

export default StudentProfile;

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
    borderRadius: 45,
  },
  profileContainer: {
    flex: 1,
    marginLeft: 30,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  course: {
    fontSize: 15,
  },
  semester: {
    fontSize: 10,
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
});
