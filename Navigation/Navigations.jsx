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
  faSuitcase,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";

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
        tabBarActiveTintColor: "#3385ff",
        tabBarInactiveTintColor: Colors.lightGrey,
        tabBarStyle: {
          height: height * 0.1,
          paddingBottom: 10,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
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
        name="loanUsers"
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
        component={Home}
        options={{
          headerShadow: false,
          tabBarIcon: ({ color }) => (
            <FontAwesomeIcon icon={faHome} color={color} size={width * 0.06} />
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
      initialRouteName="tab"
    >
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="tab" component={TabNavigation} />
      <Stack.Screen name="signIn" component={SignIn} />
    </Stack.Navigator>
  );
};
export default Navigation;
