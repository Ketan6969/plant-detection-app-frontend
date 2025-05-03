import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode"; // Try this first

export const checkTokenExpiration = async (navigation) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    console.log("[Auth] Token retrieved from storage");

    if (!token) {
      // console.log("[Auth] No token found → Redirecting to Login");
      await redirectToLogin(navigation, "Please sign in.");
      return false;
    }

    // Try both options if needed
    const decoded = jwtDecode(token); // Option 1
    // const decoded = require("jwt-decode")(token); // Option 2
    // const decoded = decodeJWT(token); // Option 3 (fallback)

    const currentTime = Date.now() / 1000;

    if (decoded.exp < currentTime) {
      console.log("[Auth] Token expired → Redirecting to Login");
      await AsyncStorage.removeItem("userToken");
      await redirectToLogin(
        navigation,
        "Session expired. Please sign in again."
      );
      return false;
    }

    return true;
  } catch (error) {
    // console.error("[Auth] Token validation failed:", error);
    await redirectToLogin(navigation, "Invalid session. Please sign in again.");
    return false;
  }
};
