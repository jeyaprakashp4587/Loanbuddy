import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../Screens/Home";
import Login from "../LoginSystem/Login";
import SignIn from "../LoginSystem/SignIn";

const TabNavigation = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator initialRouteName="home" detachInactiveScreens={true}>
      <Tab.Screen
        name="home"
        component={Home}
        options={{
          headerShadow: false,
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
      initialRouteName="signIn"
    >
      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="tab" component={TabNavigation} />
      <Stack.Screen name="signIn" component={SignIn} />
    </Stack.Navigator>
  );
};
export default Navigation;
