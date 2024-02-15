import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { TutorFragment } from "../../layouts/TutorFragment";
import { COLORS } from "../../constants/theme";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

const MyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [sessions, setSessions] = useState();

  const [events, setEvents] = useState([
    // {
    //   date: "2023-10-27",
    //   items: ["Event 4", "Event 5", "Event 6"],
    // },
  ]);

  const convertDateFormat = (dateString) => {
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [month, day, year] = parts;
      return `${year}-${month}-${day}`;
    } else {
      return dateString; // Return the original date string if it's not in the expected format.
    }
  };

  useEffect(() => {
    const currentUserID = FIREBASE_AUTH.currentUser.uid;

    const sessionsQuery = query(
      collection(FIRESTORE_DB, "sessions"),
      where("tutorId", "==", currentUserID),
      where("status", "==", "ready")
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

        const eventsArray = sessions.map((session) => ({
          date: convertDateFormat(session.date),
          items: sessions
            .filter((s) => s.date === session.date)
            .map((s) => ({
              timeslot: s.timeslot,
              classTitle: s.classTitle,
              studentName: s.studentName,
            })),
        }));
        setEvents(eventsArray);
      },
    });
    return () => subscriber();
  }, []);

  // Filter events based on the selected date
  const filteredEvents = events.find((event) => event.date === selectedDate);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.leftText}>{item.timeslot}</Text>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.rightText}>
          {item.classTitle} class for {item.studentName}
        </Text>
      </View>
    </View>
  );

  return (
    <TutorFragment activeLink="calendar">
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Calendar</Text>
        </View>
        <View style={styles.calendarConatainer}>
          <Calendar
            onDayPress={onDayPress}
            markedDates={{
              [selectedDate]: {
                selected: true,
                disableTouchEvent: true,
                selectedDotColor: "orange",
              },
            }}
            theme={{
              selectedDayBackgroundColor: COLORS.green,
              todayTextColor: COLORS.green,
            }}
          />
          <View style={styles.itemsContainer}>
            {selectedDate && filteredEvents ? (
              <FlatList
                data={filteredEvents.items}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
              />
            ) : (
              <Text style={styles.empty}>No events for the selected date</Text>
            )}
          </View>
        </View>
      </View>
    </TutorFragment>
  );
};

export default MyCalendar;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGreen,
  },
  headerContainer: {
    padding: 18,
    backgroundColor: COLORS.green,
  },
  headerText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: COLORS.white,
  },
  calendarConatainer: {
    padding: 20,
  },
  itemsContainer: {
    padding: 5,
    marginVertical: 15,
    backgroundColor: COLORS.green,
    borderRadius: 6,
    padding: 10,
  },
  card: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    backgroundColor: COLORS.notificationLightGreen,
    borderRadius: 10,
    marginVertical: 6,
  },
  cardLeft: {
    flex: 0.45,
    padding: 2,
    alignItems: "center",
  },
  cardRight: {
    flex: 0.55,
    padding: 8,
    borderLeftWidth: 0.4,
    borderColor: COLORS.gray,
  },
  leftText: {
    color: COLORS.white,
  },
  rightText: {
    color: COLORS.white,
  },
  empty: {
    color: COLORS.white,
  },
});
