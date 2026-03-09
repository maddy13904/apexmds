import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { changePassword } from "../services/authApi";
import { getAuthToken } from "../utils/authToken";
import { logout } from "../utils/authStorage";
import { useAuth } from "../context/AuthContext";
import { resetToAuthStack } from "../navigation/navigationRef";


export function ChangePasswordScreen({ navigation }: any) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isLoggedIn } = useAuth();

  // 🔥 HARD GUARD — force unmount immediately on logout
  if (!isLoggedIn) {
    return null;
  }

const handlePasswordSubmit = async () => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    return alert("All fields are required");
  }

  if (newPassword !== confirmPassword) {
    return alert("Passwords do not match");
  }

  try {
    setIsLoading(true);

    await changePassword(currentPassword, newPassword);
    alert("Password Change Successful, Please log in again!");

    // 1️⃣ Clear auth state + token
    await logout();
  } catch (err: any) {
    alert(err.message || "Failed to update password");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.bgCircleSky} />
        <View style={styles.bgCircleGreen} />

        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Change Password</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Update Your Password</Text>
        <Text style={styles.subtitle}>
          Enter your current password and choose a new one.
        </Text>

        <InputField
          label="Current Password"
          icon="lock-closed-outline"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secure={!showPassword}
          showToggle
          showPassword={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
        />

        <InputField
          label="New Password"
          icon="lock-closed-outline"
          value={newPassword}
          onChangeText={setNewPassword}
          secure={!showPassword}
          showToggle
          showPassword={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
        />

        <InputField
          label="Confirm Password"
          icon="lock-closed-outline"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secure={!showPassword}
          showToggle
          showPassword={showPassword}
          onToggle={() => setShowPassword(!showPassword)}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handlePasswordSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.btnText}>Update Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* Input Field */
function InputField({
  label,
  icon,
  value,
  onChangeText,
  secure,
  showToggle,
  showPassword,
  onToggle
}: any) {
  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputBox}>
        <Ionicons name={icon} size={20} color="#64748B" />

        <TextInput
          style={styles.input}
          value={value}
          secureTextEntry={secure}
          onChangeText={onChangeText}
        />

        {showToggle && (
          <TouchableOpacity onPress={onToggle}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#64748B"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

/* Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },

  header: {
    backgroundColor: "#1E40AF",
    paddingTop: 25,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden"
  },

  bgCircleSky: {
    position: "absolute",
    width: 200,
    height: 200,
    backgroundColor: "#38BDF8",
    opacity: 0.2,
    borderRadius: 100,
    top: -60,
    left: -60
  },

  bgCircleGreen: {
    position: "absolute",
    width: 160,
    height: 160,
    backgroundColor: "#34D399",
    opacity: 0.2,
    borderRadius: 80,
    bottom: -40,
    right: -40
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },

  backButton: {
    padding: 6,
    borderRadius: 20
  },

  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },

  content: {
    padding: 20,
    maxWidth: 420,
    alignSelf: "center",
    width: "100%"
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 6
  },

  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 20
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 12
  },

  input: {
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    color:"black"
  },

  button: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10
  },

  btnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold"
  }
});
