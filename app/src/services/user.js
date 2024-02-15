import {
  FIREBASE_AUTH,
  FIREBASE_STORAGE,
  FIRESTORE_DB,
} from "../../FirebaseConfig";
import { updateProfile } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { saveMediaToStorage } from "./utils";

export const saveUserProfileImage = (image) =>
  new Promise(async (resolve, reject) => {
    try {
      if (FIREBASE_AUTH.currentUser) {
        const downloadURL = await saveMediaToStorage(
          image,
          `profileImage/${FIREBASE_AUTH.currentUser.uid}`
        );

        const db = getFirestore();
        const userDoc = doc(db, "users", FIREBASE_AUTH.currentUser.uid);

        await updateDoc(userDoc, {
          photoURL: downloadURL,
        });

        // Also update the user profile in Firebase Auth if needed
        // await updateProfile(FIREBASE_AUTH.currentUser, {
        //   photoURL: downloadURL,
        // });

        resolve();
      }
    } catch (error) {
      console.error("Failed to save user profile image: ", error);
      reject(error);
    }
  });
