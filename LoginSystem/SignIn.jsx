import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useCallback } from "react";
import { TextInput } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import Api from "../Api";
import { useNavigation } from "@react-navigation/native";

const SignIn = () => {
  const { width, height } = Dimensions.get("window");
  const nav = useNavigation();
  // States to handle form inputs
  const [storeName, setStoreName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    storeName: false,
    phoneNumber: false,
    password: false,
    confirmPassword: false,
  });

  // Validation function
  const validateForm = useCallback(() => {
    let isValid = true;
    const newErrors = {
      storeName: false,
      phoneNumber: false,
      password: false,
      confirmPassword: false,
    };

    // Store name validation (checking if it is empty)
    if (storeName.trim().length === 0) {
      newErrors.storeName = true;
      isValid = false;
    }

    // Phone number length validation (must be exactly 10 digits)
    if (phoneNumber.length !== 10 || isNaN(phoneNumber)) {
      newErrors.phoneNumber = true;
      isValid = false;
    }

    // Password length validation
    if (password.length < 6) {
      newErrors.password = true;
      isValid = false;
    }

    // Confirm password match validation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = true;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [storeName, phoneNumber, password, confirmPassword]);

  // Handle SignIn button press
  const handleSignIn = useCallback(async () => {
    const isFormValid = validateForm();
    if (isFormValid) {
      // Proceed with the form submission (e.g., API call)
      try {
        const res = await axios.post(`${Api}/login/signIn`, {
          storeName,
          phoneNumber,
          password,
        });

        if (res.status === 201) {
          // Navigate to login screen after successful sign-in
          nav.navigate("login");
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          // Phone number already exists
          Alert.alert("Phone number already exists");
          console.log(error.response.data.message); // Log the error message
        } else {
          // Handle other errors (e.g., network issues or server errors)
          Alert.alert("Something went wrong, please try again.");
          console.log(error);
        }
      }
    } else {
      // Show validation errors
    }
  }, [storeName, phoneNumber, password, validateForm]);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://i.ibb.co/vVGLXYH/2395528-13972.jpg" }}
        style={styles.topImage(width, height)}
      />
      <View style={styles.form}>
        <TextInput
          label="Enter Store Name"
          mode="outlined"
          value={storeName}
          onChangeText={setStoreName} // Manage state
          activeOutlineColor={Colors.lightGrey}
          outlineStyle={styles.outlineStyle(errors.storeName)}
          style={styles.inputStyle}
        />
        {errors.storeName && (
          <Text style={styles.errorText}>Store name is required.</Text>
        )}

        <TextInput
          label="Enter Phone Number"
          mode="outlined"
          value={phoneNumber}
          onChangeText={setPhoneNumber} // Manage state
          keyboardType="numeric"
          activeOutlineColor={Colors.lightGrey}
          outlineStyle={styles.outlineStyle(errors.phoneNumber)}
          style={styles.inputStyle}
        />
        {errors.phoneNumber && (
          <Text style={styles.errorText}>
            Phone number must be exactly 10 digits.
          </Text>
        )}

        <TextInput
          label="Create Password"
          mode="outlined"
          value={password}
          onChangeText={setPassword} // Manage state
          secureTextEntry
          activeOutlineColor={Colors.lightGrey}
          outlineStyle={styles.outlineStyle(errors.password)}
          style={styles.inputStyle}
        />
        {errors.password && (
          <Text style={styles.errorText}>
            Password must be at least 6 characters long.
          </Text>
        )}

        <TextInput
          label="Confirm Password"
          mode="outlined"
          value={confirmPassword}
          onChangeText={setConfirmPassword} // Manage state
          secureTextEntry
          activeOutlineColor={Colors.lightGrey}
          outlineStyle={styles.outlineStyle(errors.confirmPassword)}
          style={styles.inputStyle}
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>Passwords do not match.</Text>
        )}

        <TouchableOpacity onPress={handleSignIn} style={styles.signInButton}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={{ uri: "https://i.ibb.co/vVGLXYH/2395528-13972.jpg" }}
        style={styles.bottomImage(width, height)}
      />
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  form: {
    width: "100%",
    padding: 20,
    backgroundColor: "white",
    elevation: 3,
    flexDirection: "column",
    rowGap: 10,
  },
  inputStyle: {
    backgroundColor: "white",
  },
  outlineStyle: (isError) => ({
    borderWidth: 1,
    borderColor: isError ? "red" : Colors.lightGrey,
  }),
  errorText: {
    color: "red",
    fontSize: 12,
  },
  signInButton: {
    flexDirection: "column",
    width: "100%",
    borderRadius: 5,
  },
  signInText: {
    backgroundColor: Colors.veryLightGrey,
    padding: 10,
    textAlign: "center",
  },
  topImage: (width, height) => ({
    width: width * 0.6,
    height: height * 0.09,
    position: "absolute",
    top: height * 0.22,
    right: 0,
  }),
  bottomImage: (width, height) => ({
    width: width * 0.6,
    height: height * 0.09,
    position: "absolute",
    zIndex: -10,
    top: height * 0.7,
    left: 0,
  }),
});
