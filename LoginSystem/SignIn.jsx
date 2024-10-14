import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import { TextInput } from "react-native-paper";
import { Colors } from "@/constants/Colors";

const SignIn = () => {
  const { width, height } = Dimensions.get("window");

  // useRef for storing input values
  const storeNameRef = useRef(null);
  const phoneNumberRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

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

    // Access the ref values to perform validation
    const storeNameValue = storeNameRef.current?.value || "";
    const phoneNumberValue = phoneNumberRef.current?.value || "";
    const passwordValue = passwordRef.current?.value || "";
    const confirmPasswordValue = confirmPasswordRef.current?.value || "";

    // Store name validation (checking if it is empty)
    if (storeNameValue.trim().length === 0) {
      newErrors.storeName = true;
      isValid = false;
    }

    // Phone number length validation (must be exactly 10 digits)
    if (phoneNumberValue.length !== 10 || isNaN(phoneNumberValue)) {
      newErrors.phoneNumber = true;
      isValid = false;
    }

    // Password length validation
    if (passwordValue.length < 6) {
      newErrors.password = true;
      isValid = false;
    }

    // Confirm password match validation
    if (passwordValue !== confirmPasswordValue) {
      newErrors.confirmPassword = true;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  });

  // Handle SignIn button press
  const handleSignIn = useCallback(() => {
    const isFormValid = validateForm();
    if (isFormValid) {
      // Proceed with the form submission (e.g., API call)
      console.log("Form is valid, proceed with sign in...");
    } else {
      console.log("Form is invalid, show errors.");
    }
  });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
      }}
    >
      <Image
        source={{ uri: "https://i.ibb.co/vVGLXYH/2395528-13972.jpg" }}
        style={{
          width: width * 0.6,
          height: height * 0.09,
          position: "absolute",
          // zIndex: 10,
          top: height * 0.22,
          right: 0,
        }}
      />
      <View
        style={{
          width: "100%",
          padding: 20,
          flexDirection: "column",
          rowGap: 10,
          backgroundColor: "white",
          elevation: 3,
        }}
      >
        <TextInput
          label="Enter Store Name"
          mode="outlined"
          ref={storeNameRef} // Attach ref to TextInput
          activeOutlineColor={Colors.lightGrey}
          underlineColor={Colors.lightGrey}
          outlineStyle={{
            borderWidth: 1,
            borderColor: errors.storeName ? "red" : Colors.lightGrey,
          }}
          style={{ backgroundColor: "white" }}
        />
        {errors.storeName && (
          <Text style={{ color: "red", fontSize: 12 }}>
            Store name is required.
          </Text>
        )}
        <TextInput
          label="Enter Phone Number"
          mode="outlined"
          ref={phoneNumberRef} // Attach ref to TextInput
          keyboardType="numeric" // Ensures only numbers can be typed
          activeOutlineColor={Colors.lightGrey}
          underlineColor={Colors.lightGrey}
          outlineStyle={{
            borderWidth: 1,
            borderColor: errors.phoneNumber ? "red" : Colors.lightGrey,
          }}
          style={{ backgroundColor: "white" }}
        />
        {errors.phoneNumber && (
          <Text style={{ color: "red", fontSize: 12 }}>
            Phone number must be exactly 10 digits.
          </Text>
        )}
        <TextInput
          label="Create Password"
          mode="outlined"
          ref={passwordRef} // Attach ref to TextInput
          secureTextEntry
          activeOutlineColor={Colors.lightGrey}
          underlineColor={Colors.lightGrey}
          outlineStyle={{
            borderWidth: 1,
            borderColor: errors.password ? "red" : Colors.lightGrey,
          }}
          style={{ backgroundColor: "white" }}
        />
        {errors.password && (
          <Text style={{ color: "red", fontSize: 12 }}>
            Password must be at least 6 characters long.
          </Text>
        )}
        <TextInput
          label="Confirm Password"
          mode="outlined"
          ref={confirmPasswordRef} // Attach ref to TextInput
          secureTextEntry
          activeOutlineColor={Colors.lightGrey}
          underlineColor={Colors.lightGrey}
          outlineStyle={{
            borderWidth: 1,
            borderColor: errors.confirmPassword ? "red" : Colors.lightGrey,
          }}
          style={{ backgroundColor: "white" }}
        />
        {errors.confirmPassword && (
          <Text style={{ color: "red", fontSize: 12 }}>
            Passwords do not match.
          </Text>
        )}
        <TouchableOpacity
          onPress={handleSignIn}
          style={{
            flexDirection: "column",
            width: "100%",
            borderRadius: 5,
          }}
        >
          <Text
            style={{
              backgroundColor: Colors.veryLightGrey,
              padding: 10,
              textAlign: "center",
            }}
          >
            Sign In
          </Text>
        </TouchableOpacity>
      </View>
      <Image
        source={{ uri: "https://i.ibb.co/vVGLXYH/2395528-13972.jpg" }}
        style={{
          width: width * 0.6,
          height: height * 0.09,
          position: "absolute",
          zIndex: -10,
          top: height * 0.7,
          left: 0,
        }}
      />
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({});
