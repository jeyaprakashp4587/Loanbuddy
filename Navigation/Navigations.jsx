import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../Screens/Home";
import Login from "../LoginSystem/Login";
import SignIn from "../LoginSystem/SignIn";
import { Colors } from "../constants/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faBell,
  faHome,
  faPlus,
  faShop,
  faSuitcase,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import Entypo from "@expo/vector-icons/Entypo";
import LoanUser from "../Screens/LoanUser";
import User from "../Screens/User";
import SplashScreen from "../Screens/SplashScreen";
import AddMember from "../Screens/AddMember";
import Add from "../Screens/Add";

const { width, height } = Dimensions.get("window");
const TabNavigation = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      detachInactiveScreens={true}
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarIconStyle: {
          color: Colors.lightGrey,
        },
        tabBarActiveTintColor: "#004080",
        tabBarInactiveTintColor: Colors.lightGrey,
        tabBarStyle: {
          height: height * 0.1,
          paddingBottom: 10,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: width * 0.025,
          marginTop: -15,
          marginBottom: 5,
          color: Colors.veryDarkGrey,
          letterSpacing: 1,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          headerShadow: false,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faHome} color={color} size={width * 0.06} />
          ),
        }}
      />

      <Tab.Screen
        name="user"
        component={User}
        options={{
          headerShadow: false,
          tabBarIcon: ({ color }) => (
            <Entypo name="shop" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
      initialRouteName="add"
    >
      <Stack.Screen name="splash" component={SplashScreen} />
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="tab" component={TabNavigation} />
      <Stack.Screen name="signIn" component={SignIn} />
      <Stack.Screen name="loanUser" component={LoanUser} />
      <Stack.Screen name="addMember" component={AddMember} />
      <Stack.Screen name="add" component={Add} />
    </Stack.Navigator>
  );
};
export default Navigation;
