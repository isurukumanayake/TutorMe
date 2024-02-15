import { useNavigation } from "@react-navigation/native";
import {
	addDoc,
	collection,
	onSnapshot,
	query,
	where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
	FlatList,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { FIRESTORE_DB } from "../../../../FirebaseConfig";
import SearchBar from "../../../components/SearchBar";
import { COLORS } from "../../../constants/theme";
import { TutorFragment } from "../../../layouts/TutorFragment";

const SMList = () => {
	const navigation = useNavigation();
	const [searchText, setSearchText] = useState("");
	const [data, setData] = useState();

	useEffect(() => {
		const smRef = collection(FIRESTORE_DB, "studyMaterials");
		const queryRef = query(smRef, where("author", "==", "Nethmi Tharaka"));

		const subscriber = onSnapshot(queryRef, {
			next: (snapshot) => {
				const items = [];
				snapshot.docs.forEach((doc) => {
					items.push({
						id: doc.id,
						...doc.data(),
					});
				});
				setData(items);
			},
		});

		return () => subscriber();
	}, []);

	const [filteredData, setFilteredData] = useState([]);

	const handleSearch = (text) => {
		const filteredData = data.filter((item) => {
			return item.title.toLowerCase().includes(text.toLowerCase());
		});

		setSearchText(text);
		setFilteredData(filteredData);
	};

	const renderListEdit = (item) => {
		return (
			<View style={styles.itemContainer}>
				<TouchableOpacity
					style={styles.item}
					onPress={() => navigation.navigate("smView", { id: item.id })}
				>
					<Text style={{ fontSize: 25 }}> 📗 </Text>
					<Text style={styles.itemText}>{item.title}</Text>
					<View style={styles.editButton}>
						<Text
							style={styles.editText}
							onPress={() =>
								navigation.navigate("smEdit", { id: item.id })
							}
						>
							📝 Edit
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	};

	const renderListDownload = (item) => {
		return (
			<View style={styles.itemContainer}>
				<TouchableOpacity style={styles.item}>
					{/*<Text style={styles.imgDoc}>📗 </Text>*/}
					<Image
						resizeMode="contain"
						style={{ width: 64, height: 64, borderRadius: 10 }}
						source={{
							uri: item.imgLink,
						}}
					/>
					<View
						style={{
							flex: 1,
							flexDirection: "column",
							alignItems: "left",
						}}
					>
						<Text style={styles.itemTextTitle}>{item.title}</Text>
						<Text style={styles.itemTextCat}>{item.category}</Text>
					</View>

					<View style={styles.editButton}>
						<Text style={{ marginBottom: 10 }}>{item.downloads} 📥</Text>
						<Text
							style={styles.editText}
							onPress={() =>
								navigation.navigate("smView", { id: item.id })
							}
						>
							More Info
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	};

	return (
		<TutorFragment activeLink="profile">
			<View style={{ backgroundColor: COLORS.green, height: "10%" }}>
				<Text
					style={{
						color: "white",
						paddingVertical: 19,
						paddingHorizontal: 95,
						fontSize: 25,
					}}
				>
					Study Materials
				</Text>
			</View>
			<SearchBar handleSearch={handleSearch} searchText={searchText} />

			<FlatList
				data={filteredData.length > 0 ? filteredData : data}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => renderListEdit(item)}
				//centerContent="true"
				style={{ height: "100%" }}
				scrollEnabled={true}
			/>
			<View style={styles.addContainer}>
				<TouchableOpacity
					style={styles.addButton}
					onPress={() => navigation.navigate("smAdd")}
				>
					<Text style={styles.addIcon}>+</Text>
				</TouchableOpacity>
			</View>
		</TutorFragment>
	);
};

export default SMList;

const styles = StyleSheet.create({
	addContainer: {
		margin: 10,
		justifyContent: "flex-end",
		alignItems: "flex-end",
	},
	addButton: {
		backgroundColor: COLORS.green,
		width: 56,
		height: 56,
		borderRadius: 28,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "black",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		elevation: 3,
	},
	addIcon: {
		color: "white",
		fontSize: 56,
		top: -10,
		// alignSelf: "center",
	},
	itemContainer: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "white",
		padding: 10,
		marginVertical: 4,
		marginHorizontal: 10,
		borderRadius: 15,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.2,
		shadowRadius: 3.84,
		elevation: 5,
	},
	itemText: {
		flex: 1,
		paddingHorizontal: 4,
		marginVertical: 2,
	},
	itemTextTitle: {
		flex: 1,
		paddingHorizontal: 4,
		marginTop: 5,
		marginBottom: 0,
		fontWeight: "bold",
		marginLeft: 8,
	},
	itemTextCat: {
		flex: 1,
		paddingHorizontal: 4,
		marginTop: 0,
		marginBottom: 1,
		fontStyle: "italic",
		marginLeft: 12,
	},
	item: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",

		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.2,
		shadowRadius: 3.84,
		elevation: 5,
	},
	editButton: {
		left: 50,
		flex: 1,
		flexWrap: "wrap",
		flexDirection: "column",
		alignItems: "center",
		width: "8%",
	},
	editText: {
		flex: 1,
		backgroundColor: COLORS.green,
		borderRadius: 10,
		paddingVertical: 6,
		paddingHorizontal: 15,
		color: "white",
	},
	imgDoc: {
		fontSize: 30,
	},
});
