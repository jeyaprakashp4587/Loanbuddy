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
  RefreshControl,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { Colors } from "@/constants/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAdd, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
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
import debounce from "lodash.debounce"; // Import lodash debounce
import { Divider } from "react-native-paper";
const { width, height } = Dimensions.get("window");

const Home = () => {
  const { user, setUser, selectedLoanHolder, setSelectedLoanHolder } =
    useData();
  const nav = useNavigation();
  const [showImageAsk, setShowImageAsk] = useState(false);
  const [uploading, setUploading] = useState(false); // State for loading indicator
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users

  useEffect(() => {
    setTimeout(() => {
      if (!user?.storeImg) {
        setShowImageAsk(true);
      }
    }, 1000);
  }, [user]);

  // Handle image upload
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

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query) {
        const filtered = user?.LoanHolders?.filter((holder) =>
          holder.LoanHolderName.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers([]);
      }
    }, 500), // 500ms debounce delay
    [user?.LoanHolders]
  );

  // Update searchQuery and trigger debounced search
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };
  // refresh user
  const [refresh, setRefresh] = useState(false);
  const refreshUser = useCallback(async () => {
    setRefresh(true);
    const res = await axios.get(`${Api}/login/valid/${user?._id}`);
    if (res.data) {
      setRefresh(false);
      setUser(res.data);
    }
  }, [user]);
  //
  //nav and setLoanUSer
  const handleSetLoanUser = useCallback(
    async (item) => {
      setSelectedLoanHolder(item);
      nav.navigate("loanUser");
    },
    [setSelectedLoanHolder]
  );
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refresh} onRefresh={refreshUser} />
      }
      style={{ flex: 1, paddingHorizontal: 20, backgroundColor: "white" }}
    >
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
        >
          <View
            style={{
              backgroundColor: "white",
              width: "100%",
              height: "40%",
              padding: 20,
              bottom: 0,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              flexDirection: "column",
              rowGap: 20,
            }}
          >
            <TouchableOpacity onPress={() => setShowImageAsk(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </TouchableOpacity>
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
          value={searchQuery}
          onChangeText={handleSearchChange}
          style={{
            borderWidth: 0,
            paddingHorizontal: 5,
            flex: 1,
            letterSpacing: 1,
          }}
        />
      </View>
      {/* <AdMobBanner
        bannerAdUnitID="ca-app-pub-5279425172548399/1607184655" // Your Banner Ad Unit ID
        servePersonalizedAds // Set this to true to serve personalized ads
        onDidFailToReceiveAdWithError={(error) => console.error(error)} // Handle ad loading errors
      /> */}
      {/* loan members */}
      <ScrollView style={{ borderWidth: 0, marginTop: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            flexWrap: "wrap",
            alignItems: "center",
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
              backgroundColor: "#004080",
              flexDirection: "row",
              alignItems: "center",
              // paddingHorizontal: 20,
              borderRadius: 10,
              justifyContent: "center",
              columnGap: 10,
              width: width * 0.11,
              height: height * 0.05,
            }}
          >
            <FontAwesomeIcon icon={faAdd} color="white" />
          </TouchableOpacity>
        </View>
        {user?.LoanHolders?.length > 0 ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 30 }}
            data={searchQuery.length > 0 ? filteredUsers : user?.LoanHolders}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => handleSetLoanUser(item)}
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  columnGap: 15,
                  backgroundColor: "white",
                  elevation: 2,
                  margin: 3,
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 15,
                }}
              >
                <Image
                  source={{
                    uri: item?.LoanHolderProfileImg
                      ? item?.LoanHolderProfileImg
                      : "https://i.ibb.co/TgdT1DW/pro.jpg",
                  }}
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
                  {item?.LoanHolderName}
                </Text>
                <Text
                  style={{
                    flexDirection: "row",
                    fontSize: width * 0.026,
                    color: Colors.lightGrey,
                  }}
                >
                  Balance{" "}
                  <Text
                    style={{
                      marginHorizontal: 10,
                      color: "#004080",
                      fontSize: width * 0.032,
                      letterSpacing: 1,
                      fontWeight: "600",
                    }}
                  >
                    RS:{item?.LoanHolderBalance ? item?.LoanHolderBalance : 0}/-
                  </Text>
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        ) : (
          <Text>No Loan Holders</Text>
        )}
      </ScrollView>
    </ScrollView>
  );
};

export default Home;
