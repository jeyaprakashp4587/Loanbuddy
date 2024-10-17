import React from "react";
import { StyleSheet, View, Text } from "react-native";
let AdMobBanner;

if (!__DEV__) {
  AdMobBanner = require("expo-ads-admob").AdMobBanner;
}

const Add = () => {
  return (
    <View style={styles.container}>
      {__DEV__ ? (
        <View style={styles.mockBanner}>
          <Text>This is a mock banner</Text>
        </View>
      ) : (
        AdMobBanner && (
          <AdMobBanner
            adUnitID="ca-app-pub-5279425172548399/1607184655" // Your AdMob unit ID
            bannerSize="fullBanner" // Set the banner size here
            onAdFailedToLoad={(error) => console.error(error)}
            style={styles.adMobBanner} // Use style for width
          />
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  adMobBanner: {
    width: "100%", // Set the width to 100%
    height: 50, // Set the height based on the banner size
  },
});

export default Add;
