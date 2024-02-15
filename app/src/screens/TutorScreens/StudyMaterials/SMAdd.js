import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { FIRESTORE_DB } from "../../../../FirebaseConfig";
import { COLORS } from "../../../constants/theme";
import { TutorFragment } from "../../../layouts/TutorFragment";

const SMAdd = () => {
	// hooks
	const navigation = useNavigation();

	// vars
	const [isLoading, setIsLoading] = React.useState(false);
	const [selectedValue, setSelectedValue] = useState();
	const [selectedImage, setSelectedImage] = useState();
	const [selectedPDF, setSelectedPDF] = useState();

	// item values
	const [values, setValues] = useState({
		title: "",
		desc: "",
		category: "",
		downloads: 0,
		author: "Nethmi Tharaka",
		imgLink:
			"https://static-01.daraz.lk/p/bd6051a54fb59ee96b46a93e2024b8f6.png",
		pdfLink:
			"https://byjusexamprep.com/liveData/f/2021/4/english_grammar_pdf_60.pdf",
		pdfName: "",
	});

	// clear all
	const clearAll = () => {
		setValues({ ...values, title: " ", category: " ", desc: " " });
		setSelectedValue("Category");
		setSelectedImage(null);
		setSelectedPDF(null);
	};

	// add functions
	const addFunc = async () => {
		if (
			values.title.trim() === "" ||
			values.category.trim() === "" ||
			values.desc.trim() === "" ||
			selectedImage == null ||
			selectedPDF == null
		) {
			Alert.alert(
				"Form Validation",
				"!!..Please complete all required fields.",
				[
					{
						text: "OK",
						style: "cancel",
					},
				],
				{ cancelable: false }
			);
		} else {
			setIsLoading(true);
			const doc = await addDoc(
				collection(FIRESTORE_DB, "studyMaterials"),
				values
			);
			clearAll();
			Alert.alert(
				"Add Item",
				"Operation Successful.!!",
				[
					{
						text: "OK",
						style: "cancel",
					},
				],
				{ cancelable: false }
			);
			setIsLoading(false);
			navigation.navigate("smList");
		}
	};

	const categoryFunc = (value) => {
		setValues({ ...values, category: value });
		setSelectedValue(value);
	};

	// upload image
	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			quality: 1,
		});

		if (!result.canceled) {
			console.log("Image Picked");
			const imageUri = result.assets[0].uri;
			setSelectedImage(imageUri);
		}
	};

	// upload document
	const pickDocument = async () => {
		try {
			let response = await DocumentPicker.getDocumentAsync({
				type: "application/pdf",
			});
			setSelectedPDF(response.assets[0].name);
			setValues({ ...values, pdfName: response.assets[0].name });
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<TutorFragment activeLink="profile">
			{/*  start header */}
			<View style={{ backgroundColor: COLORS.green, height: "10%" }}>
				<Text
					style={{
						color: "white",
						paddingVertical: 19,
						paddingHorizontal: 125,
						fontSize: 25,
					}}
				>
					Add Items
				</Text>
			</View>
			{/*  end header */}

			{/*  start content */}
			<ScrollView
				style={{
					marginTop: "40px",
					padding: 10,
				}}
			>
				{/* Text Input for Book Name */}
				<Text style={styles.inputLabel}>Title: </Text>
				<TextInput
					id="smTitle"
					class="smTitle"
					style={styles.input}
					placeholder="📖  |  Title"
					placeholderTextColor={COLORS.darkGray}
					onChangeText={(text) => setValues({ ...values, title: text })}
					value={values.title}
				/>

				{/* Text Input for Description */}
				<Text style={styles.inputLabel}>Description: </Text>
				<TextInput
					id="smDesc"
					class="smDesc"
					style={styles.input}
					placeholder="📖  |  Description"
					placeholderTextColor={COLORS.darkGray}
					multiline={true}
					numberOfLines={5}
					onChangeText={(text) => setValues({ ...values, desc: text })}
					value={values.desc}
				/>

				{/* Picker Input for Category */}
				<Text style={styles.inputLabel}>Category: </Text>
				<Picker
					selectedValue={selectedValue}
					style={styles.input}
					onValueChange={(itemValue) => categoryFunc(itemValue)}
				>
					<Picker.Item label="🗂 | Select Category" value="Category" />
					<Picker.Item label="Mathematics" value="Mathematics" />
					<Picker.Item label="English" value="English" />
					<Picker.Item label="Computer Science" value="Computer Science" />
					<Picker.Item label="Biology" value="Biology" />
					<Picker.Item label="Engineering" value="Engineering" />
					<Picker.Item label="Other" value="Other" />
				</Picker>

				{/* Upload Image */}
				<TouchableOpacity
					style={styles.buttonImage}
					onPress={() => pickImage()}
				>
					{selectedImage ? (
						<Text style={styles.buttonText}> ✔ Upload Image</Text>
					) : (
						<Text style={styles.buttonText}>Upload Image</Text>
					)}
				</TouchableOpacity>
				{selectedImage ? (
					<View
						style={{
							flexDirection: "column",
							alignItems: "center",
							marginTop: 5,
						}}
					>
						<Image
							resizeMode="contain"
							style={{
								width: 100,
								height: 100,
								borderRadius: 10,
								marginTop: 5,
							}}
							source={{
								uri: selectedImage,
							}}
						/>
					</View>
				) : (
					<View
						style={{
							flexDirection: "column",
							alignItems: "center",
							marginTop: 5,
						}}
					>
						<Text>Add Image</Text>
					</View>
				)}

				{/* upload document */}
				<TouchableOpacity
					style={styles.buttonImage}
					onPress={() => pickDocument()}
				>
					{selectedPDF ? (
						<Text style={styles.buttonText}> ✔ Upload PDF</Text>
					) : (
						<Text style={styles.buttonText}>Upload PDF</Text>
					)}
				</TouchableOpacity>
				{selectedPDF ? (
					<View
						style={{
							flexDirection: "column",
							alignItems: "center",
							marginTop: 5,
						}}
					>
						<Text>PDF File: {selectedPDF}</Text>
					</View>
				) : (
					<View
						style={{
							flexDirection: "column",
							alignItems: "center",
							marginTop: 5,
						}}
					>
						<Text>Add PDF File</Text>
					</View>
				)}

				{/* Add button */}
				<TouchableOpacity
					style={styles.buttonSubmit}
					onPress={() => addFunc()}
				>
					{isLoading ? (
						<ActivityIndicator size="large" color="white" />
					) : (
						<Text style={styles.buttonText}>Submit</Text>
					)}
				</TouchableOpacity>

				{/* Reset button */}
				<TouchableOpacity
					style={styles.buttonReset}
					onPress={() => clearAll()}
				>
					<Text style={styles.buttonText}>Reset</Text>
				</TouchableOpacity>

				{/* Cancel button */}
				<TouchableOpacity
					style={styles.buttonCancel}
					onPress={() => navigation.navigate("smList")}
				>
					<Text style={styles.buttonText}>Cancel</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.buttonInvisble}>
					<Text style={styles.buttonText}></Text>
				</TouchableOpacity>
			</ScrollView>
		</TutorFragment>
	);
};

export default SMAdd;

const styles = StyleSheet.create({
	img: {
		width: "64px",
		height: "64px",
	},
	input: {
		backgroundColor: "white",
		width: "100%",
		borderWidth: 1,
		borderRadius: 10,
		padding: 10,
		marginVertical: 10,
	},
	buttonSubmit: {
		backgroundColor: COLORS.green,
		borderRadius: 10,
		height: 40,
		marginTop: 25,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonCancel: {
		backgroundColor: COLORS.darkGray,
		borderRadius: 10,
		height: 40,
		marginTop: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonImage: {
		backgroundColor: COLORS.orange,
		borderRadius: 10,
		height: 40,
		marginTop: 25,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonText: {
		fontWeight: "bold",
		color: "white",
		fontSize: 15,
	},
	buttonInvisble: {
		backgroundColor: COLORS.backgroundGreen,
		borderRadius: 10,
		height: 20,
		marginTop: 25,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonReset: {
		backgroundColor: COLORS.redButton,
		borderRadius: 10,
		height: 40,
		marginTop: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	inputLabel: { fontWeight: "bold", fontSize: 15, marginVertical: 5 },
});
