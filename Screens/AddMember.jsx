import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Modal,
} from "react-native";
import React, { useState, useCallback, useMemo } from "react";
import { Colors } from "@/constants/Colors";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { storage } from "../Firebase/FireBase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { LinearGradient } from "expo-linear-gradient";
import { useData } from "@/context/ContextHook";
import Api from "@/Api";

const AddMember = () => {
  const { width, height } = Dimensions.get("window");
  const [loanHolderName, setLoanHolderName] = useState("");
  const [loanHolderAmount, setLoanHolderAmount] = useState("");
  const [image, setImage] = useState();
  const [uploadIndi, setUploadIndi] = useState(false);
  const [existingHolder, setExistingHolder] = useState(null); // Store existing loan holder
  const [modalVisible, setModalVisible] = useState(false);
  const { user, setUser } = useData();
  const [actiIndi, setActiIndi] = useState(false);
  const selectImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      uploadImageToFirebase(result.assets[0].uri).then(() =>
        setUploadIndi(false)
      );
    }
  }, []);

  const uploadImageToFirebase = useCallback(async (imageUri) => {
    try {
      setUploadIndi(true);
      const storageRef = ref(storage, "Image/" + Date.now() + ".jpeg");
      const response = await fetch(imageUri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      setImage(downloadURL);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadIndi(false);
    }
  }, []);

  const HandleSubmit = useCallback(async () => {
    if (!loanHolderName) {
      Alert.alert("Please Fill Name Field");
      return;
    }
    setActiIndi(true);
    try {
      const response = await axios.post(`${Api}/LoanHolder/AddLoanHolder`, {
        loanHolderName,
        loanHolderAmount,
        image,
        id: user?._id,
      });

      if (response.data.exists) {
        setExistingHolder(response.data.exits);
        console.log(response.data);
        setModalVisible(true);
        setActiIndi(false);
        setImage("");
        setLoanHolderAmount(0);
        setLoanHolderName("");
        // Show modal if loan holder exists
      } else {
        setUser(response.data.user);
        Alert.alert("Success", "Loan holder added successfully!");
        setActiIndi(false);
        setImage("");
        setLoanHolderAmount(0);
        setLoanHolderName("");
      }
    } catch (error) {
      console.error("Error saving loan holder:", error);
      Alert.alert("Error", "Could not save loan holder.");
      setActiIndi(false);
    }
  }, [loanHolderName, loanHolderAmount, image]);

  const previewImage = useMemo(() => {
    return image ? image : "https://i.ibb.co/TgdT1DW/pro.jpg";
  }, [image]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Add Loan Holder Info</Text>
      <View style={styles.form}>
        <TextInput
          label="Enter Loan Holder Name"
          mode="outlined"
          value={loanHolderName}
          onChangeText={setLoanHolderName}
          activeOutlineColor={Colors.lightGrey}
          style={{ backgroundColor: "white" }}
          outlineStyle={{ borderWidth: 1, borderColor: Colors.lightGrey }}
        />
        <TextInput
          label="Enter Loan Holder Amount"
          mode="outlined"
          value={loanHolderAmount}
          onChangeText={setLoanHolderAmount}
          keyboardType="numeric"
          activeOutlineColor={Colors.lightGrey}
          style={{
            backgroundColor: "white",
          }}
          outlineStyle={{ borderWidth: 1, borderColor: Colors.lightGrey }}
        />
        <TouchableOpacity
          onPress={selectImage}
          style={{
            backgroundColor: "#004080",
            padding: 10,
            borderRadius: 5,
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            columnGap: 10,
          }}
        >
          <FontAwesomeIcon icon={faCamera} size={20} color="white" />
          <Text
            style={{
              textAlign: "center",
              color: "white",
              letterSpacing: 1,
            }}
          >
            Add photo
          </Text>
        </TouchableOpacity>
      </View>

      {/* preview */}
      <LinearGradient
        colors={["white", "white", "#004080"]}
        start={[0, 1]}
        end={[1, 0]}
        style={{
          width: "100%",
          height: height * 0.3,
          marginTop: 50,
          // borderWidth: 1,
          elevation: 2,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            // borderWidth: 1,
            flex: 1,
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {uploadIndi ? (
            <ActivityIndicator color="black" size={40} />
          ) : (
            <Image
              source={{ uri: previewImage }}
              style={{ width: 70, height: 70, borderRadius: 50 }}
            />
          )}
        </View>
        <View
          style={{
            // borderWidth: 1,
            flex: 1.5,
            flexDirection: "column",
            justifyContent: "center",
            // alignItems: "center",
            padding: 20,
            rowGap: 5,
          }}
        >
          <Text
            style={{
              fontSize: width * 0.04,
              color: Colors.veryDarkGrey,
              fontWeight: "600",
              letterSpacing: 1,
            }}
          >
            {loanHolderName || "Loan Holder Name"}
          </Text>
          <Text
            style={{
              fontSize: width * 0.04,
              color: Colors.veryDarkGrey,
              fontWeight: "600",
              letterSpacing: 1,
            }}
          >
            {loanHolderAmount || "Loan Holder Amount"}
          </Text>
        </View>
      </LinearGradient>
      <TouchableOpacity
        onPress={HandleSubmit}
        style={{
          backgroundColor: "#004080",
          padding: 10,
          borderRadius: 5,
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
          columnGap: 10,
          marginTop: 20,
        }}
      >
        {actiIndi && <ActivityIndicator color={Colors.mildGrey} size={15} />}
        <Text style={{ color: "white", letterSpacing: 1 }}>Submit</Text>
      </TouchableOpacity>

      {/* Modal for existing loan holder */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Loan holder already exists!</Text>
          <Text style={styles.modalText}>
            Name: {existingHolder?.LoanHolderName}
          </Text>
          <Image
            source={{ uri: existingHolder?.LoanHolderProfile || previewImage }}
            style={{ width: 70, height: 70, borderRadius: 50 }}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={{ color: "white" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default React.memo(AddMember);

const styles = StyleSheet.create({
  // Add your styles here
  // ...
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "white",
  },
  form: {
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
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#004080",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
});
