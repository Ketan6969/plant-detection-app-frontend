// utils/authHelpers.js
import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkLoginStatus = async (
  navigation,
  targetScreen = "ScanAPlant"
) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      navigation.replace(targetScreen);
    }
  } catch (e) {
    console.log("Failed to fetch token", e);
  }
};

export const checkLoginStatusExpiry = async (
  navigation,
  loggedInScreen = "ScanAPlant"
) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const expiry = await AsyncStorage.getItem("tokenExpiry"); // should be ISO string

    if (!token || !expiry) {
      // No token or expiry -> logout
      navigation.replace("Login");
      return;
    }

    const isExpired = new Date() > new Date(expiry);

    if (isExpired) {
      // Token is expired, clear it
      await AsyncStorage.multiRemove(["userToken", "tokenExpiry"]);
      navigation.replace("LoginScreen");
    } else {
      // Token is valid
      navigation.replace(loggedInScreen);
    }
  } catch (e) {
    console.log("Auth check failed", e);
    navigation.replace("LoginScreen"); // Fallback to login
  }
};
