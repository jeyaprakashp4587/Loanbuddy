import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Colors } from "@/constants/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faAdd,
  faMoneyBill,
  faRupee,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useData } from "@/context/ContextHook";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { storage } from "../Firebase/FireBase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  updateMetadata,
} from "firebase/storage"; // Import Firebase methods
import axios from "axios";
import Api from "@/Api";

const { width, height } = Dimensions.get("window");

const Home = () => {
  const { user, setUser } = useData();
  const nav = useNavigation();
  const [showImageAsk, setShowImageAsk] = useState(false);
  const [uploading, setUploading] = useState(false); // State for loading indicator

  useEffect(() => {
    if (!user?.storeImg) {
      setShowImageAsk(true);
    }
  }, [user]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      uploadImageToFirebase(result.assets[0].uri);
    }
  };

  const uploadImageToFirebase = async (imageUri) => {
    try {
      setUploading(true); // Show loading indicator
      const storageRef = ref(storage, "Image/" + Date.now() + ".jpeg");
      const response = await fetch(imageUri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      await updateMetadata(storageRef, {
        contentType: "image/jpeg",
        cacheControl: "public,max-age=31536000",
      });
      const downloadURL = await getDownloadURL(storageRef);
      // console.log(downloadURL);
      const res = await axios.post(`${Api}/user/updateStoreImage`, {
        id: user?._id,
        Image: downloadURL,
      });
      if (res.data) {
        setUser(res.data);
      }
      setUploading(false); // Hide loading indicator
      setShowImageAsk(false);
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false); // Hide loading indicator on error
    }
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1, paddingHorizontal: 20 }}>
      {/* header */}
      <View
        style={{
          flexDirection: "row",
          height: height * 0.1,
          alignItems: "center",
          columnGap: 10,
        }}
      >
        <Image
          source={{
            uri: user?.storeImg
              ? user?.storeImg
              : "https://i.ibb.co/gZTj1pv/8354029-3875083.jpg",
          }}
          style={{ width: 50, height: 50, borderRadius: 50 }}
        />
        <Text
          style={{
            color: Colors.veryDarkGrey,
            letterSpacing: 2,
            fontWeight: "600",
          }}
        >
          {user?.storeName ? user?.storeName : "My store"}
        </Text>
      </View>

      {/* hr line */}
      <View
        style={{
          width: "100%",
          height: 1,
          borderBottomWidth: 1,
          borderColor: Colors.veryLightGrey,
          marginBottom: 20,
        }}
      />

      {/* Image upload modal */}
      {showImageAsk && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showImageAsk}
          onRequestClose={() => setShowImageAsk(false)}
          style={{
            flexDirection: "row",
            justifyContent: "center",
            flex: 1,
            alignItems: "center",
            borderWidth: 1,
            backgroundColor: "red",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              height: "40%",
              borderWidth: 1,
              position: "absolute",
              // left: width * 0.08,
              // top: height * 0.2,
              padding: 20,
              bottom: 0,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              rowGap: 10,
            }}
          >
            <Text style={{ fontSize: width * 0.04, letterSpacing: 1 }}>
              Upload Store Image:
            </Text>
            <TouchableOpacity
              onPress={pickImage}
              style={{
                padding: 10,
                backgroundColor: "orange",
                borderRadius: 10,
              }}
            >
              <Text style={{ color: "white" }}>Pick an Image</Text>
            </TouchableOpacity>
            {uploading && (
              <ActivityIndicator size="large" color={Colors.lightGrey} />
            )}
          </View>
        </Modal>
      )}
      {/* search holder */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          columnGap: 10,
          borderWidth: 1,
          borderRadius: 50,
          padding: 13,
          borderColor: Colors.veryLightGrey,
        }}
      >
        <FontAwesomeIcon icon={faSearch} size={20} color={Colors.lightGrey} />
        <TextInput
          placeholder="Search Loan Holders"
          style={{
            borderWidth: 0,
            paddingHorizontal: 5,
            flex: 1,
            letterSpacing: 1,
          }}
        />
      </View>

      {/* loan members */}
      <ScrollView style={{ borderWidth: 0, marginTop: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <Text
            style={{
              fontSize: width * 0.05,
              color: Colors.mildGrey,
              letterSpacing: 1,
              marginVertical: 10,
            }}
          >
            All Loan Members
          </Text>
          <TouchableOpacity
            onPress={() => nav.navigate("addMember")}
            style={{
              backgroundColor: Colors.violet,
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
              borderRadius: 10,
              justifyContent: "center",
              columnGap: 10,
            }}
          >
            <FontAwesomeIcon icon={faAdd} color="white" />
            <Text style={{ color: "white" }}>Add New Members</Text>
          </TouchableOpacity>
        </View>

        {user?.LoanHolders?.length <= 0 ? (
          <Text style={{ marginTop: 20 }}>No Loan Holders</Text>
        ) : (
          <FlatList
            data={user?.LoanHolders}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 15,
                  backgroundColor: "white",
                  elevation: 3,
                  margin: 3,
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 10,
                }}
              >
                <Image
                  source={{ uri: "https://i.ibb.co/TgdT1DW/pro.jpg" }}
                  style={{
                    width: width * 0.13,
                    height: height * 0.063,
                    borderRadius: 50,
                  }}
                />
                <Text
                  style={{
                    color: Colors.mildGrey,
                    fontSize: width * 0.035,
                    flex: 1,
                    letterSpacing: 1,
                  }}
                >
                  {/* {item} */}
                </Text>
                <Text
                  style={{
                    flexDirection: "row",
                    fontSize: width * 0.026,
                    color: Colors.lightGrey,
                  }}
                >
                  Balance
                  <Text
                    style={{
                      marginHorizontal: 10,
                      color: "orange",
                      fontWeight: 600,
                      fontSize: width * 0.04,
                      letterSpacing: 1,
                    }}
                  >
                    Rs: 200 /-
                  </Text>
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
