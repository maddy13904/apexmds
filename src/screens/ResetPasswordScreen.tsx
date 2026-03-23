import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { resetPassword } from "../services/auth.service";

export function ResetPasswordScreen({ route, navigation }: any) {
  const { email } = route.params;
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const passwordChecks = {
  length: newPassword.length >= 8,
  uppercase: /[A-Z]/.test(newPassword),
  lowercase: /[a-z]/.test(newPassword),
  number: /\d/.test(newPassword),
  special: /[@$!%*?&#]/.test(newPassword),
};

const PasswordRule = ({ valid, label }: { valid: boolean; label: string }) => (
  <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
    <Ionicons
      name={valid ? "checkmark-circle" : "close-circle"}
      size={16}
      color={valid ? "#16A34A" : "#DC2626"}
      style={{ marginRight: 6 }}
    />
    <Text style={{ color: valid ? "#16A34A" : "#DC2626", fontSize: 13 }}>
      {label}
    </Text>
  </View>
);

const isPasswordValid = Object.values(passwordChecks).every(Boolean);


  const handleReset = async () => {
  if (!newPassword || !confirmPassword) {
    alert("Please fill all fields");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  if (!isPasswordValid) {
  alert("Please meet all password requirements");
  return;
}


  try {
    setIsLoading(true);

    await resetPassword({
      email,
      newPassword
    });

    alert("Password reset successful!");
    navigation.replace("Login");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      alert(error.response?.data?.message || "Password reset failed");
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
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#475569" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Create a new strong password for your account.
        </Text>

        {/* New Password */}
       <View style={styles.inputBox}>
  <Ionicons name="lock-closed" size={20} color="#64748B" />
  <TextInput
    style={styles.input}
    placeholder="Min. 8 characters"
    placeholderTextColor="grey"
    secureTextEntry={!showPassword}
    value={newPassword}
    onChangeText={setNewPassword}
  />
  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
    <Ionicons
      name={showPassword ? "eye-off" : "eye"}
      size={20}
      color="#64748B"
    />
  </TouchableOpacity>
</View>

<View style={{ marginTop: 10 }}>
  <PasswordRule valid={passwordChecks.length} label="At least 8 characters" />
  <PasswordRule valid={passwordChecks.uppercase} label="One uppercase letter" />
  <PasswordRule valid={passwordChecks.lowercase} label="One lowercase letter" />
  <PasswordRule valid={passwordChecks.number} label="One number" />
  <PasswordRule valid={passwordChecks.special} label="One special character" />
</View>


        {/* Confirm Password */}
        <View style={styles.inputBox}>
  <Ionicons name="lock-closed" size={20} color="#64748B" />
  <TextInput
    style={styles.input}
    placeholder="Re-enter password"
    placeholderTextColor="grey"
    secureTextEntry={!showPassword}
    value={confirmPassword}
    onChangeText={setConfirmPassword}
  />
  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
    <Ionicons
      name={showPassword ? "eye-off" : "eye"}
      size={20}
      color="#64748B"
    />
  </TouchableOpacity>
</View>


        {/* Reset Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleReset}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Reset Password</Text>
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

  backButton: {
    padding: 6,
    alignSelf: "flex-start",
    borderRadius: 20,
    marginBottom: 20
  },

  content: {
    flex: 1,
    justifyContent: "center"
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 6
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 30
  },

  inputGroup: {
    marginBottom: 20
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color:"black"
  },

  button: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
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
