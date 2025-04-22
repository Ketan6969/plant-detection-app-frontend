import jwtDecode from "jwt-decode";

export const checkTokenExpiration = (token, navigation) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // current time in seconds

    if (decoded.exp < currentTime) {
      console.log("Token expired. Redirecting to Login...");
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  } catch (error) {
    console.log("Invalid token. Redirecting to Login...");
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  }
};
