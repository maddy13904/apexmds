// src/config/api.ts
import { Platform } from "react-native";

const LOCAL_IP = "192.168.136.1"; // 🔁 change ONLY here

export const BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:5000"
    : `http://${LOCAL_IP}:5000`;
