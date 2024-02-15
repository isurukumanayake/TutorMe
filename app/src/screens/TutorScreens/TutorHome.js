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
import { TutorFragment } from "../../layouts/TutorFragment";

const TutorHome = () => {
  const navigation = useNavigation();

  return (
    <TutorFragment activeLink="home">
      <View style={styles.containerMain}>
        <View style={styles.formContent}>
          <SafeAreaView style={styles.containerTop}>
            <View style={styles.bottomButtonContainerTop}>
              <Text style={styles.buttonTextTop}>LEARN</Text>
              <Text style={styles.buttonTextTop2}>Programming</Text>
            </View>
            <Image
              source={require("../../assets/images/profile.png")}
              style={styles.imageContainer}
            />
          </SafeAreaView>

          <SafeAreaView style={styles.bottomButtonContainerTop1}>
            <Text style={styles.buttonNameHead}>TOP TUTOR</Text>

            <Text style={styles.buttonName}>Suresh Sankalpa</Text>
            <Text style={styles.buttonFaculty}>Faculty of Computing</Text>
            <Text style={styles.buttonYear}>3 Year 2 Semester</Text>

            <SafeAreaView style={styles.container}>
              <View style={styles.bottomButtonContainer}>
                <View style={styles.bottomButtonContainerRate}>
                  <Text style={styles.buttonText1}>* 4.5</Text>
                  <Text style={styles.buttonText2}>Tutor Rating </Text>
                </View>

                <View style={styles.bottomButtonContainerRate}>
                  <Text style={styles.buttonText1}>5</Text>
                  <Text style={styles.buttonText2}>No of Classes </Text>
                </View>

                <View style={styles.bottomButtonContainerRate}>
                  <Text style={styles.buttonText1}>15</Text>
                  <Text style={styles.buttonText2}>Completed Sessions</Text>
                </View>
              </View>
            </SafeAreaView>

            <Text style={styles.buttonText3}>
              I will teach basic programming concept and languages.
            </Text>

            <SafeAreaView style={styles.container2}>
              <SafeAreaView style={styles.container1}>
                <View style={styles.bottomButtonContainer1}>
                  <Text style={styles.buttonText4}>OOP</Text>
                </View>
              </SafeAreaView>

              <SafeAreaView style={styles.container1}>
                <View style={styles.bottomButtonContainer1}>
                  <Text style={styles.buttonText4}>Java</Text>
                </View>
              </SafeAreaView>

              <SafeAreaView style={styles.container1}>
                <View style={styles.bottomButtonContainer1}>
                  <Text style={styles.buttonText4}>MERN</Text>
                </View>
              </SafeAreaView>

              <SafeAreaView style={styles.container1}>
                <View style={styles.bottomButtonContainer1}>
                  <Text style={styles.buttonText4}>MAD</Text>
                </View>
              </SafeAreaView>

              <SafeAreaView style={styles.container1}>
                <View style={styles.bottomButtonContainer1}>
                  <Text style={styles.buttonText4}>Kotlin</Text>
                </View>
              </SafeAreaView>
            </SafeAreaView>

            <Text style={styles.buttonText3}>My Classes</Text>

            <SafeAreaView style={styles.containerClass}>
              <View style={styles.bottomButtonContainerClass}>
                <Text style={styles.buttonTextClassName}>
                  Object Oriented Programming
                </Text>
                <Text style={styles.buttonTextSubject}>
                  Object-Oriented programming Basic C++
                </Text>
                <SafeAreaView style={styles.containerBottom}>
                  <Text style={styles.buttonTextTime}>2 Hours</Text>
                  <Text style={styles.buttonTextPrice}>Rs: 1000</Text>
                </SafeAreaView>
              </View>

              <View style={styles.bottomButtonContainerClass}>
                <Text style={styles.buttonTextClassName}>
                  Object Oriented Programming
                </Text>
                <Text style={styles.buttonTextSubject}>
                  Object-Oriented programming Basic C++
                </Text>
                <SafeAreaView style={styles.containerBottom}>
                  <Text style={styles.buttonTextTime}>2 Hours</Text>
                  <Text style={styles.buttonTextPrice}>Rs: 1000</Text>
                </SafeAreaView>
              </View>
            </SafeAreaView>
          </SafeAreaView>
        </View>
      </View>
    </TutorFragment>
  );
};

export default TutorHome;

const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 600,
  },
  container: {
    flex: 1,
    backgroundColor: "#FA5804",
    borderRadius: 10,
    alignItems: "center",
    width: 360,
    height: 90,
    //marginBottom: 200,
  },
  formContent: {
    width: "90%",
    position: "absolute",
    bottom: "10%",
  },
  bottomButtonContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    flexDirection: "row",
    paddingRight: 11,
  },
  buttonText1: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    //textAlign: 'left',
    paddingBottom: 8,
  },
  buttonText2: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonText3: {
    color: "black",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 15,
    marginBottom: 15,
  },
  container1: {
    flex: 1,
    //backgroundColor: "#C0EED6",
    borderRadius: 10,
    alignItems: "center",
    //marginBottom: 200,
  },
  bottomButtonContainer1: {
    alignItems: "center",
    marginTop: 4,
    marginBottom: 4,
    padding: 8,
    backgroundColor: "#C0EED6",
    borderRadius: 12,
    marginLeft: 1,
    marginRight: 1,
  },
  buttonText4: {
    color: "#14A056",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  container2: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 1,
    marginRight: 1,
  },
  bottomButtonContainerClass: {
    alignItems: "left",
    marginTop: 4,
    marginBottom: 4,
    padding: 8,
    backgroundColor: "white",
    borderRadius: 12,
    //marginLeft:6,
    marginRight: 20,
    width: 170,
    height: 140,
    marginTop: 10,
    marginBottom: 1,
  },
  buttonTextClassName: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 8,
  },
  buttonTextSubject: {
    color: "black",
    fontSize: 12,
    textAlign: "left",
    marginBottom: 20,
  },
  buttonTextTime: {
    color: "black",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "left",
  },
  buttonTextPrice: {
    color: "#FA5804",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    marginLeft: 22,
    height: 20,
    width: 80,
  },
  containerBottom: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 1,
    marginRight: 1,
  },
  containerClass: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 1,
    marginRight: 1,
    marginBottom: 1,
  },
  buttonName: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  buttonFaculty: {
    color: "black",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  buttonYear: {
    color: "black",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  buttonNameHead: {
    color: "#14A056",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 30,
  },
  imageContainer: {
    width: 90,
    height: 90,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 20,
    marginBottom: 100,
  },
  containerTop: {
    flex: 1,
    backgroundColor: "#14A056",
    borderRadius: 10,
    alignItems: "center",
    width: 360,
    height: 140,
    //marginBottom: 200,
  },
  bottomButtonContainerTop: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextTop: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "left",
    marginRight: 10,
  },
  buttonTextTop2: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "left",
  },
  bottomButtonContainerTop1: {
    marginTop: 30,
  },
  bottomButtonContainerRate: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    paddingLeft: 5,
  },
});
