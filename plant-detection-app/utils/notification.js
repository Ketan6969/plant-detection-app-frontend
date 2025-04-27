import * as Notifications from "expo-notifications";
import { useEffect } from "react";

const CONFIG = {
  TEST_MODE: process.env.EXPO_PUBLIC_TEST_MODE === "true",
  TEST_INTERVAL_SECONDS: parseInt(
    process.env.EXPO_PUBLIC_TEST_INTERVAL_SECONDS || "10"
  ),
  DAILY_HOUR: parseInt(process.env.EXPO_PUBLIC_DAILY_HOUR || "9"),
  DAILY_MINUTE: parseInt(process.env.EXPO_PUBLIC_DAILY_MINUTE || "0"),
};

const PLANT_TIPS = [
  "Did you know? Rotating your plants helps them grow evenly!",
  "Most houseplants prefer water at room temperature 🌱",
  "Check your plant's soil - it might need water today!",
  "Dust on leaves blocks sunlight. Wipe them gently with a damp cloth.",
  "Plants grow better when you talk to them! Try it today 💚",
  "Overwatering is worse than underwatering for most plants",
  "Morning is the best time to water your plants",
  "Your plant might need more humidity - consider misting it",
  "Yellow leaves often mean too much water, brown tips mean not enough",
  "Spring is coming! Time to repot plants that have outgrown their homes",
];

// Handle how notifications are displayed
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Utility: Get a random tip
const getRandomPlantTip = () =>
  PLANT_TIPS[Math.floor(Math.random() * PLANT_TIPS.length)];

/**
 * Utility: Build Notification Content
 */
function buildNotificationContent(title: string, body: string, screen: string) {
  return {
    title,
    body,
    data: { screen },
  };
}

/**
 * Request Notification Permissions
 */
export async function initNotifications() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    await Notifications.requestPermissionsAsync();
  }
}

/**
 * Immediately Send a Random Tip Notification
 */
export async function sendPlantCareNotification() {
  const title = CONFIG.TEST_MODE ? "🌿 TEST Plant Tip" : "🌿 Plant Care Tip";
  const body = getRandomPlantTip();
  const screen = "ScanAPlant";

  await Notifications.scheduleNotificationAsync({
    content: buildNotificationContent(title, body, screen),
    trigger: { seconds: CONFIG.TEST_INTERVAL_SECONDS },
  });
}

/**
 * Schedule Recurring Plant Notifications
 */
export async function schedulePlantNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const title = CONFIG.TEST_MODE
    ? "🌱 Plant Check Reminder (Test)"
    : "🌱 Your Daily Plant Reminder";

  const body = getRandomPlantTip();
  const screen = "ScanAPlant";

  const trigger = CONFIG.TEST_MODE
    ? {
        seconds: CONFIG.TEST_INTERVAL_SECONDS,
        repeats: true,
      }
    : {
        hour: CONFIG.DAILY_HOUR,
        minute: CONFIG.DAILY_MINUTE,
        repeats: true,
      };

  await Notifications.scheduleNotificationAsync({
    content: buildNotificationContent(title, body, screen),
    trigger,
  });
}

/**
 * Send Specific Plant Notification
 */
export async function sendPlantSpecificNotification(
  plantName: string,
  careInstruction: string
) {
  const title = CONFIG.TEST_MODE
    ? `TEST: Care for ${plantName}`
    : `Care for your ${plantName}`;

  const screen = "RecentsScreen";

  const trigger = CONFIG.TEST_MODE
    ? { seconds: CONFIG.TEST_INTERVAL_SECONDS }
    : { seconds: 5 }; // In production maybe you want 5s immediate fire or customize it

  await Notifications.scheduleNotificationAsync({
    content: buildNotificationContent(title, careInstruction, screen),
    trigger,
  });
}

/**
 * Hook: Setup Notifications and Handle Taps
 */
export function useSetupNotifications(navigation: any) {
  useEffect(() => {
    (async () => {
      await initNotifications();
      await schedulePlantNotifications();
    })();

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const screen = response.notification.request.content.data?.screen;
        if (screen && navigation) {
          navigation.navigate(screen);
        }
      }
    );

    return () => subscription.remove();
  }, [navigation]);
}
