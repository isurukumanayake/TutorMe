import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";

import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

import { COLORS } from "../../constants/theme";
import { Picker } from "@react-native-picker/picker";
import Tags from "../../components/Tags";
import TimeSlots from "../../components/TimeSlots";
import SessionSlot from "../../components/SessionSlot";
import { FontAwesome5 } from "@expo/vector-icons";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import {
  updateDoc,
  doc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import UserContext from "../../contexts/UserContext";
import images from "../../constants/images";

import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

export default function EditClassDetails({ navigation, route }) {
  const { userData, setUserData } = useContext(UserContext);
  const tutorFirstName = userData.firstName;
  const tutorLastName = userData.lastName;
  const photoURL = userData.photoURL;
  const profilePicture = photoURL
    ? photoURL
    : "https://firebasestorage.googleapis.com/v0/b/tutorme-ef18e.appspot.com/o/profileImage%2F5lNgerv61XQNZxgMBn8Xoo45wRu2?alt=media&token=7a2adaac-9d43-47f2-a52b-3026663f8e47";
  const userId = FIREBASE_AUTH.currentUser.uid;

  const { item } = route.params; // Extract 'item' from route.params
  const id = item.id;
  console.log("item", item);
  const currentDate = new Date();

  const categories = [
    "Computing",
    "Engineering",
    "Business",
    "Humanities",
    "science",
    "Education",
    "Quantity surveying",
    "English",
    "Maths",
    "Nursing",
  ];
  const [categorySearch, setCategorySearch] = useState(item.category);
  const [filteredCategories, setFilteredCategories] = useState(categories);

  const [tag, setTag] = useState("");
  const [tags, setTags] = useState([]);

  const [timeSlots, setTimeSlots] = useState([]);

  const [classTitle, setClassTitle] = useState("");
  const [classDescription, setClassDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [addedAt, setAddedAt] = useState("");

  useEffect(() => {
    setTags(item.tags);
    setTimeSlots(item.timeSlots);
    setClassTitle(item.classTitle);
    setClassDescription(item.classDescription);
    setCategorySearch(item.categorySearch);
    setPrice(item.price);
    setDuration(item.duration);
    setAddedAt(item.addedAt);
  }, [item]);

  const handleFormSubmit = async () => {
    if (classTitle === "") {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error in submitting form",
        textBody: "Class Title is required",
      });
      return;
    } else if (classDescription === "") {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error in submitting form",
        textBody: "Class Description is required",
      });
    } else if (categorySearch === "") {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error in submitting form",
        textBody: "Category is required",
      });
    } else if (tags.length === 0) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error in submitting form",
        textBody: "Tags are required",
      });
    } else if (price === "") {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error in submitting form",
        textBody: "Price is required",
      });
    } else if (duration === "") {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error in submitting form",
        textBody: "Duration is required",
      });
    } else if (timeSlots.length === 0) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error in submitting form",
        textBody: "At least one time slot is required",
      });
    } else {
      try {
        // Create an object with the updated class data
        const updatedClassData = {
          userId,
          tutorFirstName,
          tutorLastName,
          profilePicture,
          classTitle,
          classDescription,
          categorySearch,
          tags,
          price,
          duration,
          timeSlots,
          addedAt,
          updatedAt: currentDate, // Include a timestamp for when it was updated
        };

        // Update the class document in Firestore using updateDoc
        const classRef = doc(FIRESTORE_DB, "classes", id); // Adjust the path to your Firestore collection
        await updateDoc(classRef, updatedClassData);

        setClassDescription("");
        setClassTitle("");
        setCategorySearch("");
        setTags([]);
        setPrice("");
        setDuration("");
        setTimeSlots([]);
        setAddedAt("");
        // setUpdatedAt("");

        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Class Details edited successfully !",
        });

        navigation.navigate("myClasses");
        // Navigate back to the previous screen
      } catch (error) {
        // Handle errors, e.g., show an error message
        Alert.alert("Error updating class", error.message);
      }
    }
  };

  const handleRemoveTimeSlot = (index) => {
    const updatedTimeSlots = [...timeSlots];
    updatedTimeSlots.splice(index, 1);
    setTimeSlots(updatedTimeSlots);
  };
  return (
    <AlertNotificationRoot>
      <>
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("myClasses")}>
              <Image source={images.backButton} style={styles.backButton} />
            </TouchableOpacity>
            <Text style={styles.headerText}>Edit Class Details</Text>
          </View>
          <ScrollView style={styles.scrollerContainer}>
            <View style={styles.formContainer}>
              <Text>Class Title</Text>
              <TextInput
                value={classTitle}
                onChangeText={(text) => setClassTitle(text)}
                style={styles.textarea}
                multiline={true}
              />
              <Text>Class Description</Text>
              <TextInput
                value={classDescription}
                onChangeText={(text) => setClassDescription(text)}
                style={styles.textarea}
                multiline={true}
                numberOfLines={5}
              />
              <Text>Main Category</Text>

              {filteredCategories.length > 0 && (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={categorySearch}
                    onValueChange={(itemValue) => setCategorySearch(itemValue)}
                  >
                    {filteredCategories.map((category, index) => (
                      <Picker.Item
                        key={index}
                        label={category}
                        value={category}
                      />
                    ))}
                  </Picker>
                </View>
              )}
              <Text>Tags</Text>
              <View style={styles.textareaWithPlus}>
                <TextInput
                  value={tag}
                  onChangeText={(text) => setTag(text)}
                  style={{ width: "80%", height: 30 }}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (tag.trim() !== "") {
                      // Check if tag is not an empty string after trimming
                      setTags([...tags, tag]);
                      setTag("");
                    } else {
                      Toast.show({
                        type: ALERT_TYPE.WARNING,
                        title: "Warning",
                        textBody:
                          "Please enter a tag before adding it to the list",
                      });
                    }
                  }}
                >
                  <Entypo name="circle-with-plus" size={24} color="green" />
                </TouchableOpacity>
              </View>
              {tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {tags.map((tag, index) => (
                    <Tags key={index} tagText={tag} />
                  ))}
                </View>
              )}
              <View style={styles.rowContainer}>
                <Text>Price </Text>
                <Text style={styles.smallFonts}> ( Rs: per session )</Text>
              </View>
              <TextInput
                value={price}
                onChangeText={(text) => setPrice(text)}
                style={styles.textarea}
                keyboardType="numeric"
              />
              {/* duraition */}
              <View style={styles.rowContainer}>
                <Text>Duration </Text>
                <Text style={styles.smallFonts}> ( hr)</Text>
              </View>
              <TextInput
                value={duration}
                onChangeText={(text) => setDuration(text)}
                style={styles.textarea}
                multiline={true}
                keyboardType="numeric"
              />
              {/* timeSlot */}
              {/* day  */}
              {/* startTime  */}
              {/* endTime  */}
              <Text>Time Slots </Text>
              <TimeSlots timeSlots={timeSlots} setTimeSlots={setTimeSlots} />

              {timeSlots.length > 0 ? (
                <View style={{ marginBottom: 8 }}>
                  <Text>Time Slots:</Text>
                  {timeSlots.map((slot, index) => (
                    <View style={styles.sessionBar} key={index}>
                      <View style={styles.sessionDetails}>
                        <Text style={styles.sessionInfo}>{slot.day}</Text>
                        <Text style={styles.sessionInfo}>
                          {slot.startTime} - {slot.endTime}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleRemoveTimeSlot(index)}
                        >
                          <FontAwesome5 name="trash" size={18} color="red" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={{ marginBottom: 8 }}>
                  <Text>No Time Slots Added</Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleFormSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </>
    </AlertNotificationRoot>
  );
}
const styles = StyleSheet.create({
  headerContainer: {
    padding: 18,
    backgroundColor: COLORS.green,
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
  },
  backButton: {
    width: 24,
    height: 24,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGreen,
  },
  scrollerContainer: {
    flex: 1,
    padding: 16,
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
  textareaWithPlus: {
    borderColor: COLORS.gray,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    textAlignVertical: "top",
    alignContent: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerContainer: {
    borderColor: COLORS.gray,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
  },

  submitButton: {
    backgroundColor: COLORS.green,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: 40,
  },
  searchCategoryInput: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "500",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    // padding: 8,
  },
  smallFonts: {
    fontSize: 12,
    color: COLORS.lightGray,
  },
  rowContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
  },
  sessionBar: {
    backgroundColor: COLORS.white,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  sessionDetails: {
    color: COLORS.darkGreen,
    fontWeight: "bold",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 16,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  sessionInfo: {
    color: COLORS.darkGreen,
    // fontWeight: "bold",
    fontSize: 16,
  },
});
