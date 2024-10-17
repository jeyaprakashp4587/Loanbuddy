import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState, useCallback, useEffect } from "react";
import { useData } from "@/context/ContextHook";
import { Colors } from "@/constants/Colors";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Api from "@/Api";
import { useNavigation } from "@react-navigation/native";

const LoanUser = () => {
  const { width, height } = Dimensions.get("window");
  const { selectedLoanHolder, setSelectedLoanHolder, user, setUser } =
    useData();
  const [amount, setAmount] = useState("");
  const nav = useNavigation();
  // Function to add balance
  const handleAddBalance = useCallback(async () => {
    if (amount <= 0) {
      Alert.alert("Enter the Amount first");
      return;
    }
    try {
      const response = await axios.post(`${Api}/LoanHolder/addBalance`, {
        userId: user?._id, // replace with your user ID
        loanHolderName: selectedLoanHolder.LoanHolderName,
        amount: Number(amount),
      });
      if (response.data.message) {
        Alert.alert("Success", "Balance added successfully!");
      }

      setSelectedLoanHolder(response.data.loanHolder);
      setAmount(0);
      setUser(response.data.user);
    } catch (error) {
      Alert.alert("Error", "Failed to add balance");
    }
  });

  // Function to subtract balance
  const handleSubtractBalance = useCallback(async () => {
    if (amount <= 0) {
      Alert.alert(
        "Invalid Amount",
        "Please enter a valid amount greater than zero."
      );
      return;
    }

    try {
      const response = await axios.post(`${Api}/LoanHolder/subtractBalance`, {
        userId: user?._id, // replace with your user ID
        loanHolderName: selectedLoanHolder.LoanHolderName,
        amount: Number(amount),
      });

      // Check for success response
      if (response.status === 200) {
        Alert.alert("Success", "Balance subtracted successfully!");
        setSelectedLoanHolder(response.data.loanHolder);
        setAmount(0); // Reset the amount input
        setUser(response.data.user);
      } else {
        // Handle custom errors from the backend
        Alert.alert("Error", response.data.message || "Something went wrong.");
      }
    } catch (error) {
      // Handle network or server errors
      if (error.response && error.response.status === 400) {
        Alert.alert("Error", error.response.data.message || "Invalid request.");
      } else {
        Alert.alert("Error", "Failed to subtract balance. Please try again.");
      }
    }
  }, [amount, Api, user, selectedLoanHolder]);

  // delete loanHolder
  const deleteLoanHolder = useCallback(async () => {
    Alert.alert(
      "Delete Confirmation",
      "Are you sure you want to delete this loan holder?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await axios.delete(
                `${Api}/LoanHolder/deleteLoanHolder/${user?._id}/${selectedLoanHolder._id}`
              );
              if (res.data) {
                setUser(res.data.user);
              }
              Alert.alert("Success", "Loan holder deleted successfully");
              nav.navigate("tab");
            } catch (error) {
              Alert.alert("Error", "Failed to delete loan holder");
            }
          },
        },
      ]
    );
  }, [selectedLoanHolder]);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    setLoad(true);
  }, [200]);

  if (!load) {
    return <ActivityIndicator size={50} color="black" />;
  }

  return (
    <View style={{ paddingHorizontal: 20, backgroundColor: "white", flex: 1 }}>
      {/* head */}
      <Text
        style={{
          fontSize: width * 0.06,
          color: Colors.mildGrey,
          letterSpacing: 1,
          marginTop: 10,
        }}
      >
        Loan Holder Details
      </Text>
      {/* details card */}
      <View
        style={{
          height: height * 0.3,
          borderWidth: 0,
          borderRadius: 10,
          overflow: "hidden",
          elevation: 2,
          marginTop: 20,
        }}
      >
        <View
          style={{ borderWidth: 0, backgroundColor: "white", height: "30%" }}
        />
        <Image
          source={{
            uri: selectedLoanHolder?.LoanHolderProfileImg
              ? selectedLoanHolder?.LoanHolderProfileImg
              : "https://i.ibb.co/TgdT1DW/pro.jpg",
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            position: "absolute",
            top: height * 0.02,
            left: width * 0.3,
            zIndex: 10,
            borderWidth: 5,
            borderColor: "white",
          }}
        />
        <View
          style={{
            // borderWidth: 1,
            // flex: 2,
            height: "50%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "hsl(0, 0%, 98%)",
            paddingHorizontal: 20,
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: width * 0.06,
              fontWeight: "600",
              letterSpacing: 1,
            }}
          >
            <Text
              style={{
                fontSize: width * 0.02,
                letterSpacing: 1,
              }}
            >
              Name:
            </Text>
            {selectedLoanHolder?.LoanHolderName}
          </Text>
          <Text
            style={{ letterSpacing: 1, color: "orange", fontWeight: "600" }}
          >
            <Text
              style={{
                fontSize: width * 0.02,
                color: "black",
                letterSpacing: 1,
              }}
            >
              Balance:{" "}
            </Text>
            RS:{selectedLoanHolder?.LoanHolderBalance}/-
          </Text>
        </View>
        <Pressable
          onPress={deleteLoanHolder}
          style={{
            backgroundColor: "#004080",
            height: "20%",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: Colors.white,
              letterSpacing: 1,
              textAlign: "center",
              // padding: 10,
            }}
          >
            Delete Loan Holder
          </Text>
        </Pressable>
      </View>
      {/* operations */}
      <View style={{ marginTop: 30 }}>
        <TextInput
          keyboardType="numeric"
          label="Enter Amount"
          value={amount}
          onChangeText={(text) => setAmount(text)}
          style={{ backgroundColor: "white" }}
          outlineStyle={{ borderWidth: 1, borderColor: Colors.veryLightGrey }}
          mode="outlined"
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            columnGap: 20,
            marginTop: 10,
          }}
        >
           <TouchableOpacity
            onPress={handleSubtractBalance}
            style={{
              backgroundColor: "black",
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "white" }}>Balance</Text>
            <FontAwesomeIcon icon={faMinus} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAddBalance}
            style={{
              backgroundColor: "white",
              flex: 1,
              borderRadius: 5,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              padding: 10,
              borderColor: Colors.mildGrey,
              borderWidth: 1,
            }}
          >
            <Text style={{ color: "black" }}>Balance</Text>
            <FontAwesomeIcon icon={faPlus} color="black" />
          </TouchableOpacity>
         
        </View>
      </View>
      {/* history */}
      <Text
        style={{
          fontSize: width * 0.05,
          color: Colors.mildGrey,
          letterSpacing: 1,
          marginTop: 30,
        }}
      >
        Loan History
      </Text>
      {selectedLoanHolder?.LoanHolderHistory?.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ marginTop: 10 }}
          data={selectedLoanHolder?.LoanHolderHistory}
          renderItem={({ item }) => (
            <View
              style={{
                borderWidth: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
                padding: 10,
                borderColor: Colors.veryLightGrey,
              }}
            >
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    color: Colors.mildGrey,
                    letterSpacing: 1,
                    fontSize: width * 0.025,
                  }}
                >
                  Type:{" "}
                  <Text
                    style={{
                      color: "#004080",
                      fontWeight: "900",
                      letterSpacing: 1,
                      fontSize: width * 0.03,
                    }}
                  >
                    {item?.LoanType}
                  </Text>
                </Text>
              </View>
              <View style={{ flexDirection: "column" }}>
                <Text
                  style={{
                    color: Colors.mildGrey,
                    letterSpacing: 1,
                    fontSize: width * 0.025,
                  }}
                >
                  Amount:{" "}
                  <Text
                    style={{
                      color: "orange",
                      fontWeight: "900",
                      letterSpacing: 1,
                      fontSize: width * 0.03,
                    }}
                  >
                    RS {item?.LoanBalance}/-
                  </Text>
                </Text>
                <Text
                  style={{
                    color: Colors.mildGrey,
                    letterSpacing: 1,
                    fontSize: width * 0.025,
                  }}
                >
                  Time:{" "}
                  <Text
                    style={{
                      color: Colors.violet,
                      fontWeight: "900",
                      letterSpacing: 1,
                      fontSize: width * 0.03,
                    }}
                  >
                    {item?.Time}
                  </Text>
                </Text>
              </View>
            </View>
          )}
        />
      ) : (
        <Text>History is empty</Text>
      )}
    </View>
  );
};

export default LoanUser;
