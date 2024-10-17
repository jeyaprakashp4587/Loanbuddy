import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useData } from "@/context/ContextHook";
import { Colors } from "@/constants/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const User = () => {
  const { user } = useData();
  const { height, width } = Dimensions.get("window");
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 20,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: width * 0.9,
          borderWidth: 1,
          height: height * 0.3,
          borderRadius: 10,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          rowGap: 20,
        }}
      >
        {/* edit photo icon */}

        <Image
          source={{ uri: user?.storeImg }}
          style={{ width: 120, height: 120, borderRadius: 55 }}
        />
        <Text
          style={{
            textAlign: "center",
            letterSpacing: 2,
            color: Colors.mildGrey,
            fontWeight: "600",
          }}
        >
          {user?.storeName}
        </Text>
        <Text
          style={{
            textAlign: "center",
            letterSpacing: 2,
            color: "orange",
            fontWeight: "600",
          }}
        >
          Total No of Loan Holders: {user?.LoanHolders?.length}
        </Text>
      </View>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({});
