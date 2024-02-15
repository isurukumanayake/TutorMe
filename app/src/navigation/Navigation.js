import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import UserContext from "../contexts/UserContext";

//common
import Login from "../screens/Login";
import SignUpOptions from "../screens/SignUpOptions";
import StudentSignUp from "../screens/StudentSignUp";
import TutorSignUp from "../screens/TutorSignUp";

//student
import StudentHome from "../screens/StudentScreens/StudentHome";
import CategorySearch from "../screens/StudentScreens/CategorySearch";
import StudyMaterials from "../screens/StudentScreens/StudyMaterials";
import StudentProfile from "../screens/StudentScreens/StudentProfile";
import ClassSearchResults from "../screens/StudentScreens/ClassSearchResults";
import RequestSession from "../screens/StudentScreens/RequestSession";
import MySessions from "../screens/StudentScreens/MySessions";
import SessionDetails from "../screens/StudentScreens/SessionDetails";
import EditSession from "../screens/StudentScreens/EditSession";
import ClassDetailsView from "../screens/StudentScreens/ClassDetailsView";
import SMDetails from "../screens/StudentScreens/StudentMaterialsDetails";

//tutor
import TutorHome from "../screens/TutorScreens/TutorHome";
import MyClasses from "../screens/TutorScreens/MyClasses";
import MyCalendar from "../screens/TutorScreens/MyCalendar";
import TutorProfile from "../screens/TutorScreens/TutorProfile";
import NewRequests from "../screens/TutorScreens/NewRequests";
import SingleNewRequest from "../screens/TutorScreens/SingleNewRequest";
import ClassDetails from "../screens/TutorScreens/ClassDetails";
import AddClass from "../screens/TutorScreens/AddClass";
import EditClassDetails from "../screens/TutorScreens/EditClassDetails";
import TutorSessions from "../screens/TutorScreens/TutorSessions";
import BookedClasses from "../screens/TutorScreens/BookedClasses";
import SingleBooked from "../screens/TutorScreens/SingleBooked";
import CompletedClasses from "../screens/TutorScreens/CompletedClasses";
import EditProfile from "../screens/TutorScreens/EditProfile";
import ForgetPassword from "../screens/ForgetPassword";
import IncompleteHome from "../screens/TutorScreens/IncompleteHome";
import AddStudyMaterial from "../screens/TutorScreens/StudyMaterials/SMAdd";
import EditStudyMaterial from "../screens/TutorScreens/StudyMaterials/SMEdit";
import StudyMaterialsList from "../screens/TutorScreens/StudyMaterials/SMList";
import ViewStudyMaterial from "../screens/TutorScreens/StudyMaterials/SMViewDetails";
import IncompleteForm from "../screens/TutorScreens/IncompleteForm";
import RestrictedTutorProfile from "../screens/TutorScreens/RestrictedTutorProfile";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function IncompleteTutorTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={() => null}>
      <Tab.Screen name="incompleteHome" component={IncompleteHome} />
      <Tab.Screen name="incompleteForm" component={IncompleteForm} />
      <Tab.Screen
        name="restrictedTutorProfile"
        component={RestrictedTutorProfile}
      />
    </Tab.Navigator>
  );
}

function TutorTabs() {
  const { userData, setUserData } = useContext(UserContext);
  console.log(userData);
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={() => null}>
      {userData.isCompleted !== "true" && (
        <Tab.Screen name="incomplete" component={IncompleteTutorTabs} />
      )}
      <Tab.Screen name="home" component={TutorHome} />
      <Tab.Screen name="myClasses" component={MyClasses} />
      <Tab.Screen name="calendar" component={MyCalendar} />
      <Tab.Screen name="profile" component={TutorProfile} />
      <Tab.Screen name="newRequests" component={NewRequests} />
      <Tab.Screen name="singleNewRequest" component={SingleNewRequest} />
      <Tab.Screen name="classDetails" component={ClassDetails} />
      <Tab.Screen name="addClass" component={AddClass} />
      <Tab.Screen name="editClassDetails" component={EditClassDetails} />
      <Tab.Screen name="mySessions" component={TutorSessions} />
      <Tab.Screen name="bookedClasses" component={BookedClasses} />
      <Tab.Screen name="singleBooked" component={SingleBooked} />
      <Tab.Screen name="completedClasses" component={CompletedClasses} />
      <Tab.Screen name="smList" component={StudyMaterialsList} />
      <Tab.Screen name="smAdd" component={AddStudyMaterial} />
      <Tab.Screen name="smEdit" component={EditStudyMaterial} />
      <Tab.Screen name="smView" component={ViewStudyMaterial} />
    </Tab.Navigator>
  );
}

function TutorInside() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="main"
    >
      <Stack.Screen name="main" component={TutorTabs} />
      <Stack.Screen name="editProfile" component={EditProfile} />
      {/* other tutor screeens which doesn't contain bottom navigation bar */}
    </Stack.Navigator>
  );
}

function StudentTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={() => null}>
      <Tab.Screen name="home" component={StudentHome} />
      <Tab.Screen name="search" component={CategorySearch} />
      <Tab.Screen name="studyMaterials" component={StudyMaterials} />
      <Tab.Screen name="profile" component={StudentProfile} />
      <Tab.Screen name="smView" component={SMDetails} />
    </Tab.Navigator>
  );
}

function StudentInside() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="main"
    >
      <Stack.Screen name="main" component={StudentTabs} />
      {/* other student screeens which doesn't contain bottom navigation bar */}
      <Stack.Screen name="classDetails" component={ClassDetailsView} />
      <Stack.Screen name="requestSession" component={RequestSession} />
      <Stack.Screen name="mySessions" component={MySessions} />
      <Stack.Screen name="sessionDetails" component={SessionDetails} />
      <Stack.Screen name="searchResults" component={ClassSearchResults} />
      <Stack.Screen name="editSession" component={EditSession} />
    </Stack.Navigator>
  );
}

function CommonTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={() => null}>
      <Tab.Screen name="login" component={Login} />
      <Tab.Screen name="signUpOptions" component={SignUpOptions} />
      <Tab.Screen name="studentSignUp" component={StudentSignUp} />
      <Tab.Screen name="tutorSignUp" component={TutorSignUp} />
      <Tab.Screen name="forgotPassword" component={ForgetPassword} />
    </Tab.Navigator>
  );
}

function CommonInside() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="login"
    >
      <Stack.Screen name="main" component={CommonTabs} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  // const [user, setUser] = useState(null); //set useState() for login screen
  // const [userType, setUserType] = useState("tutor"); //switch between student and tutor

  const { userData, setUserData } = useContext(UserContext);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="login"
        screenOptions={{ headerShown: false, statusBarColor: "green" }}
      >
        {userData !== null ? (
          userData.role === "student" ? (
            <Stack.Screen name="studentInside" component={StudentInside} />
          ) : (
            <Stack.Screen name="tutorInside" component={TutorInside} />
          )
        ) : (
          <Stack.Screen name="commonInside" component={CommonInside} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
