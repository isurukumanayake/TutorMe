// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCag4DIyaKo4L3D_9jYPXmz3ZEKqe7udMo",
  authDomain: "tutorme-ef18e.firebaseapp.com",
  projectId: "tutorme-ef18e",
  storageBucket: "tutorme-ef18e.appspot.com",
  messagingSenderId: "443379573495",
  appId: "1:443379573495:web:9183e529cc50b5fbf9e9f2",
  measurementId: "G-KDKDX45K6J",
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
