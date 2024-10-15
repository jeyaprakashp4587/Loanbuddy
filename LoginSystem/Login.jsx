import {
  Alert,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Async,
} from "react-native";
import React, { useState, useCallback } from "react";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import Api from "../Api"; // Ensure this points to your backend URL
import { useNavigation } from "@react-navigation/native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useData } from "@/context/ContextHook";

const Login = () => {
  const { width, height } = Dimensions.get("window");
  const nav = useNavigation();
  const { setUser } = useData();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    phoneNumber: false,
    password: false,
  });
  const [actiIndi, setActiIndi] = useState(false);

  // Validation function
  const validateForm = useCallback(() => {
    let isValid = true;
    const newErrors = {
      phoneNumber: false,
      password: false,
    };

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

    setErrors(newErrors);
    return isValid;
  }, [phoneNumber, password]);

  // Handle Login button press
  const handleLogin = useCallback(async () => {
    setActiIndi(true);
    const isFormValid = validateForm();
    if (isFormValid) {
      try {
        const res = await axios.post(`${Api}/login/signUp`, {
          phoneNumber,
          password,
        });

        if (res.status === 200) {
          await AsyncStorage.setItem("userId", res.data._id);
          if (res.data) {
            setUser(res.data);
          }
          // Navigate to the home screen upon successful login
          nav.navigate("tab"); // Replace "home" with the appropriate screen
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          setActiIndi(false);
          // Wrong phone number or password
          Alert.alert(error.response.data.message);
        } else {
          Alert.alert("Something went wrong, please try again.");
          console.log(error);
        }
      }
    }
  }, [phoneNumber, password, validateForm]);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: "https://i.ibb.co/vVGLXYH/2395528-13972.jpg" }}
        style={styles.topImage(width, height)}
      />

      <View style={styles.form}>
        <TextInput
          label="Enter Phone Number"
          mode="outlined"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
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
          label="Enter Password"
          mode="outlined"
          value={password}
          onChangeText={setPassword}
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

        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={{ uri: "https://i.ibb.co/vVGLXYH/2395528-13972.jpg" }}
        style={styles.bottomImage(width, height)}
      />
      <Text
        onPress={() => nav.navigate("signIn")}
        style={{
          color: Colors.violet,
          textDecorationLine: "underline",
          letterSpacing: 1,
          marginTop: 10,
        }}
      >
        Don't Have an account
      </Text>
      {actiIndi && (
        <ActivityIndicator
          color={Colors.mildGrey}
          size={40}
          style={{ position: "absolute", bottom: height * 0.2 }}
        />
      )}
    </View>
  );
};

export default Login;

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
  loginButton: {
    flexDirection: "column",
    width: "100%",
    borderRadius: 5,
  },
  loginText: {
    backgroundColor: Colors.veryLightGrey,
    padding: 10,
    textAlign: "center",
  },
  topImage: (width, height) => ({
    width: width * 0.6,
    height: height * 0.09,
    position: "absolute",
    top: height * 0.32,
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
