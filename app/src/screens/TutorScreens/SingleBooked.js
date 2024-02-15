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

import SendInfoModal from "../../components/SendInfoModal";

import { doc, updateDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../FirebaseConfig";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

export default SingleBooked = ({ route, navigation }) => {
  const activeLink = "NewRequest";

  const { item } = route.params;
  const [data, setData] = useState(item);
  // console.log("item", item);
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
      sendInfo(id, reason);
      setModalVisible(false);
    } else {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Error in sending info",
        textBody: "Please enter info to send.",
      });
      console.log("Please enter info to send.");
    }

    // Close the modal
  };

  const sendInfo = async (sessionId, reason) => {
    const sessionRef = doc(FIRESTORE_DB, "sessions", sessionId);

    try {
      await updateDoc(sessionRef, {
        status: "ready",
        info: reason, // Add the decline reason or other additional fields
      });
      console.log("info sent");
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "Info sent!",
      });
      navigation.navigate("myClasses");
    } catch (error) {
      console.error("Error send info: ", error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error in sending info",
        textBody: "An error occurred while sending info ",
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
          <Text style={styles.headerText}>Booked Class</Text>
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
          <View style={styles.btnContainer}>
            {/* <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.btnText}>Decline</Text>
          </TouchableOpacity> */}
            {data.info ? (
              <>
                <View style={styles.detailInRow}>
                  <Text style={styles.label}>Info:- </Text>
                  <Text style={styles.content}>{data.info}</Text>
                </View>
                <TouchableOpacity
                  style={styles.sendInfo}
                  // onPress={() =>
                  //   navigation.navigate("editClassDetails", { item: item })
                  // }
                >
                  <Text style={styles.btnText}>Info has been sent</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.sendInfo}
                // onPress={() =>
                //   navigation.navigate("editClassDetails", { item: item })
                // }
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.btnText}>Send Info</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <SendInfoModal
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
  btnContainer: {
    flex: 1,

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
  sendInfo: {
    backgroundColor: COLORS.blueButton,
    borderRadius: 10,
    // width: 100,
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
