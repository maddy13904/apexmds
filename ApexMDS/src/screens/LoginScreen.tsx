import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { loginUser } from "../services/auth.service";
import { saveToken } from "../utils/authStorage";
import { savetoken } from "../utils/authToken";
import axios from "axios";
import { useAuth } from "../context/AuthContext";


export function LoginScreen({ navigation }: any) {
  const [email, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();


  /*const handleLogin = async () => {
  try {
    const response = await loginUser({
      email,
      password
    });

    await saveToken(response.data.token);

    // Navigate to Dashboard
    navigation.replace("Dashboard");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      alert(error.response?.data?.message || "Login failed");
    } else {
      alert("Something went wrong");
    }
  }
};*/

const handleLogin = async () => {
  console.log("LOGIN BUTTON PRESSED");
  try {
    setIsLoading(true);

    console.log("Calling login API...");
    const res = await loginUser({ email, password });
    console.log("LOGIN RESPONSE:", res.data);
    console.log("JWT SAVED:", res.data.token);


    await saveToken(res.data.token);
    await savetoken(res.data.token);
login(); // 🔥 THIS updates global auth state
  } catch (err: any) {
    console.log("LOGIN ERROR FULL:", err);
    console.log("LOGIN ERROR RESPONSE:", err.response?.data);
    alert(err.response?.data?.message || "Login failed");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center", paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >

        <View style={styles.content}>

          {/* Logo Section */}
          <View style={styles.logoBox}>
            <View style={styles.logoIcon}>
              <Ionicons name="pulse" size={34} color="white" />
            </View>
            <Text style={styles.welcome}>ApexMDS</Text>
            <Text style={styles.subtitle}>Sign in to continue your prep</Text>
          </View>

          {/* Email / Phone Input */}
          <View style={styles.inputBox}>
            <Ionicons name="mail-outline" size={20} color="#64748B" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="grey"
              value={email}
              onChangeText={setEmailOrPhone}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={20} color="#64748B" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="grey"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
    <Ionicons
      name={showPassword ? "eye-off" : "eye"}
      size={20}
      color="#64748B"
    />
  </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotBox}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <View style={styles.loginRow}>
                <Text style={styles.loginText}>Login</Text>
                <Ionicons name="arrow-forward" size={18} color="white" />
              </View>
            )}
          </TouchableOpacity>

          {/* Register */}
          <View style={styles.registerBox}>
            <Text style={styles.registerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.registerLink}> Register</Text>
            </TouchableOpacity>
          </View>

        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 20
  },

  content: {
    maxWidth: 400,
    alignSelf: "center",
    width: "100%"
  },

  logoBox: {
    alignItems: "center",
    marginBottom: 30
  },

  logoIcon: {
    width: 64,
    height: 64,
    backgroundColor: "#1E3A8A",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#1E3A8A",
    shadowOpacity: 0.4,
    shadowRadius: 10
  },

  welcome: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0F172A"
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4
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
    marginTop: 15
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color:"black"
  },

  forgotBox: {
    alignItems: "flex-end",
    marginTop: 8
  },

  forgotText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0284C7"
  },

  loginButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 25,
    shadowColor: "#1E3A8A",
    shadowOpacity: 0.3,
    shadowRadius: 8
  },

  loginRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },

  loginText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold"
  },

  registerBox: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25
  },

  registerText: {
    fontSize: 14,
    color: "#64748B"
  },

  registerLink: {
    fontSize: 14,
    color: "#1E3A8A",
    fontWeight: "bold"
  }
});
