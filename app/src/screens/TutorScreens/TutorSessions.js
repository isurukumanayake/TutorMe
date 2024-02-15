import { FlatList, StyleSheet, Text, View } from "react-native";
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
    status: "pending",
    displayText: "New request",
    textColor: COLORS.notificationLightYellow,
    bgColor: COLORS.notificationDarkYellow,
  },
  // {
  //   status: "ready",
  //   displayText: "Booked",
  //   textColor: COLORS.notificationDarkGreen,
  //   bgColor: COLORS.notificationLightGreen,
  // },
  // {
  //   status: "completed",
  //   displayText: "Completed",
  //   textColor: COLORS.notificationDarkGreen,
  //   bgColor: COLORS.notificationLightGreen,
  // },
];

const TutorSessions = () => {
  const [sessions, setSessions] = useState();

  const [statusCounts, setStatusCounts] = useState({});

  useEffect(() => {
    const currentUserID = FIREBASE_AUTH.currentUser.uid;

    console.log(currentUserID);

    // Update the query to filter by status
    const sessionsQuery = query(
      collection(FIRESTORE_DB, "sessions"),
      where("tutorId", "==", currentUserID),
      where("status", "==", "pending") // Filter by status
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
        console.log(sessions);
      },
    });
    return () => subscriber();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.session}>
      <View style={styles.sessionLeft}>
        <Text style={styles.class}>
          {item.classTitle.length > 30
            ? item.classTitle.slice(0, 28) + "..."
            : item.classTitle}
        </Text>
        <Text style={styles.tutor}>{item.tutorName}</Text>
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
    </View>
  );

  return (
    <StudentLayout name="My sessions">
      <View style={styles.container}>
        <View style={styles.notificationsContainer}>
          {statuses.map((statusInfo) => {
            const count = statusCounts[statusInfo.status] || 0;
            if (count >= 1) {
              return (
                <View
                  key={statusInfo.status}
                  style={{
                    ...styles.notification,
                    backgroundColor: statusInfo.bgColor,
                  }}
                >
                  <Text
                    style={{
                      ...styles.notificationText,
                      color: statusInfo.textColor,
                    }}
                  >
                    {count} {statusInfo.displayText}
                  </Text>
                </View>
              );
            }
            return null;
          })}
        </View>

        <View style={styles.sessionsContainer}>
          <FlatList
            data={sessions}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </StudentLayout>
  );
};

export default TutorSessions;

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
    width: 120,
  },
  notificationText: {},
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
});
