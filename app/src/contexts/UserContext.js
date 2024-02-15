import React, { createContext, useState, useEffect } from "react";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    try {
      const userId = FIREBASE_AUTH.currentUser.uid;
      const userDocRef = doc(FIRESTORE_DB, "users", userId);
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        setUserData(userData);
      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    // Detect login and logout events
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      if (user) {
        // User is logged in, fetch user data
        fetchUserData();
      } else {
        // User is logged out, set user data to null
        setUserData(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
