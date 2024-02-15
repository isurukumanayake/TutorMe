import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { deleteDoc, doc, docSnap, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
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

const SMEdit = () => {
	// hooks
	const navigation = useNavigation();
	const route = useRoute();

	// vars
	const [selectedValue, setSelectedValue] = useState();
	const [isLoading, setIsLoading] = useState();
	const [selectedImage, setSelectedImage] = useState();
	const [selectedPDF, setSelectedPDF] = useState();

	// item values
	const [values, setValues] = useState({
		title: "",
		desc: "",
		category: "",
		downloads: 0,
		author: "",
		imgLink:
			"https://i.pinimg.com/736x/14/b8/3e/14b83eace05392ddba1cd00b025b272a.jpg",
		pdfLink:
			"https://ugcportal.com/raman-files/English%20Grammar%20Notes.pdf",
		pdfName: "",
	});

	// clear all
	const clearAll = () => {
		setValues({ ...values, title: " ", category: " ", desc: " " });
		setSelectedValue("Category");
		setSelectedImage(null);
		setSelectedPDF(null);
	};

	// edit function
	const editFunc = async () => {
		setIsLoading(true);
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
			const docRef = doc(FIRESTORE_DB, `studyMaterials/${route.params.id}`);
			await updateDoc(docRef, values);
			navigation.navigate("smList");
			setIsLoading(false);
		}
	};

	// delete function
	const deleteFunc = async () => {
		const docRef = doc(FIRESTORE_DB, `studyMaterials/${route.params.id}`);
		await deleteDoc(docRef, values);
		navigation.navigate("smList");
	};

	// delete alert
	const deleteAlertFunc = async () => {
		Alert.alert(
			"Delete Item",
			"Do you want to delete this item?",
			[
				{
					text: "No",
					style: "cancel",
				},
				{ text: "Yes", onPress: () => deleteFunc() },
			],
			{ cancelable: false }
		);
	};

	useEffect(() => {
		const fetchDocument = async () => {
			const docRef = doc(FIRESTORE_DB, `studyMaterials/${route.params.id}`);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setValues(docSnap.data());
				setSelectedImage(docSnap.data().imgLink);
				setSelectedPDF(docSnap.data().pdfName);
			} else {
				console.log("No such document!");
			}
		};

		fetchDocument();
	}, [route.params.id]);

	// select categories
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

		setValues({
			...values,
			imgLink:
				"https://i.pinimg.com/736x/14/b8/3e/14b83eace05392ddba1cd00b025b272a.jpg",
		});
	};

	// upload document
	const pickDocument = async () => {
		try {
			let response = await DocumentPicker.getDocumentAsync({
				type: "application/pdf",
			});
			setSelectedPDF(response.assets[0].name);
		} catch (err) {
			console.log(err);
		}
		setValues({
			...values,
			pdfLink:
				"https://ugcportal.com/raman-files/English%20Grammar%20Notes.pdf",
		});
	};

	return (
		<TutorFragment activeLink="profile">
			{/*  start header */}
			<View
				style={{
					backgroundColor: COLORS.green,
					height: "10%",
					flexDirection: "row",
					alignContent: "center",
					justifyContent: "center",
				}}
			>
				<Text
					style={{
						color: "white",
						paddingVertical: 19,
						paddingHorizontal: 125,
						fontSize: 25,
					}}
				>
					Edit Details
				</Text>
				<TouchableOpacity
					style={styles.buttonDelete}
					onPress={() => deleteAlertFunc()}
				>
					<Text
						style={{
							paddingLeft: 10,
							fontWeight: "bold",
							color: "white",
							fontSize: 25,
						}}
					>
						🗑
					</Text>
				</TouchableOpacity>
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
					selectedValue={values.category}
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

				{/* Edit button */}
				<TouchableOpacity
					style={styles.buttonSubmit}
					onPress={() => editFunc()}
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

export default SMEdit;

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
		marginTop: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonCancel: {
		backgroundColor: COLORS.warningYellow,
		borderRadius: 10,
		height: 40,
		marginTop: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonDelete: {
		backgroundColor: COLORS.darkGreen,
		borderRadius: 10,
		height: 45,
		width: 45,
		left: -25,
		top: 5,
		marginTop: 10,
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

	buttonInvisble: {
		backgroundColor: COLORS.backgroundGreen,
		borderRadius: 10,
		height: 20,
		marginTop: 25,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonText: {
		fontWeight: "bold",
		color: "white",
		fontSize: 15,
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
