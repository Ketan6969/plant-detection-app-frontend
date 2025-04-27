import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import ScanAPlant from "./screens/ScanAPlant";
import CameraScreen from "./screens/CameraScreen";
import ResultsScreen from "./screens/ResultScreen";
import ProfileScreen from "./screens/ProfileScreen";
import FavoriteScreen from "./screens/FavoriteScreen";
import RecentsScreen from "./screens/RecentsScreen";
import { useSetupNotifications } from "./utils/notification";
import { Navigation } from "lucide-react-native";

const Stack = createNativeStackNavigator();

export default function App() {
  // Setup notifications (with cleanup)
  useSetupNotifications(Navigation);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="ScanAPlant" component={ScanAPlant} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} />
        <Stack.Screen name="ResultsScreen" component={ResultsScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="FavoriteScreen" component={FavoriteScreen} />
        <Stack.Screen name="RecentsScreen" component={RecentsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
