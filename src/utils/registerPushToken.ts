import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import api from "../services/api";

export async function registerPushToken() {

  if (!Device.isDevice) return;

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {

    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== "granted") return;

  const tokenData = await Notifications.getExpoPushTokenAsync();

  const token = tokenData.data;

  try {

    await api.post("/push-token", { token });

  } catch (err) {

    console.log("Push token save failed");

  }

}