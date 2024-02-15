import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

const DeclineReasonModal = ({ isVisible, onClose, onDecline }) => {
  const [declineReason, setDeclineReason] = useState("");

  const handleDecline = () => {
    // Pass the decline reason to the parent component
    onDecline(declineReason);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.modal}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Decline Reason</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter reason for declining"
          onChangeText={(text) => setDeclineReason(text)}
          multiline={true}
          numberOfLines={4}
        />
        <TouchableOpacity onPress={handleDecline} style={styles.declineButton}>
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    width: "95%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  declineButton: {
    backgroundColor: "red",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
  },
  declineButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "lightgray",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginTop: 10,
  },
  cancelButtonText: {
    color: "black",
    fontWeight: "bold",
  },
});

export default DeclineReasonModal;
