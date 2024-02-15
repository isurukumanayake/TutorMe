import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useContext, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, SIZES } from "../../constants/theme";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import BottomNav from "../../components/TutorBottomNav";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { doc, getDoc, collection, updateDoc } from "firebase/firestore";
import UserContext from "../../contexts/UserContext";
import { saveUserProfileImage } from "../../services/user";

const IncompleteForm = () => {
  const { fetchUserData } = useContext(UserContext);

  const navigation = useNavigation();
  const [gender, setGender] = useState("");
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [studentId, setStudentId] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [semester, setSemester] = useState("");
  const [faculty, setFaculty] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false); // State to show the date picker
  const [profileImage, setProfileImage] = useState(null);

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

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setShowDatePicker(Platform.OS === "ios");
    }
  };

  const saveUserData = async () => {
    if (
      !gender ||
      !date ||
      !address ||
      !studentId ||
      !academicYear ||
      !semester ||
      !faculty ||
      !specialization
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    try {
      const userDoc = doc(FIRESTORE_DB, "users", FIREBASE_AUTH.currentUser.uid);
      await updateDoc(userDoc, {
        gender,
        dateOfBirth: date,
        address,
        studentId,
        academicYear,
        semester,
        faculty,
        specialization,
        isCompleted: "true",
      });

      saveUserProfileImage(profileImage);
      fetchUserData();

      alert("User data saved successfully!");
      // Navigate to a different screen or perform any other actions here
      setGender("");
      setDate("");
      setAddress("");
      setStudentId("");
      setAcademicYear("");
      setSemester("");
      setFaculty("");
      setSpecialization("");

      navigation.goBack();
    } catch (error) {
      alert(error.message);
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
            <Text style={styles.title}> Complete Profile</Text>

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

            {/* <TextInput
                style={styles.input}
                placeholder="Gender"
                onChangeText={(gender) => setGender(gender)}
                autoCorrect={false}
                placeholderTextColor={COLORS.darkGray}
              /> */}
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
                onChangeText={(address) => setAddress(address)}
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
                onChangeText={(studentId) => setStudentId(studentId)}
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
                keyboardType="numeric"
                onChangeText={(academicYear) => setAcademicYear(academicYear)}
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
                  <Picker.Item label="1 st Year" value="1 st Year" />
                  <Picker.Item label="2 nd Year" value="2 nd Year" />
                  <Picker.Item label="3 rd Year" value="3 rd Year" />
                  <Picker.Item label="4 th Year" value="4 th Year" />
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
                keyboardType="numeric"
                onChangeText={(semester) => setSemester(semester)}
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
                  <Picker.Item label="1 st Semester" value="1 st Semester" />
                  <Picker.Item label="2 nd Semester" value="2 nd Semester" />
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
                onChangeText={(faculty) => setFaculty(faculty)}
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
                onChangeText={(specialization) =>
                  setSpecialization(specialization)
                }
                autoCorrect={false}
                placeholderTextColor={COLORS.darkGray}
              />
            </View>

            <Text style={styles.rememberMeText}>
              ------------------------------------------------------------------------------------------------
            </Text>
            <Text></Text>
            <TouchableOpacity style={styles.loginButton} onPress={saveUserData}>
              <Text style={styles.loginButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </LinearGradient>
  );
};

export default IncompleteForm;

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
    marginLeft: 15,
    marginTop: 15,
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
