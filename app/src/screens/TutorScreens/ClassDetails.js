import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { COLORS } from "../../constants/theme";
import images from "../../constants/images";
import globalStyles from "../../global/globalStyles";

import BottomNav from "../../components/TutorBottomNav";
import Tags from "../../components/Tags";
import SessionSlot from "../../components/SessionSlot";

import { editIcon, trash } from "../../constants/images";

import UserContext from "../../contexts/UserContext";
import { collection, doc, deleteDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../../FirebaseConfig";

export default function ClassDetails({ route, navigation }) {
  const { item } = route.params;
  const classId = item.id;
  const activeLink = "MyClasses";

  const { userData, setUserData } = useContext(UserContext);
  const [data, setData] = useState("");

  const [tags, setTags] = useState([]);
  const [sessionSlot, setSessionSlot] = useState([]);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    setData(item);
    setTags(item.tags);
    setSessionSlot(item.timeSlots);
  }, [item]);

  const showDeleteConfirmation = () => {
    setDeleteModalVisible(true);
  };

  const hideDeleteConfirmation = () => {
    setDeleteModalVisible(false);
  };

  const handleDeleteClass = async (classId) => {
    try {
      const classRef = doc(collection(FIRESTORE_DB, "classes"), classId);
      await deleteDoc(classRef);
      hideDeleteConfirmation();
      navigation.navigate("myClasses");
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("myClasses")}>
          <Image source={images.backButton} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Class Details </Text>
      </View>
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.rowContainer}>
            <View>
              <Image
                source={
                  userData.photoURL === null
                    ? require("../../assets/images/profile.png")
                    : { uri: userData.photoURL }
                }
                style={{
                  width: 64,
                  height: 64,
                  backgroundColor: COLORS.green,
                  borderRadius: 10,
                }}
              ></Image>
            </View>
            <View style={globalStyles.rightAline}>
              <Text style={globalStyles.boldF24mb2}>
                {userData.firstName} {userData.lastName}
              </Text>
              <Text style={globalStyles.boldF16mb2}>Faculty of Computing</Text>
              <Text style={globalStyles.regularF14}>3rd year 2nd sem</Text>
            </View>
          </View>
          <View style={styles.container}>
            <Text style={globalStyles.boldF24mb8}>
              {data.classTitle ? data.classTitle : "Class Title"}
            </Text>
            <Text style={globalStyles.regularF16}>
              "{data.classDescription ? data.classDescription : "Description"}"
            </Text>
          </View>
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <Tags key={index} tagText={tag} />
            ))}
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceWhiteBg}>
              Rs: {data.price ? data.price : "0"}.00 per session
            </Text>
          </View>
          <View style={styles.container}>
            <Text style={globalStyles.boldF16mb8}>Session Times</Text>
            {sessionSlot.map((sessionSlot, index) => (
              <SessionSlot key={index} sessionSlot={sessionSlot} />
            ))}
          </View>

          <View style={styles.rowContainer}>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => showDeleteConfirmation()}
            >
              <Image source={trash} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() =>
                navigation.navigate("editClassDetails", { item: item })
              }
            >
              <Image source={editIcon} style={{ width: 24, height: 24 }} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <BottomNav activeLink={activeLink} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isDeleteModalVisible}
        onRequestClose={() => hideDeleteConfirmation()}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this class?
            </Text>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                handleDeleteClass(classId);
              }}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => hideDeleteConfirmation()}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

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
    fontWeight: "500",
    fontSize: 20,
    color: COLORS.white,
  },

  gridContainer: {
    // flexDirection: "row",
    // flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
  },

  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
  },

  newClassTag: {
    color: COLORS.primary,
    fontWeight: "bold",
    padding: 8,
    backgroundColor: COLORS.green,
    borderRadius: 8,
  },

  rowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },

  priceContainer: {
    paddingLeft: 16,
    borderRadius: 10,
    alignItems: "flex-start",
  },

  priceWhiteBg: {
    backgroundColor: COLORS.white,
    color: COLORS.orange,
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 10,
    fontSize: 16,
    fontWeight: "bold",
  },

  sessionBar: {
    backgroundColor: COLORS.white,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 10,
  },
  sessionDetails: {
    color: COLORS.darkGreen,
    fontWeight: "bold",
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    fontSize: 16,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  sessionInfo: {
    color: COLORS.darkGreen,
    fontSize: 16,
  },
  deleteBtn: {
    backgroundColor: COLORS.redButton,
    borderRadius: 10,
    width: 100,
    height: 40,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  editBtn: {
    backgroundColor: COLORS.blueButton,
    borderRadius: 10,
    width: 100,
    height: 40,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  // Delete Confirmation Modal
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 20,
    width: 300,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: COLORS.redButton,
    padding: 10,
    borderRadius: 10,
    width: 120,
    alignItems: "center",
    marginBottom: 10,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: COLORS.green,
    padding: 10,
    borderRadius: 10,
    width: 120,
    alignItems: "center",
  },
  cancelButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
});
