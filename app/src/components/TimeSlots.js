import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native";

import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

import { Picker } from "@react-native-picker/picker";
import { COLORS } from "../constants/theme";
import { Entypo } from "@expo/vector-icons";

import DateTimePicker from "@react-native-community/datetimepicker";

export default function TimeSlots({ timeSlots, setTimeSlots }) {
  const [day, setDay] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [message, setMessage] = useState("");

  const handleStartChange = (event, selectedDate) => {
    setStartTime(selectedDate || start);
    setShowStartPicker(false);
  };

  const handleEndChange = (event, selectedDate) => {
    setEndTime(selectedDate || end);
    setShowEndPicker(false);
  };

  const handleAddTimeSlot = () => {
    if (day && startTime && endTime) {
      // Format the start and end times
      const formattedStart = formatTime(startTime);
      const formattedEnd = formatTime(endTime);

      // Create the new time slot object with formatted times
      const newTimeSlot = {
        day,
        startTime: formattedStart,
        endTime: formattedEnd,
      };

      // Add the new time slot to the timeSlots array
      setTimeSlots([...timeSlots, newTimeSlot]);

      // Reset day, start, and end
      setDay("");
      setStartTime(new Date());
      setEndTime(new Date());
    } else {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: "Please full fill all the fields before adding a time slot",
      });
      // alert("Please full fill all the fields");
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <View style={styles.timeSlotContainer}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={day}
            onValueChange={(itemValue) => setDay(itemValue)}
          >
            <Picker.Item label="Select Day" value="" />
            <Picker.Item label="Sunday" value="Sunday" />
            <Picker.Item label="Monday" value="Monday" />
            <Picker.Item label="Tuesday" value="Tuesday" />
            <Picker.Item label="Wednesday" value="Wednesday" />
            <Picker.Item label="Thursday" value="Thursday" />
            <Picker.Item label="Friday" value="Friday" />
            <Picker.Item label="Saturday" value="Saturday" />
          </Picker>
        </View>

        <View style={styles.timeContainer}>
          <TouchableWithoutFeedback onPress={() => setShowStartPicker(true)}>
            <View>
              <Text>Start Time</Text>
              <Text style={styles.textarea}>{formatTime(startTime)}</Text>
            </View>
          </TouchableWithoutFeedback>
          {showStartPicker && (
            <DateTimePicker
              testID="startDateTimePicker"
              value={startTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selectedDate) => {
                handleStartChange(event, selectedDate);
              }}
            />
          )}

          <TouchableWithoutFeedback onPress={() => setShowEndPicker(true)}>
            <View>
              <Text>End Time</Text>
              <Text style={styles.textarea}>{formatTime(endTime)}</Text>
            </View>
          </TouchableWithoutFeedback>
          {showEndPicker && (
            <DateTimePicker
              testID="endDateTimePicker"
              value={endTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={(event, selectedDate) => {
                handleEndChange(event, selectedDate);
              }}
            />
          )}
        </View>
      </View>
      <View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <TouchableOpacity
            style={{
              padding: 8,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
            onPress={handleAddTimeSlot}
          >
            <Entypo name="circle-with-plus" size={24} color="green" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  timeSlotContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "top",
    marginVertical: 10,
  },
  pickerContainer: {
    borderColor: COLORS.gray,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    width: "40%",
    height: 50,
  },
  timeContainer: {
    width: "55%",
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
});
