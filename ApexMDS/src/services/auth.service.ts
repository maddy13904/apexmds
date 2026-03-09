import API from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerUser = (data: {
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
}) => API.post("/auth/register", data);

export const verifyEmailOtp = (data: {
  email: string;
  otp: string;
}) => API.post("/auth/verify-email", data);

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {

  const response = await API.post("/auth/login", data);

  const token = response.data.token;

  console.log("LOGIN TOKEN:", token);
  // ✅ store JWT
  await AsyncStorage.setItem("token", token);

  return response;
};

export const forgotPassword = (data: { email: string }) =>
  API.post("/auth/forgot-password", data);

export const verifyResetOtp = (data: { email: string; otp: string }) =>
  API.post("/auth/verify-reset-otp", data);

export const resetPassword = (data: {
  email: string;
  newPassword: string;
}) => API.post("/auth/reset-password", data);
