import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { ActivityIndicator } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Api from "@/Api";
import { useData } from "@/context/ContextHook";
import * as Updates from "expo-updates";
const SplashScreen = () => {
  const { width, height } = Dimensions.get("window");
  const nav = useNavigation();
  const { setUser } = useData();
  async function onFetchUpdateAsync() {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (error) {
      // You can also add an alert() to see the error message in case of an error when fetching updates.
      alert(`Error fetching latest Expo update: ${error}`);
    }
  }
  useEffect(() => {
    onFetchUpdateAsync();
  }, []);
  useEffect(() => {
    AsyncStorage.getItem("userId").then(async (data) => {
      if (data) {
        const res = await axios.get(`${Api}/login/valid/${data}`);
        if (res.data) {
          //   console.log("log from splash", res.data);
          setUser(res.data);
          nav.navigate("tab");
        }
      } else {
        nav.navigate("login");
      }
    });
  }, []);

  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ flexDirection: "column", rowGap: 50 }}>
        {/* <Text style={{ fontWeight: "700", fontSize: width * 0.1 }}>
          Loan Buddy.
        </Text> */}
        <Image
          source={{ uri: "https://i.ibb.co/zb7trJX/Money.png" }}
          style={{ width: width * 0.4, height: height * 0.4 }}
        />
        <ActivityIndicator
          animating={true}
          size={40}
          color={Colors.veryDarkGrey}
        />
      </View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
