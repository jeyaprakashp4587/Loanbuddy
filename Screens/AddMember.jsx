import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors } from "@/constants/Colors";
import { TextInput } from "react-native-paper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import axios from "axios";
import { storage } from "../Firebase/FireBase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Ensure this points to your firebase config
import Api from "@/Api";

const AddMember = () => {
  const { width } = Dimensions.get("window");
  const [loanHolderName, setLoanHolderName] = useState("");
  const [loanHolderAmount, setLoanHolderAmount] = useState("");
  const [image, setImage] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [showCamera, setShowCamera] = useState(false); // For toggling camera view

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setCameraPermission(status === "granted");
    })();
  }, []);

  const openCamera = async () => {
    setShowCamera(true); // Show the camera when this is called
  };

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setImage(photo.uri);
      setShowCamera(false); // Hide camera after taking the picture
    }
  };

  const uploadImageToFirebase = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const fileName = uri.split("/").pop();
      const ref = storage.ref().child(`loanHolders/${fileName}`);
      await ref.put(blob);
      const downloadUrl = await ref.getDownloadURL();
      return downloadUrl;
    } catch (error) {
      console.error("Error uploading image to Firebase:", error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!loanHolderName || !loanHolderAmount) {
      Alert.alert("Please fill all the fields");
      return;
    }

    try {
      // Upload image to Firebase
      const imageUrl = await uploadImageToFirebase(image);

      // API request to save loan holder details
      const response = await axios.post(`${Api}/LoanHolder/AddLoanHolder`, {
        loanHolderName,
        loanHolderAmount,
        loanHolderProfileImg: imageUrl, // Image URL from Firebase
      });

      if (response.status === 200) {
        Alert.alert("Loan holder details saved successfully!");
      }
    } catch (error) {
      console.error("Error saving loan holder details:", error);
      Alert.alert("Failed to save loan holder details.");
    }
  };

  if (cameraPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }
  if (cameraPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {showCamera ? (
        // Conditionally render the Camera instead of using Modal
        <Camera style={{ flex: 1 }} ref={(ref) => setCameraRef(ref)}>
          <View style={styles.cameraContainer}>
            <TouchableOpacity
              onPress={takePicture}
              style={styles.captureButton}
            >
              <Text style={styles.cameraButtonText}>Capture</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowCamera(false)}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Camera>
      ) : (
        // Render the normal form if camera is not active
        <View style={styles.form}>
          <Text style={styles.headerText}>Add Loan Holder Info</Text>
          <TextInput
            label="Enter Loan Holder Name"
            mode="outlined"
            value={loanHolderName}
            onChangeText={setLoanHolderName}
            activeOutlineColor={Colors.lightGrey}
            style={{ backgroundColor: "white" }}
            outlineStyle={{ borderWidth: 1 }}
          />
          <TextInput
            label="Enter Loan Holder Amount"
            mode="outlined"
            value={loanHolderAmount}
            onChangeText={setLoanHolderAmount}
            keyboardType="numeric"
            activeOutlineColor={Colors.lightGrey}
            style={{ backgroundColor: "white" }}
            outlineStyle={{ borderWidth: 1 }}
          />
          <TouchableOpacity onPress={openCamera} style={styles.cameraButton}>
            <FontAwesomeIcon icon={faCamera} size={20} color="white" />
            <Text style={styles.cameraButtonText}>Take a Photo</Text>
          </TouchableOpacity>

          {image && (
            <Image source={{ uri: image }} style={styles.previewImage} />
          )}

          <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AddMember;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  form: {
    flex: 1,
    flexDirection: "column",
    rowGap: 20,
    marginTop: 50,
  },
  headerText: {
    fontSize: Dimensions.get("window").width * 0.06,
    color: Colors.mildGrey,
    letterSpacing: 1,
    marginTop: 10,
  },
  cameraButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.violet,
    padding: 10,
  },
  cameraButtonText: {
    color: "white",
    marginLeft: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginTop: 20,
  },
  cameraContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "transparent",
    flexDirection: "row",
    paddingBottom: 20,
  },
  captureButton: {
    flex: 0.1,
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: Colors.violet,
    padding: 10,
    borderRadius: 5,
    marginRight: 20,
  },
  cancelButton: {
    flex: 0.1,
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: Colors.red,
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: "white",
  },
  submitButton: {
    backgroundColor: Colors.violet,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
  },
});
