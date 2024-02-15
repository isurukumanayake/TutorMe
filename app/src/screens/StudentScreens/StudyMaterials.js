import { Picker } from "@react-native-picker/picker";
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
import { FIRESTORE_DB } from "../../../FirebaseConfig";
import SearchBar from "../../components/SearchBar";
import { COLORS } from "../../constants/theme";
import { StudentFragment } from "../../layouts/StudentFragment";

const StudyMaterials = () => {
	const [filteredData, setFilteredData] = useState([]);
	const navigation = useNavigation();
	const [searchText, setSearchText] = useState("");
	const [data, setData] = useState();
	const [selectedValue, setSelectedValue] = useState();

	useEffect(() => {
		const smRef = collection(FIRESTORE_DB, "studyMaterials");

		const subscriber = onSnapshot(smRef, {
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

	const handleSearch = (text) => {
		const filteredData = data.filter((item) => {
			return item.title.toLowerCase().includes(text.toLowerCase());
		});

		setSearchText(text);
		setFilteredData(filteredData);
	};

	const handleCategory = (text) => {
		const filteredData = data.filter((item) => {
			return item.category.toLowerCase().includes(text.toLowerCase());
		});

		setSelectedValue(text);
		setFilteredData(filteredData);
	};
	const renderListDownload = (item) => {
		return (
			<View style={styles.itemContainer}>
				<TouchableOpacity
					style={styles.item}
					onPress={() => navigation.navigate("smView", { id: item.id })}
				>
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
		<StudentFragment activeLink="studyMaterials">
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
			{/* Picker Input for Category */}
			<Picker
				selectedValue={selectedValue}
				style={styles.input}
				onValueChange={(itemValue) => handleCategory(itemValue)}
			>
				<Picker.Item label="🗂 | Select Category" value="Category" />
				<Picker.Item label="All" value="All" />
				<Picker.Item label="Mathematics" value="Mathematics" />
				<Picker.Item label="English" value="English" />
				<Picker.Item label="Computer Science" value="Computer Science" />
				<Picker.Item label="Biology" value="Biology" />
				<Picker.Item label="Engineering" value="Engineering" />
				<Picker.Item label="Other" value="Other" />
			</Picker>
			<FlatList
				data={filteredData.length > 0 ? filteredData : data}
				keyExtractor={(item) => item.id.toString()}
				renderItem={({ item }) => renderListDownload(item)}
				//centerContent="true"
				scrollEnabled={true}
			/>
		</StudentFragment>
	);
};

export default StudyMaterials;

const styles = StyleSheet.create({
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
		paddingHorizontal: 15,
		paddingVertical: 10,
		color: "white",
	},
	imgDoc: {
		fontSize: 30,
	},
	input: {
		backgroundColor: "white",
		width: "auto",
		borderWidth: 1,
		padding: 10,
		margin: 15,
	},
});
