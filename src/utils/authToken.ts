import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function savetoken(token: string) {
  console.log("saveToken CALLED with:", token);
  console.log("Platform.OS:", Platform.OS);

  if (Platform.OS === "web") {
    localStorage.setItem("accessToken", token);
    console.log(
      "Token AFTER save (web):",
      localStorage.getItem("accessToken")
    );
  } else {
    await AsyncStorage.setItem("accessToken", token);
  }
}

export async function getAuthToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem("accessToken");
  }
  return await AsyncStorage.getItem("accessToken");
}

export async function clearToken() {
  if (Platform.OS === "web") {
    localStorage.removeItem("accessToken");
  } else {
    await AsyncStorage.removeItem("accessToken");
  }
}
