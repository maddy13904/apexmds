import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { forgotPassword } from "../services/auth.service";

export function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
  if (!email) {
    alert("Please enter your email");
    return;
  }

  try {
    setIsLoading(true);

    await forgotPassword({ email });

    // ✅ OTP generated on backend
    navigation.navigate("OTPVerification", {
      email,
      purpose: "reset"
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      alert(error.response?.data?.message || "Failed to send OTP");
    } else {
      alert("Something went wrong");
    }
  } finally {
    setIsLoading(false);
  }
};


  return (
    <View style={styles.container}>

      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#475569" />
      </TouchableOpacity>

      <View style={styles.content}>

        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we'll send you a code to reset your password.
        </Text>

        {/* Email Input */}
        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={20} color="#64748B" />
          <TextInput
            style={styles.input}
            placeholder="john@example.com"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        {/* Send OTP Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSendOtp}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Send OTP</Text>
          )}
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20
  },

  backBtn: {
    marginTop: 40,
    marginBottom: 20,
    width: 40
  },

  content: {
    maxWidth: 400,
    alignSelf: "center",
    width: "100%"
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 6
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 25
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14
  },

  button: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#1E3A8A",
    shadowOpacity: 0.3,
    shadowRadius: 8
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  }
});
