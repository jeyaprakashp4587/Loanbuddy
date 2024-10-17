import { StatusBar, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect } from "react";
import { ProviderContext } from "./context/ContextHook";
import Navigation from "./Navigation/Navigations";

const App = () => {
  return (
    <ProviderContext>
      <SafeAreaView
        style={{ borderWidth: 0, width: "100%", height: "100%", flex: 1 }}
      >
        <Navigation />
        <StatusBar backgroundColor="white" barStyle="dark-content" />
      </SafeAreaView>
    </ProviderContext>
  );
};

export default App;

const styles = StyleSheet.create({});
