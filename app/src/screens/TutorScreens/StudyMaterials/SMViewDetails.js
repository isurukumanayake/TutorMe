import { useNavigation, useRoute } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system";
import { doc, docSnap, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import {
	ALERT_TYPE,
	AlertNotificationRoot,
	Dialog,
	Toast,
} from "react-native-alert-notification";
import { FIRESTORE_DB } from "../../../../FirebaseConfig";
import images from "../../../constants/images";
import { COLORS } from "../../../constants/theme";
import { TutorFragment } from "../../../layouts/TutorFragment";

const SMView = () => {
	// variables
	const navigation = useNavigation();
	const [isDownloading, setDownloading] = React.useState(false);
	const route = useRoute();
	const [values, setValues] = useState({
		title: "",
		desc: "",
		category: "",
		downloads: 0,
		author: "",
		imgLink: "",
		pdfLink: "",
	});

	// for download func
	const filename = "TutorMe_PDF-" + values.title;
	const fileUri = `${FileSystem.documentDirectory}${filename}`;
	const uri = values.pdfLink;

	const downDoc = async () => {
		setDownloading(true);

		const downloadedFile = FileSystem.createDownloadResumable(
			uri,
			fileUri
		).downloadAsync();

		if ((await downloadedFile).status != 200) {
			Toast.show({
				type: ALERT_TYPE.DANGER,
				title: "Error",
				textBody: "Download failed..!!",
			});
		}

		const permissions =
			await StorageAccessFramework.requestDirectoryPermissionsAsync();
		if (!permissions.granted) {
			return;
		}

		try {
			const result = await StorageAccessFramework.createFileAsync(
				permissions.directoryUri,
				filename,
				"application/pdf"
			).then(async (uri) => {
				const downloadedContent = await FileSystem.readAsStringAsync(
					(
						await downloadedFile
					).uri,
					{ encoding: FileSystem.EncodingType.Base64 }
				);

				await FileSystem.writeAsStringAsync(uri, downloadedContent, {
					encoding: FileSystem.EncodingType.Base64,
				});
			});
			const docRef = doc(FIRESTORE_DB, `studyMaterials/${route.params.id}`);
			await updateDoc(docRef, { downloads: values.downloads + 1 });
			setValues({ ...values, downloads: values.downloads + 1 });
			setDownloading(false);
			Toast.show({
				type: ALERT_TYPE.SUCCESS,
				title: "Download Complete",
				textBody: "File downloaded successfully..!!",
			});
		} catch (e) {
			console.log(e);
		}
	};

	// load data
	useEffect(() => {
		const fetchDocument = async () => {
			const docRef = doc(FIRESTORE_DB, `studyMaterials/${route.params.id}`);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				setValues(docSnap.data());
			} else {
				console.log("No such document!");
			}
		};

		fetchDocument();
	}, [route.params.id]);

	// render screen
	return (
		<AlertNotificationRoot>
			<>
				<TutorFragment activeLink="profile">
					<View
						style={{
							backgroundColor: COLORS.green,
							height: "10%",
							display: "flex",
							alignItems: "center",
							flexDirection: "row",
						}}
					>
						<TouchableOpacity
							onPress={() => navigation.navigate("studyMaterials")}
						>
							<Image
								source={images.backButton}
								style={{ width: 25, height: 25, marginLeft: 5 }}
							></Image>
						</TouchableOpacity>
						<Text
							style={{
								color: "white",
								fontSize: 25,
								textAlign: "center",
								paddingHorizontal: 95,
							}}
						>
							View Details
						</Text>
					</View>
					<View
						style={{
							flexDirection: "column",
							alignItems: "center",
							marginTop: 20,
						}}
					>
						<Text style={{ fontWeight: "bold", fontSize: 25 }}>
							{values.title}
						</Text>
						<Image
							resizeMode="contain"
							style={{
								width: 200,
								height: 200,
								borderRadius: 10,
								marginTop: 15,
								marginBottom: 25,
								shadowColor: "#000",
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.2,
								shadowRadius: 3.84,
								elevation: 4,
							}}
							source={{
								uri: values.imgLink,
							}}
						/>
					</View>
					<View
						style={{
							flexDirection: "column",
							alignItems: "flex-start",
							marginHorizontal: 5,
							marginBottom: 10,
							marginLeft: 25,
							marginRight: 25,
							padding: 10,
							backgroundColor: COLORS.white,
							borderRadius: 10,
							shadowColor: "#000",
							shadowOffset: {
								width: 0,
								height: 2,
							},
							shadowOpacity: 0.2,
							shadowRadius: 3.84,
							elevation: 4,
						}}
					>
						<View style={{ flexDirection: "row", marginVertical: 5 }}>
							<Text
								style={{
									fontWeight: "bold",
									fontSize: 18,
								}}
							>
								Category:
							</Text>
							<Text
								style={{
									fontSize: 18,
									paddingLeft: 25,
								}}
							>
								{values.category}
							</Text>
						</View>

						<View style={{ flexDirection: "row", marginVertical: 5 }}>
							<Text
								style={{
									fontWeight: "bold",
									fontSize: 18,
								}}
							>
								Downloads:
							</Text>
							<Text
								style={{
									fontSize: 18,
									paddingLeft: 10,
								}}
							>
								{values.downloads}
							</Text>
						</View>

						<View
							style={{
								flexDirection: "column",
								marginVertical: 5,
								flexWrap: "wrap",
							}}
						>
							<Text
								style={{
									fontSize: 18,
									paddingLeft: 0,
									flexWrap: "wrap",
									marginTop: 18,
								}}
							>
								{values.desc}
							</Text>
						</View>
					</View>

					<TouchableOpacity
						style={styles.buttonSubmit}
						onPress={() => downDoc()}
					>
						{isDownloading ? (
							<ActivityIndicator size="large" color="white" />
						) : (
							<Text style={styles.buttonTextDownload}>Download</Text>
						)}
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.buttonCancel}
						onPress={() =>
							navigation.navigate("smEdit", { id: route.params.id })
						}
					>
						<Text style={styles.buttonTextEdit}>Edit</Text>
					</TouchableOpacity>
				</TutorFragment>
			</>
		</AlertNotificationRoot>
	);
};

export default SMView;

const styles = StyleSheet.create({
	buttonSubmit: {
		backgroundColor: COLORS.green,
		borderRadius: 10,
		height: 40,
		marginTop: 25,
		justifyContent: "center",
		marginHorizontal: 10,

		marginTop: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonCancel: {
		backgroundColor: COLORS.blueButton,
		borderRadius: 10,
		height: 40,
		marginTop: 10,
		justifyContent: "center",
		marginHorizontal: 10,
		marginBottom: 10,

		marginTop: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	buttonTextDownload: {
		fontWeight: "bold",
		color: "white",
		fontSize: 15,
	},
	buttonTextEdit: {
		fontWeight: "bold",
		color: "white",
		fontSize: 15,
	},
	buttonTextCancel: {
		fontWeight: "bold",
		color: "white",
		fontSize: 15,
	},
});
