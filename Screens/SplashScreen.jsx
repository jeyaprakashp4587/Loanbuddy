import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { ActivityIndicator } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Api from "@/Api";
import { useData } from "@/context/ContextHook";

const SplashScreen = () => {
  const { width, height } = Dimensions.get("window");
  const nav = useNavigation();
  const { setUser } = useData();
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
        <Text style={{ fontWeight: "700", fontSize: width * 0.1 }}>
          Loan Buddy.
        </Text>
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
