import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

import images from "../../constants/images";
import React, { useState, useEffect } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import { COLORS } from "../../constants/theme";

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";

const statuses = [
  {
    status: "completed",
    displayText: "Completed ",
    textColor: COLORS.notificationLightGreen,
    bgColor: COLORS.notificationLightGreen,
  },
];

const CompletedClasses = ({ navigation }) => {
  const [sessions, setSessions] = useState();

  const [statusCounts, setStatusCounts] = useState({});

  useEffect(() => {
    const currentUserID = FIREBASE_AUTH.currentUser.uid;

    // console.log(currentUserID);

    // Update the query to filter by status
    const sessionsQuery = query(
      collection(FIRESTORE_DB, "sessions"),
      where("tutorId", "==", currentUserID),
      where("status", "==", "completed") // Filter by status
      // orderBy("submittedAt", "desc")
    );

    const subscriber = onSnapshot(sessionsQuery, {
      next: (snapshot) => {
        const sessions = [];
        snapshot.docs.forEach((doc) => {
          sessions.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setSessions(sessions);

        setStatusCounts(sessions.length);
        console.log(sessions);
        console.log(statusCounts);
      },
    });

    return () => subscriber();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.session}
      //   onPress={() => navigation.navigate("singleNewRequest", { item: item })}
    >
      <View style={styles.sessionLeft}>
        <Text style={styles.class}>
          {item.classTitle.length > 30
            ? item.classTitle.slice(0, 28) + "..."
            : item.classTitle}
        </Text>
        <Text style={styles.tutor}>{item.studentName}</Text>
        <Text style={styles.time}>
          {item.date} | {item.timeslot}
        </Text>
      </View>
      <View style={styles.sessionRight}>
        <View
          style={{
            ...styles.statusContainer,
            backgroundColor: statuses.find(
              (statusInfo) => statusInfo.status === item.status
            ).bgColor,
          }}
        >
          <Text
            style={{
              ...styles.statusText,
              color: statuses.find(
                (statusInfo) => statusInfo.status === item.status
              ).textColor,
            }}
          >
            {item.displayText}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("myClasses")}>
          <Image source={images.backButton} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Booked Class</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.notificationsContainer}>
          <View style={styles.notification}>
            {statusCounts > 0 ? (
              <Text style={styles.notificationText}>
                {statusCounts} Completed class{statusCounts > 1 ? "es" : ""}
              </Text>
            ) : (
              <Text>No Completed classes</Text>
            )}
          </View>
        </View>

        <View style={styles.sessionsContainer}>
          <FlatList
            data={sessions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </>
  );
};

export default CompletedClasses;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  notificationsContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  notification: {
    alignItems: "center",
    borderRadius: 10,
    padding: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    marginRight: 14,
    width: 200,
    backgroundColor: COLORS.notificationLightGreen,
  },
  notificationText: {
    color: COLORS.notificationDarkGreen,
  },
  sessionsContainer: {
    paddingVertical: 15,
  },
  session: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  class: {
    fontWeight: "600",
    fontSize: 16,
  },
  tutor: {
    fontSize: 14,
    marginVertical: 6,
  },
  time: {
    fontSize: 13,
  },
  statusContainer: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {},
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
});
