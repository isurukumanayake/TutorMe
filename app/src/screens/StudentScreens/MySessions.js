import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
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
import { Picker } from "@react-native-picker/picker";
import images from "../../constants/images";

const statuses = [
  {
    status: "pending",
    textColor: COLORS.notificationLightYellow,
    bgColor: COLORS.notificationDarkYellow,
  },
  {
    status: "accepted",
    textColor: COLORS.notificationDarkGreen,
    bgColor: COLORS.notificationLightGreen,
  },
  {
    status: "declined",
    textColor: COLORS.notificationDarkRed,
    bgColor: COLORS.notificationLightRed,
  },
  {
    status: "booked",
    textColor: COLORS.notificationDarkBlue3,
    bgColor: COLORS.notificationLightBlue3,
  },
  {
    status: "ready",
    textColor: COLORS.notificationDarkBlue,
    bgColor: COLORS.notificationLightBlue,
  },
  {
    status: "completed",
    textColor: COLORS.notificationDarkBlue2,
    bgColor: COLORS.notificationLightBlue2,
  },
];

const MySessions = ({ navigation }) => {
  const [sessions, setSessions] = useState();

  const [statusCounts, setStatusCounts] = useState({});

  const [selectedStatus, setSelectedStatus] = useState("All"); // Initialize with "All" to show all sessions

  const [isSessionsEmpty, setIsSessionsEmpty] = useState(false);

  useEffect(() => {
    const currentUserID = FIREBASE_AUTH.currentUser.uid;

    const sessionsQuery = query(
      collection(FIRESTORE_DB, "sessions"),
      where("studentId", "==", currentUserID),
      orderBy("submittedAt", "desc")
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
        // console.log(sessions);

        // Count the occurrences of each status
        const counts = {};
        sessions.forEach((session) => {
          const status = session.status;
          if (counts[status]) {
            counts[status] += 1;
          } else {
            counts[status] = 1;
          }
        });
        setStatusCounts(counts);

        setIsSessionsEmpty(sessions.length === 0);
      },
    });
    return () => subscriber();
  }, []);

  const renderItem = ({ item }) => {
    if (selectedStatus === "All" || selectedStatus === item.status) {
      return (
        <TouchableOpacity
          style={styles.session}
          onPress={() =>
            navigation.navigate("sessionDetails", { sessionData: item })
          }
        >
          <View style={styles.sessionLeft}>
            <Text style={styles.class}>
              {item.classTitle.length > 30
                ? item.classTitle.slice(0, 26) + "..."
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
                {item.status}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    return null;
  };

  // Add the capitalizeFirstLetter function
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

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
                    {count} {statusInfo.status}
                  </Text>
                </View>
              );
            }
            return null;
          })}
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedStatus}
            onValueChange={(itemValue) => setSelectedStatus(itemValue)}
          >
            <Picker.Item label="All" value="All" />
            {statuses.map((statusInfo) => (
              <Picker.Item
                label={capitalizeFirstLetter(statusInfo.status)}
                value={statusInfo.status}
                key={statusInfo.status}
              />
            ))}
          </Picker>
        </View>

        {/* <View style={styles.sessionsContainer}> */}
        <FlatList
          data={sessions}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          style={styles.sessionsContainer}
        />
        {/* </View> */}

        {isSessionsEmpty && (
          <View style={styles.emptyContainer}>
            <Image source={images.empty} style={styles.empty} />
            {/* <Text style={styles.emptyText}>No sessions</Text> */}
          </View>
        )}
      </View>
    </StudentLayout>
  );
};

export default MySessions;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 0,
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
    width: 100,
  },
  notificationText: {},
  sessionsContainer: {
    marginTop: 10,
    marginBottom: 150,
  },
  session: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    marginVertical: 6,
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
    width: 90,
  },
  statusText: {},
  pickerContainer: {
    borderColor: COLORS.gray,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  empty: {
    width: 160,
    height: 160,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 20,
    color: "#808080",
    textAlign: "center",
  },
});
