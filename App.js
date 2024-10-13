import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { ProviderContext } from "./context/ContextHook";
import { StackNavigation } from "./Navigation/Navigations";
const App = () => {
  return (
    <ProviderContext>
      <SafeAreaView>
        <StackNavigation />
      </SafeAreaView>
    </ProviderContext>
  );
};

export default App;

const styles = StyleSheet.create({});
