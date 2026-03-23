import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";

export async function saveToken(token: string) {
  if (Platform.OS === "web") {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }
}

export async function loadToken() {
  if (Platform.OS === "web") {
    return localStorage.getItem(TOKEN_KEY);
  } else {
    return await AsyncStorage.getItem(TOKEN_KEY);
  }
}

export const logout = async () => {
  if (Platform.OS === "web") {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await AsyncStorage.removeItem(TOKEN_KEY);
  }
};
