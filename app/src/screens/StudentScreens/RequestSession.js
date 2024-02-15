import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import StudentLayout from "../../layouts/StudentLayout";
import { COLORS } from "../../constants/theme";
import { FontAwesome } from "@expo/vector-icons";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import UserContext from "../../contexts/UserContext";
import {
  AlertNotificationRoot,
  Dialog,
  Toast,
  ALERT_TYPE,
} from "react-native-alert-notification";

const RequestSession = ({ route }) => {
  const { classDetails } = route.params;

  const [date, setDate] = useState();
  const [timeslot, setTimeslot] = useState("Morning");
  const [reason, setReason] = useState("");
  const [numStudents, setNumStudents] = useState(1);
  const [mode, setMode] = useState("Online");
  const [showDatePicker, setShowDatePicker] = useState(false); // State to show the date picker

  const { userData, setUserData } = useContext(UserContext);

  // Define state variables to track field validation
  const [isDateValid, setIsDateValid] = useState(true);
  const [isTimeSlotValid, setIsTimeSlotValid] = useState(true);
  const [isReasonValid, setIsReasonValid] = useState(true);

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setShowDatePicker(Platform.OS === "ios");
    }
  };

  // Define a function to get the day of the week from a date string
  const getDayOfWeek = (dateString) => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const date = new Date(dateString);
    const dayOfWeekIndex = date.getDay();
    return daysOfWeek[dayOfWeekIndex];
  };

  // Define a function to get time slots for the selected day
  const getTimeSlotsForDay = (selectedDate) => {
    const selectedDay = getDayOfWeek(selectedDate);
    const timeSlotsForDay = classDetails.timeSlots.filter((timeSlot) => {
      return timeSlot.day === selectedDay;
    });

    return timeSlotsForDay;
  };

  const handleFormSubmit = async () => {
    // Add field validation logic
    if (!date) {
      setIsDateValid(false);
    } else {
      setIsDateValid(true);
    }
    if (!timeslot) {
      setIsTimeSlotValid(false);
    } else {
      setIsTimeSlotValid(true);
    }
    if (!reason) {
      setIsReasonValid(false);
    } else {
      setIsReasonValid(true);
    }

    // Check if all required fields are valid
    if (!date || !timeslot || !reason) {
      return; // Stop the submission if any required field is empty
    }

    const doc = await addDoc(collection(FIRESTORE_DB, "sessions"), {
      classId: classDetails.id,
      tutorId: classDetails.userId,
      tutorName: classDetails.tutorFirstName + " " + classDetails.tutorLastName,
      tutorImage: classDetails.profilePicture,
      classTitle: classDetails.classTitle,
      classCategory: classDetails.categorySearch,
      classDescription: classDetails.classDescription,
      classTags: classDetails.tags,
      price: classDetails.price,
      date: date.toLocaleDateString(),
      timeslot,
      reason,
      numOfStudents: numStudents,
      mode,
      studentId: FIREBASE_AUTH.currentUser.uid,
      studentName: userData.firstName + " " + userData.lastName,
      status: "pending",
      submittedAt: new Date(),
    });

    Dialog.show({
      type: ALERT_TYPE.SUCCESS,
      title: "Session requested",
      textBody:
        "Your tutor will review your booking request. Please wait for their confirmation.",
      button: "Close",
    });
    setDate();
    setReason("");
  };

  return (
    <AlertNotificationRoot>
      <StudentLayout name="Requesting Session">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.tutorInfo}>
              <Image
                source={{ uri: classDetails.profilePicture }}
                style={styles.tutorImage}
              />
              <View style={styles.tutorDetails}>
                <Text style={styles.tutorName}>
                  {classDetails.tutorFirstName +
                    " " +
                    classDetails.tutorLastName}
                </Text>
                <Text style={styles.tutorFaculty}>Faculty of Computing</Text>
                <Text style={styles.tutorYear}>3rd year 2nd semester</Text>
              </View>
            </View>
            <View style={styles.ruler} />
            <Text style={styles.className}>{classDetails.classTitle}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>
                Price per session: Rs. {classDetails.price}.00
              </Text>
            </View>
            <View style={styles.formContainer}>
              <Text>
                Date{!isDateValid && <Text style={styles.error}>*</Text>}
              </Text>
              <View style={styles.dateInputField}>
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
                      minimumDate={new Date()} // Disable past dates
                      mode="date"
                      onChange={handleDateChange}
                    />
                  )}
                </View>
              </View>
              {date && (
                <>
                  <Text>
                    Timeslot
                    {!isTimeSlotValid && <Text style={styles.error}>*</Text>}
                  </Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={timeslot}
                      onValueChange={(itemValue) => setTimeslot(itemValue)}
                    >
                      {/* Map the time slots for the selected day to Picker.Item components */}
                      {getTimeSlotsForDay(date).map((timeSlot, index) => (
                        <Picker.Item
                          key={index}
                          label={`${timeSlot.startTime} - ${timeSlot.endTime}`}
                          value={`${timeSlot.startTime} - ${timeSlot.endTime}`}
                        />
                      ))}
                    </Picker>
                  </View>
                </>
              )}
              <Text>
                Reason{!isReasonValid && <Text style={styles.error}>*</Text>}
              </Text>
              <TextInput
                value={reason}
                onChangeText={(text) => setReason(text)}
                style={styles.textarea}
                multiline={true}
                numberOfLines={4}
              />
              <View style={styles.formBottom}>
                <View style={styles.countInputContainer}>
                  <Text>Number of students</Text>
                  <View style={styles.countInputField}>
                    <FontAwesome
                      name="minus-circle"
                      size={26}
                      color={COLORS.green}
                      style={styles.countInputFieldIcon}
                      onPress={() => {
                        if (numStudents > 1) {
                          setNumStudents(numStudents - 1);
                        }
                      }}
                    />
                    <TextInput
                      value={numStudents.toString()}
                      onChangeText={(text) => {
                        const parsedNum = parseInt(text, 10);
                        if (!isNaN(parsedNum)) {
                          setNumStudents(Math.max(1, parsedNum));
                        }
                      }}
                      keyboardType="numeric"
                      style={styles.countInput}
                    />
                    <FontAwesome
                      name="plus-circle"
                      size={26}
                      color={COLORS.green}
                      style={styles.countInputFieldIcon}
                      onPress={() => setNumStudents(numStudents + 1)}
                    />
                  </View>
                </View>
                <View style={styles.pickerInputContainer}>
                  <Text>Mode</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={mode}
                      onValueChange={(itemValue) => setMode(itemValue)}
                    >
                      <Picker.Item label="Online" value="Online" />
                      <Picker.Item label="In-person" value="In-person" />
                    </Picker>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleFormSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </StudentLayout>
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  tutorInfo: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
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
    fontSize: 24,
    fontWeight: "500",
  },
  tutorFaculty: {
    fontSize: 16,
    marginVertical: 4,
  },
  tutorYear: {
    fontSize: 14,
  },
  className: {
    fontWeight: "600",
    fontSize: 24,
  },
  priceContainer: {
    marginTop: 20,
    backgroundColor: COLORS.orange,
    borderRadius: 8,
    padding: 10,
  },
  price: {
    textAlign: "center",
    color: COLORS.white,
  },
  formContainer: {
    marginTop: 20,
  },
  input: {
    borderColor: COLORS.darkGray,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  textarea: {
    borderColor: COLORS.gray,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderColor: COLORS.gray,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateInputField: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    padding: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  dateInput: {
    flex: 1,
    color: COLORS.darkGray,
    padding: 10,
  },
  dateInputFieldIcon: {
    width: 25,
    height: 24,
    marginRight: 20,
    color: COLORS.darkGray,
  },
  countInputContainer: {
    flex: 5,
    marginRight: 30,
  },
  pickerInputContainer: {
    flex: 6,
  },
  formBottom: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  countInputField: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
  },
  countInputFieldIcon: {
    // borderRadius: 25,
    // backgroundColor: COLORS.white,
    padding: 6,
  },
  countInput: {
    flex: 1,
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 4,
    marginHorizontal: 6,
    textAlign: "center",
  },
  submitButton: {
    backgroundColor: COLORS.green,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "500",
  },
  ruler: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginTop: 30,
    marginBottom: 20,
    opacity: 0.3,
  },
  error: {
    color: "red",
  },
});

export default RequestSession;
