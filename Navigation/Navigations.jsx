import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../Screens/Home";
import Login from "../LoginSystem/Login";

const TabNavigation = () => {
  const TabNavigation = createBottomTabNavigator();
  return (
    <TabNavigation.Navigator>
      <TabNavigation.Screen name="home" component={Home} />
    </TabNavigation.Navigator>
  );
};

const StackNavigation = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="index" component={TabNavigation} />
      <Stack.Screen name="login" component={Login} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
