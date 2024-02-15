import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SIZES } from "../../constants/theme";
import loginAndSignUpStyle from "../../global/loginAndSignUpStyle";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import BottomNav from "../../components/TutorBottomNav";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { doc, getDoc, collection, updateDoc } from "firebase/firestore";
import { saveUserProfileImage } from "../../services/user";
import UserContext from "../../contexts/UserContext";
import { Picker } from "@react-native-picker/picker";

const EditProfile = () => {
  const { fetchUserData } = useContext(UserContext);

  const navigation = useNavigation();
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [studentId, setStudentId] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [faculty, setFaculty] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // Fetch and populate the user data when the component loads
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = doc(
          FIRESTORE_DB,
          "users",
          FIREBASE_AUTH.currentUser.uid
        );

        const docSnapshot = await getDoc(userRef);

        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setUser(userData);

          console.log(user);

          // Set state variables with user data if it exists
          setProfileImage(userData.photoURL || null);
          setFirstName(userData.firstName || "");
          setLastName(userData.lastName || "");
          setEmail(userData.email || "");
          setContactNumber(userData.contactNumber || "");
          setGender(userData.gender || "");
          // setDate(userData.dateOfBirth || "");
          // Handle the date field
          if (userData.dateOfBirth) {
            // Check if userData.dateOfBirth is a valid date string (ISO format)
            const userDate = new Date(userData.dateOfBirth);
            if (!isNaN(userDate.getTime())) {
              // Set date to the user's date of birth
              setDate(userDate);
            }
          }

          setAddress(userData.address || "");
          setStudentId(userData.studentId || "");
          setAcademicYear(userData.academicYear || "");
          setSemester(userData.semester || "");
          setFaculty(userData.faculty);
          setSpecialization(userData.specialization || "");
        } else {
          console.log("Document does not exist.");
        }
      } catch (error) {
        console.error("Error getting document:", error);
      }
    };

    fetchUser();
  }, []);

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

  //Function to handle date changes
  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setShowDatePicker(Platform.OS === "ios");
      setDate(selectedDate);
    }
  };

  // Function to update the user's profile
  const updateProfile = async () => {
    try {
      const userDoc = doc(FIRESTORE_DB, "users", FIREBASE_AUTH.currentUser.uid);
      await updateDoc(userDoc, {
        firstName,
        lastName,
        email,
        contactNumber,
        gender,
        dateOfBirth: date ? date.toString() : null,
        address,
        studentId,
        academicYear,
        semester,
        faculty,
        specialization,
      });

      saveUserProfileImage(profileImage);
      fetchUserData();

      alert("Profile updated successfully!");
      // navigation.goBack();
    } catch (error) {
      alert("Error updating profile: " + error);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.green, COLORS.darkGreen]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.9 }}
      style={styles.gradientBackground}
    >
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles.formContent}>
            <Text style={styles.title}> Edit Profile</Text>

            <View style={styles.buttonImage}>
              <TouchableOpacity onPress={() => pickImage()}>
                <Image
                  source={
                    profileImage === null
                      ? require("../../assets/images/profile.png")
                      : { uri: profileImage }
                  }
                  style={styles.buttonImageIcon}
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.rememberMeText}>Personal Information</Text>
            <Text style={styles.rememberMeText}>
              ------------------------------------------------------------------------------------------------
            </Text>

            <View style={styles.inputField}>
              <Image
                source={require("../../assets/icons/user.png")}
                style={styles.inputFieldIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={firstName}
                onChangeText={(text) => setFirstName(text)}
                autoCorrect={false}
                placeholderTextColor={COLORS.darkGray}
              />
            </View>

            <View style={styles.inputField}>
              <Image
                source={require("../../assets/icons/user.png")}
                style={styles.inputFieldIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={lastName}
                onChangeText={(text) => setLastName(text)}
                autoCorrect={false}
                placeholderTextColor={COLORS.darkGray}
              />
            </View>

            <View style={styles.inputField}>
              <Image
                source={require("../../assets/icons/mail.png")}
                style={styles.inputFieldIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholderTextColor={COLORS.darkGray}
              />
            </View>

            <View style={styles.inputField}>
              <Image
                source={require("../../assets/icons/phone.png")}
                style={styles.inputFieldIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Contact Number"
                value={contactNumber}
                onChangeText={(text) => setContactNumber(text)}
                keyboardType="numeric"
                placeholderTextColor={COLORS.darkGray}
              />
            </View>

            {/* <View style={styles.inputField}>
              <Image
                source={require("../../assets/icons/neutral.png")}
                style={styles.inputFieldIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Gender"
                value={gender}
                onChangeText={(text) => setGender(text)}
                autoCorrect={false}
                placeholderTextColor={COLORS.darkGray}
              />
            </View> */}
            <View style={styles.pickerInputContainer}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={gender}
                  onValueChange={(itemValue) => setGender(itemValue)}
                >
                  <Picker.Item label="Male" value="Male" />
                  <Picker.Item label="Female" value="Female" />
                  <Picker.Item label="Other" value="Other" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputField}>
              <Image
                source={require("../../assets/icons/cake.png")}
                style={styles.inputFieldIcon}
              />
              <TextInput
                style={styles.dateInput}
                placeholder="Select a date"
                placeholderTextColor={COLORS.darkGray}
                value={date ? date.toLocaleDateString() : ""}
                editable={false}
              />
              <View>
                <FontAwesome
                  name="calendar"
                  size={24}
                  color="black"
                  style={styles.dateInputFieldIcon}
                  onPress={() => setShowDatePicker(true)}
                />
                {showDatePicker && (
                  <DateTimePicker
                    value={date || new Date()}
                    maximumDate={new Date()}
                    mode="date"
                    onChange={handleDateChange}
                  />
                )}
              </View>
            </View>

            <View style={styles.inputField}>
              <Image
                source={require("../../assets/icons/maps-and-flags.png")}
                style={styles.inputFieldIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                onChangeText={(text) => setAddress(text)}
                autoCorrect={false}
                placeholderTextColor={COLORS.darkGray}
              />
            </View>

            <Text style={styles.rememberMeText}>Academic Information</Text>
            <Text style={styles.rememberMeText}>
              ------------------------------------------------------------------------------------------------
            </Text>

            <View style={styles.inputField}>
              <Image
                source={require("../../assets/icons/user.png")}
                style={styles.inputFieldIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Student ID"
                value={studentId}
                onChangeText={(text) => setStudentId(text)}
                autoCorrect={false}
                placeholderTextColor={COLORS.darkGray}
              />
            </View>

            {/* <View style={styles.inputField}>
              <Image
                source={require("../../assets/icons/calendar.png")}
                style={styles.inputFieldIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Academic Year"
                value={academicYear}
                onChangeText={(text) => setAcademicYear(text)}
                autoCorrect={false}
                placeholderTextColor={COLORS.darkGray}
              />
            </View> */}
            <View style={styles.pickerInputContainer}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={academicYear}
                  onValueChange={(itemValue) => setAcademicYear(itemValue)}
                >
                  <Picker.Item label="1st Year" value="1st Year" />
                  <Picker.Item label="2nd Year" value="2nd Year" />
                  <Picker.Item label="3rd Year" value="3rd Year" />
                  <Picker.Item label="4th Year" value="4th Year" />
                </Picker>
              </View>
            </View>

            {/* <View style={styles.inputField}>
              <Image
                source={require("../../assets/icons/calendar.png")}
                style={styles.inputFieldIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Semester"
                value={semester}
                onChangeText={(text) => setSemester(text)}
                autoCorrect={false}
                placeholderTextColor={COLORS.darkGray}
              />
            </View> */}
            <View style={styles.pickerInputContainer}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={semester}
                  onValueChange={(itemValue) => setSemester(itemValue)}
                >
                  <Picker.Item label="1st Semester" value="1st Semester" />
                  <Picker.Item label="2nd Semester" value="2nd Semester" />
                </Picker>
              </View>
            </View>

            {/* <View style={styles.inputField}>
              <Image
                source={require("../../assets/icons/mortarboard.png")}
                style={styles.inputFieldIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Faculty"
                value={faculty}
                onChangeText={(text) => setFaculty(text)}
                autoCorrect={false}
                placeholderTextColor={COLORS.darkGray}
              />
            </View> */}
            <View style={styles.pickerInputContainer}>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={faculty}
                  onValueChange={(itemValue) => setFaculty(itemValue)}
                >
                  <Picker.Item
                    label="Faculty of Computing"
                    value="Faculty of Computing"
                  />
                  <Picker.Item
                    label="Faculty of Engineering"
                    value="Faculty of Engineering"
                  />
                  <Picker.Item
                    label="Faculty of Business"
                    value="Faculty of Business"
                  />
                  <Picker.Item
                    label="Faculty of Humanities & Sciences"
                    value="Faculty of Humanities & Sciences"
                  />
                  <Picker.Item label="Faculty of Law" value="Faculty of Law" />
                  <Picker.Item
                    label="Faculty of Architecture"
                    value="Faculty of Architecture"
                  />
                </Picker>
              </View>
            </View>

            <View style={styles.inputField}>
              <Image
                source={require("../../assets/icons/mortarboard.png")}
                style={styles.inputFieldIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Specialization"
                value={specialization}
                onChangeText={(text) => setSpecialization(text)}
                autoCorrect={false}
                placeholderTextColor={COLORS.darkGray}
              />
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={updateProfile}
            >
              <Text style={styles.loginButtonText}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  gradientBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bgImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  formContent: {
    width: "100%",
    //position: "absolute",
    //bottom: "10%",
    top: "2%",
  },
  title: {
    color: COLORS.white,
    fontSize: SIZES.LargeTitle,
    fontWeight: "bold",
    marginBottom: 20,
    marginLeft: 60,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
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
  loginButton: {
    backgroundColor: COLORS.green,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 40,
  },
  loginButtonText: {
    color: COLORS.white,
    fontSize: SIZES.large,
    fontWeight: "bold",
  },

  newUser: {
    alignSelf: "center",
    marginTop: 20,
  },
  dateInputFieldIcon: {
    width: 25,
    height: 24,
    marginRight: 20,
    color: COLORS.darkGray,
  },
  dateInput: {
    flex: 1,
    color: COLORS.darkGray,
    padding: 10,
  },
  pickerInputContainer: {
    flex: 6,
  },
  pickerContainer: {
    //borderColor: COLORS.gray,
    backgroundColor: COLORS.white,
    //borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
});
