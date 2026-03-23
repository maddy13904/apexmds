import { Expo } from "expo-server-sdk";

const expo = new Expo();

export const sendPushNotification = async (pushToken, title, body) => {

  try {

    if (!Expo.isExpoPushToken(pushToken)) {
      console.log("Invalid Expo push token");
      return;
    }

    const messages = [
      {
        to: pushToken,
        sound: "default",
        title,
        body,
        data: { type: "study-reminder" }
      }
    ];

    await expo.sendPushNotificationsAsync(messages);

  } catch (error) {

    console.log("Push notification error:", error);

  }

};