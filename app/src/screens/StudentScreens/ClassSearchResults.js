import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { StudentFragment } from "../../layouts/StudentFragment";
import { COLORS } from "../../constants/theme";
import { FIRESTORE_DB } from "../../../FirebaseConfig";
import images from "../../constants/images";

const ClassSearchResults = ({ route, navigation }) => {
  // Retrieve the parameter from the route prop
  const { searchText } = route.params;
  const { category } = route.params;

  const [allClasses, setAllClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    setLoading(true); // Set loading to true

    const classesQuery = query(
      collection(FIRESTORE_DB, "classes"),
      orderBy("addedAt", "desc")
    );

    const subscriber = onSnapshot(classesQuery, {
      next: (snapshot) => {
        const classes = [];
        snapshot.docs.forEach((doc) => {
          classes.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setAllClasses(classes);
        // console.log(classes);

        // Check if there are no results
        if (category || searchText) {
          const filtered = classes.filter((item) => {
            return (
              (!category || item.categorySearch === category) &&
              (!searchText ||
                item.classTitle
                  .toLowerCase()
                  .includes(searchText.toLowerCase()) ||
                item.classDescription
                  .toLowerCase()
                  .includes(searchText.toLowerCase()) ||
                item.tags.some((tag) =>
                  tag.toLowerCase().includes(searchText.toLowerCase())
                ))
            );
          });
          setFilteredClasses(filtered);
          setNoResults(filtered.length === 0); // Set noResults flag
        } else {
          setFilteredClasses(classes);
        }
        setLoading(false); // Set loading to false
      },
    });
    return () => subscriber();
  }, []);

  const renderClassItem = ({ item, index }) => {
    const isOddCount = filteredClasses.length % 2 === 1;
    const isLastItem = index === filteredClasses.length - 1;

    return (
      <TouchableOpacity
        style={[
          styles.classCard,
          {
            flex:
              isOddCount && isLastItem
                ? 0.45 // Set flex to 0.4 for the last item in odd count
                : 1, // Set flex to 1 for other items
          },
        ]}
        onPress={() =>
          navigation.navigate("classDetails", { classDetails: item })
        }
      >
        <View style={styles.classCardTop}>
          <Text style={styles.classTutor}>
            {item.tutorFirstName + " " + item.tutorLastName}
          </Text>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.profilePicture }}
              style={styles.tutorImage}
            />
          </View>
        </View>
        <Text style={styles.className}>
          {item.classTitle.length > 30
            ? item.classTitle.slice(0, 30) + "..."
            : item.classTitle}
        </Text>
        <View style={styles.classCardBottom}>
          <Text style={styles.classDuration}>
            {item.duration + " " + (item.duration > 1 ? "Hours" : "Hour")}
          </Text>
          <View style={styles.classPriceContainer}>
            <Text style={styles.classPrice}>Rs. {item.price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // const renderClassItem = ({ item }) => (
  //   <TouchableOpacity
  //     style={styles.classCard}
  //     onPress={() =>
  //       navigation.navigate("classDetails", { classDetails: item })
  //     }
  //   >
  //     <View style={styles.classCardTop}>
  //       <Text style={styles.classTutor}>
  //         {item.tutorFirstName + " " + item.tutorLastName}
  //       </Text>
  //       <View style={styles.imageContainer}>
  //         <Image
  //           source={{ uri: item.profilePicture }}
  //           style={styles.tutorImage}
  //         />
  //       </View>
  //     </View>
  //     <Text style={styles.className}>
  //       {item.classTitle.length > 30
  //         ? item.classTitle.slice(0, 30) + "..."
  //         : item.classTitle}
  //     </Text>
  //     <View style={styles.classCardBottom}>
  //       <Text style={styles.classDuration}>
  //         {item.duration + " " + (item.duration > 1 ? "Hours" : "Hour")}
  //       </Text>
  //       <View style={styles.classPriceContainer}>
  //         <Text style={styles.classPrice}>Rs. {item.price}</Text>
  //       </View>
  //     </View>
  //   </TouchableOpacity>
  // );

  return (
    <StudentFragment activeLink="">
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Classes</Text>
      </View>
      {loading ? (
        <View style={styles.activityIndicator}>
          <ActivityIndicator size="large" color={COLORS.green} />
        </View>
      ) : noResults ? (
        <View style={styles.activityIndicator}>
          <Image source={images.empty} style={styles.empty} />
          <Text style={styles.emptyText}>No classes found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredClasses}
          renderItem={renderClassItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          style={styles.classList}
        />
      )}
    </StudentFragment>
  );
};

export default ClassSearchResults;

const styles = StyleSheet.create({
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
  classList: {
    padding: 10,
  },
  classCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 10,
    margin: 6,
    flex: 1,
  },
  classCardTop: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imageContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  tutorImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  className: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
    marginBottom: 6,
    flex: 1,
    textAlignVertical: "center", //adjust
  },
  classTutor: {
    fontSize: 14,
    color: COLORS.black,
    flex: 4,
  },
  classCardBottom: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 6,
  },
  classDuration: {
    fontSize: 14,
    color: COLORS.darkGray,
  },
  classPriceContainer: {
    backgroundColor: COLORS.priceGray,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  classPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.orange,
  },
  activityIndicator: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
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
