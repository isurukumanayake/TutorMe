import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
  Linking,
} from "react-native";
import React, { useState, useContext } from "react";
import StudentLayout from "../../layouts/StudentLayout";
import { COLORS } from "../../constants/theme";
import UserContext from "../../contexts/UserContext";
import { useStripe, StripeProvider } from "@stripe/stripe-react-native";
import axios from "axios";
import { STRIPE_PUBLISHABLE_KEY } from "../../constants/stripeKeys";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../../FirebaseConfig";
import {
  addDoc,
  collection,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import {
  AlertNotificationRoot,
  Dialog,
  Toast,
  ALERT_TYPE,
} from "react-native-alert-notification";

const SessionDetails = ({ route, navigation }) => {
  const { sessionData } = route.params;
  const { userData, setUserData } = useContext(UserContext);

  const [clientSecret, setClientSecret] = useState(""); // Initialize with an empty string
  const stripe = useStripe();

  const pay = async () => {
    try {
      const response = await axios.post("http://192.168.43.220:4000/pay", {
        name: userData.firstName + " " + userData.lastName,
        userId: FIREBASE_AUTH.currentUser.uid,
        amount: sessionData.price,
      });
      setClientSecret(response.data.clientSecret); // Set the clientSecret with the response
      const initSheet = await stripe.initPaymentSheet({
        paymentIntentClientSecret: clientSecret,
        merchantDisplayName: "TutorMe",
        defaultBillingDetails: {
          address: {
            country: "LK",
          },
        },
      });
      if (initSheet.error) return alert(initSheet.error.message);
      const presentSheet = await stripe.presentPaymentSheet({
        clientSecret,
      });
      if (presentSheet.error) return alert(presentSheet.error.message);

      await addDoc(collection(FIRESTORE_DB, "transactions"), {
        tutorId: sessionData.tutorId,
        sessionId: sessionData.id,
        // classId: sessionData.classId,
        amount: sessionData.price,
        studentId: FIREBASE_AUTH.currentUser.uid,
        status: "completed",
        paidAt: new Date(),
        type: "studentPayment",
      });

      const sessionDoc = doc(FIRESTORE_DB, "sessions", sessionData.id);
      await updateDoc(sessionDoc, {
        status: "booked",
      });

      Dialog.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "Payment Successful!",
        button: "Close",
      });
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const cancel = async () => {
    const sessionDoc = doc(FIRESTORE_DB, "sessions", sessionData.id);
    await deleteDoc(sessionDoc);
    alert("Session cancelled");
    navigation.goBack();
  };

  const complete = async () => {
    const sessionDoc = doc(FIRESTORE_DB, "sessions", sessionData.id);
    await updateDoc(sessionDoc, {
      status: "completed",
    });

    alert("Session completed");
  };

  return (
    <AlertNotificationRoot>
      <StudentLayout name="Session Details">
        <ScrollView style={styles.container}>
          <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
            <View style={styles.tutorInfo}>
              <Image
                source={{ uri: sessionData.tutorImage }}
                style={styles.tutorImage}
              />
              <View style={styles.tutorDetails}>
                <Text style={styles.tutorName}>{sessionData.tutorName}</Text>
                <Text style={styles.tutorFaculty}>Faculty of Computing</Text>
                <Text style={styles.tutorYear}>3rd year 2nd semester</Text>
              </View>
            </View>
            <View style={styles.ruler} />

            <Text style={styles.className}>{sessionData.classTitle}</Text>
            <Text style={styles.classDescription}>
              {sessionData.classDescription}
            </Text>
            <View style={styles.tagContainer}>
              {sessionData.classTags.map((tag, index) => (
                <View style={styles.tag} key={index}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
            <View style={styles.ruler} />
            <View style={styles.sessionInfoContainer}>
              <View style={styles.sessionInfo}>
                <Text style={styles.label}>Mode</Text>
                <Text style={styles.value}>{sessionData.mode}</Text>
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.label}>Date</Text>
                <Text style={styles.value}>{sessionData.date}</Text>
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.label}>Timeslot</Text>
                <Text style={styles.value}>{sessionData.timeslot}</Text>
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.label}>Charges</Text>
                <Text style={styles.value}>Rs. {sessionData.price}.00</Text>
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.label}>Participants</Text>
                <Text style={styles.value}>{sessionData.numOfStudents}</Text>
              </View>
              <View style={styles.sessionInfo}>
                <Text style={styles.label}>Reason</Text>
                <Text style={styles.value}>{sessionData.reason}</Text>
              </View>
            </View>
            <View style={styles.ruler} />
            {/* Link */}
            {sessionData.status == "ready" && (
              <>
                <View style={styles.sessionInfo}>
                  <Text style={styles.label}>
                    {sessionData.mode === "Online" ? "Link" : "Location"}
                  </Text>
                  {sessionData.mode === "Online" ? (
                    <TouchableHighlight
                      onPress={() => Linking.openURL(sessionData.info)}
                    >
                      <Text style={styles.value}>{sessionData.info}</Text>
                    </TouchableHighlight>
                  ) : (
                    <Text style={styles.value}>{sessionData.info}</Text>
                  )}
                </View>
                <View style={styles.ruler} />
              </>
            )}

            {sessionData.status == "declined" && (
              <>
                <View style={styles.sessionInfo}>
                  <Text style={styles.label}>Rejected reason</Text>

                  <Text style={styles.value}>{sessionData.declineReason}</Text>
                </View>
                <View style={styles.ruler} />
              </>
            )}

            {sessionData.status == "accepted" && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={{ ...styles.button, backgroundColor: COLORS.green }}
                  onPress={pay}
                >
                  <Text style={{ ...styles.buttonText, color: COLORS.white }}>
                    Pay
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {sessionData.status == "pending" && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={{ ...styles.button, backgroundColor: COLORS.green }}
                  onPress={() =>
                    navigation.navigate("editSession", {
                      sessionData: sessionData,
                    })
                  }
                >
                  <Text style={{ ...styles.buttonText, color: COLORS.white }}>
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ ...styles.button, backgroundColor: "gray" }}
                  onPress={cancel}
                >
                  <Text style={{ ...styles.buttonText, color: COLORS.white }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {sessionData.status == "ready" && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={{
                    ...styles.button,
                    backgroundColor: COLORS.blueButton,
                  }}
                  onPress={complete}
                >
                  <Text style={{ ...styles.buttonText, color: COLORS.white }}>
                    Completed
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </StripeProvider>
        </ScrollView>
      </StudentLayout>
    </AlertNotificationRoot>
  );
};

export default SessionDetails;

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
    opacity: 0.5,
  },
  sessionInfoContainer: {},
  sessionInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  label: {
    flex: 0.38,
    fontWeight: "500",
    fontSize: 15,
    color: "#333333",
  },
  value: {
    flex: 0.72,
    fontSize: 15,
    color: "#888888",
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    // backgroundColor: COLORS.green,
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginBottom: 18,
  },
  buttonText: {
    // color: COLORS.white,
    fontSize: 18,
    fontWeight: "500",
  },
});
