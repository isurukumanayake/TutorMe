import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

import { COLORS } from "../../constants/theme";
import images from "../../constants/images";
import BottomNav from "../../components/TutorBottomNav";

import DeclineReasonModal from "../../components/DeclineReasonModal ";

import { doc, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../FirebaseConfig";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

export default SingleNewRequest = ({ route, navigation }) => {
  const activeLink = "NewRequest";

  const { item } = route.params;
  const [data, setData] = useState(item);
  // console.log("id", item.id);
  const id = item.id;

  useEffect(() => {
    setData(item);
  }, [item]);
  console.log("data", data);

  const [isModalVisible, setModalVisible] = useState(false);
  const [declineReason, setDeclineReason] = useState(""); // Store the decline reason

  const handleDecline = (reason) => {
    // Handle the decline action, you can send the decline reason to the server, update state, etc.
    setDeclineReason(reason);
    console.log("Decline reason: ", reason);
    if (reason) {
      declineSession(id, reason);
      setModalVisible(false);
    } else {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error in declining request",
        textBody: "Please enter a reason for declining the request.",
      });
      console.log("Please enter a reason for declining the request.");
    }

    // Close the modal
  };

  // Function to accept a session
  const acceptSession = async (sessionId) => {
    const sessionRef = doc(FIRESTORE_DB, "sessions", sessionId);

    try {
      await updateDoc(sessionRef, {
        status: "accepted",
        acceptedAt: new Date(), // Add the accepted timestamp or other additional fields
      });
      console.log("Session accepted!");
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "Request accepted!",
      });

      navigation.navigate("myClasses");
    } catch (error) {
      console.error("Error accepting session: ", error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error in accepting request",
        textBody:
          "An error occurred while accepting the request. Please try again later.",
      });
    }
  };

  // Function to decline a session
  const declineSession = async (sessionId, reason) => {
    const sessionRef = doc(FIRESTORE_DB, "sessions", sessionId);

    try {
      await updateDoc(sessionRef, {
        status: "declined",
        declineReason: reason, // Add the decline reason or other additional fields
      });
      console.log("Request declined!");
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "Request declined!",
      });
      navigation.navigate("myClasses");
    } catch (error) {
      console.error("Error declining request: ", error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error in declining request",
        textBody:
          "An error occurred while declining the request. Please try again later.",
      });
    }
  };

  return (
    <AlertNotificationRoot>
      <>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.navigate("myClasses")}>
            <Image source={images.backButton} style={styles.backButton} />
          </TouchableOpacity>
          <Text style={styles.headerText}>New Request</Text>
        </View>
        <View style={styles.container}>
          <View style={styles.newRequestContainer}>
            <Text style={styles.classTitle}>{data.classTitle}</Text>
          </View>
          <View style={styles.requestBody}>
            <View style={styles.detailInRow}>
              <Text style={styles.label}>Student Name :- </Text>
              <Text style={styles.content}>{data.studentName}</Text>
            </View>
            <View style={styles.detailInRow}>
              <Text style={styles.label}>Session Date :- </Text>
              <Text style={styles.content}>{data.date}</Text>
            </View>
            <View style={styles.detailInRow}>
              <Text style={styles.label}>Session Time :- </Text>
              <Text style={styles.content}>{data.timeslot} </Text>
            </View>
            <View style={styles.detailInColumn}>
              <Text style={styles.label}>Reason </Text>
              <Text style={styles.content}>{data.reason}</Text>
            </View>
            <View style={styles.detailInRow}>
              <Text style={styles.label}>Mode :- </Text>
              <Text style={styles.content}>{data.mode}</Text>
            </View>
            <View style={styles.detailInRow}>
              <Text style={styles.label}>Number of Students :- </Text>
              <Text style={styles.content}>{data.numOfStudents}</Text>
            </View>
          </View>
          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.btnText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editBtn}
              // onPress={() =>
              //   navigation.navigate("editClassDetails", { item: item })
              // }
              onPress={() => {
                acceptSession(id);
                // You can add additional logic here as needed
              }}
            >
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
        <DeclineReasonModal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onDecline={handleDecline}
        />
        <BottomNav activeLink={activeLink} />
      </>
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGreen,
    padding: 16,
  },
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
  newRequestContainer: {
    padding: 8,
  },
  requestBody: {
    padding: 16,
  },

  label: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  classTitle: {
    fontWeight: "bold",
    fontSize: 24,
  },
  detailInRow: {
    marginBottom: 8,
    justifyContent: "flex-start",
    alignContent: "center",
    flexDirection: "row",
  },
  content: {
    fontSize: 16,
    padding: 2,
  },
  detailInColumn: {
    marginBottom: 8,
    justifyContent: "flex-start",
    alignContent: "center",
    flexDirection: "column",
  },
  detailInRowSpaceBetween: {
    marginBottom: 8,
    padding: 16,
    justifyContent: "space-between",
    alignContent: "center",
    flexDirection: "row",
  },
  declineBtn: {
    backgroundColor: COLORS.red,
    padding: 8,
    borderRadius: 8,
  },
  rowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  deleteBtn: {
    backgroundColor: COLORS.redButton,
    borderRadius: 10,
    width: 100,
    height: 40,
    // padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  editBtn: {
    backgroundColor: COLORS.blueButton,
    borderRadius: 10,
    width: 100,
    height: 40,
    // padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
});
