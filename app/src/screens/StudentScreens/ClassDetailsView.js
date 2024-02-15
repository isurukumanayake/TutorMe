import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import StudentLayout from "../../layouts/StudentLayout";
import { COLORS } from "../../constants/theme";

const ClassDetailsView = ({ route, navigation }) => {
  const { classDetails } = route.params;

  return (
    <StudentLayout name="Session Details">
      <ScrollView style={styles.container}>
        <View style={styles.tutorInfo}>
          <Image
            source={{ uri: classDetails.profilePicture }}
            style={styles.tutorImage}
          />
          <View style={styles.tutorDetails}>
            <Text style={styles.tutorName}>
              {classDetails.tutorFirstName + " " + classDetails.tutorLastName}
            </Text>
            <Text style={styles.tutorFaculty}>Faculty of Computing</Text>
            <Text style={styles.tutorYear}>3rd year 2nd semester</Text>
          </View>
        </View>
        <View style={styles.ruler} />

        <Text style={styles.className}>{classDetails.classTitle}</Text>
        <Text style={styles.classDescription}>
          {classDetails.classDescription}
        </Text>
        <View style={styles.tagContainer}>
          {classDetails.tags.map((tag, index) => (
            <View style={styles.tag} key={index}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>Rs. {classDetails.price} per session</Text>
        </View>

        <View style={styles.ruler} />

        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>Session Times</Text>
          {classDetails.timeSlots.map((timeslot) => (
            <View style={styles.timeSlot}>
              <Text style={styles.day}>{timeslot.day}</Text>
              <Text style={styles.time}>
                {timeslot.startTime} - {timeslot.endTime}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("requestSession", {
                classDetails: classDetails,
              })
            }
          >
            <Text style={styles.buttonText}>Request Session</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </StudentLayout>
  );
};

export default ClassDetailsView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  tutorInfo: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
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
  className: {
    fontWeight: "600",
    fontSize: 24,
  },
  classDescription: {
    marginVertical: 20,
  },
  tagContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: COLORS.lightGreen,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6,
    marginVertical: 5,
    borderRadius: 10,
    borderColor: COLORS.gray,
    borderWidth: 0.2,
  },
  tagText: {
    color: COLORS.green,
    fontSize: 12,
  },
  ruler: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 20,
    opacity: 0.3,
  },
  priceContainer: {
    backgroundColor: COLORS.priceGray,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    alignSelf: "flex-start",
    borderRadius: 10,
  },
  price: {
    color: COLORS.orange,
    fontSize: 15,
  },
  timeContainer: {
    // marginVertical: 10,`
  },
  timeText: {
    fontWeight: "600",
    fontSize: 16,
  },
  timeSlot: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: COLORS.white,
    padding: 5,
    borderRadius: 10,
    marginVertical: 10,
  },
  day: {
    flex: 0.5,
    textAlign: "center",
    color: COLORS.darkGreen,
  },
  time: {
    flex: 0.5,
    color: COLORS.darkGreen,
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    backgroundColor: COLORS.green,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 18,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "500",
  },
});
