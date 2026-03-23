import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useAuth } from "../context/AuthContext";


const BASE_URL = "http://10.148.127.170:5000/api/v1";

export function DeleteAccountScreen({ navigation }: any) {
  const [step, setStep] = useState<"warning" | "confirm" | "password">("warning");
  const [password, setPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { logout } = useAuth();

  const dataToDelete = [
    "All your profile information and settings",
    "Complete study progress and analytics",
    "Practice question history and scores",
    "Mock test results and performance data",
    "Downloaded e-books and bookmarks",
    "Login history and active sessions",
    "All saved preferences and customizations"
  ];

  function handleContinue() {
    setStep("confirm");
  }

  function handleConfirm() {
    if (confirmText.toLowerCase() !== "delete my account") {
      setError('Please type "delete my account" exactly');
      return;
    }
    setError("");
    setStep("password");
  }

  async function handleDelete() {
  if (!password) {
    setError("Please enter your password");
    return;
  }

  setIsDeleting(true);
  setError("");

  try {
    const token = await AsyncStorage.getItem("accessToken");

    if (!token) {
      setError("Authentication error. Please login again.");
      setIsDeleting(false);
      return;
    }

    // 🔥 Call backend delete route
    const response = await fetch(`${BASE_URL}/users/delete-account`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }), // optional if backend verifies password
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Account deletion failed");
    }

    // ✅ Clear AsyncStorage
    await AsyncStorage.clear();

    // ✅ Delete downloaded ebooks
    await FileSystem.deleteAsync(
      (FileSystem.documentDirectory ?? "") + "ebooks/",
      { idempotent: true }
    );

    // ✅ Delete downloaded question papers
    await FileSystem.deleteAsync(
      (FileSystem.documentDirectory ?? "") + "questionPapers/",
      { idempotent: true }
    );

    Alert.alert(
      "Account Deleted",
      "Your account has been permanently deleted.",
      [
        {
          text: "OK",
          onPress: async () => {
        await logout();
      }
        }
      ]
    );

  } catch (error: any) {
    console.log("Delete error:", error);
    setError(error.message || "Failed to delete account. Try again.");
  } finally {
    setIsDeleting(false);
  }
}

  const REQUIRED_PHRASE = "delete my account";
  const isValidPhrase =
  confirmText.trim() === REQUIRED_PHRASE;

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.bgCircleSky} />
                        <View style={styles.bgCircleGreen} />
                        <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Delete Account</Text>
        </View>
        <Text style={styles.headerSub}>
          Permanently remove your account
        </Text>
      </View>

      <View style={styles.body}>

        {/* STEP 1 — Warning */}
        {step === "warning" && (
          <>
            <View style={styles.warningCard}>
              <Ionicons name="alert-circle" size={24} color="#EF4444" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.warningTitle}>
                  This action cannot be undone
                </Text>
                <Text style={styles.warningDesc}>
                  Deleting your account permanently removes all your data.
                </Text>
              </View>
            </View>

            <View style={styles.listCard}>
              <Text style={styles.listHeader}>What will be deleted:</Text>

              {dataToDelete.map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={styles.altCard}>
              <Ionicons name="checkmark-circle" size={22} color="#2563EB" />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.altTitle}>Consider Alternatives</Text>
                <Text style={styles.altDesc}>
                  You can change password, logout from devices, or update privacy settings instead.
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.dangerButton} onPress={handleContinue}>
              <Text style={styles.dangerText}>Continue to Delete Account</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.secondaryText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}

        {/* STEP 2 — Confirm Phrase */}
        {step === "confirm" && (
          <>
            <View style={styles.confirmCard}>
              <Ionicons name="alert-circle" size={22} color="#EF4444" />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.confirmTitle}>Confirm Account Deletion</Text>
                <Text style={styles.confirmDesc}>
                  Type "delete my account" below:
                </Text>

                <TextInput
                  style={styles.input}
                  value={confirmText}
                  onChangeText={setConfirmText}
                  placeholder="delete my account"
                  placeholderTextColor="grey"
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>
            </View>

            <TouchableOpacity
              style={[
  styles.dangerButton,
  !isValidPhrase && { opacity: 0.5 }
]}
              onPress={handleConfirm}
              disabled={!isValidPhrase}
            >
              <Text style={styles.dangerText}>Continue</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep("warning")}>
              <Text style={styles.secondaryText}>Back</Text>
            </TouchableOpacity>
          </>
        )}

        {/* STEP 3 — Password */}
        {step === "password" && (
          <>
            <View style={styles.confirmCard}>
              <Ionicons name="lock-closed" size={22} color="#2563EB" />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.confirmTitle}>Enter Password</Text>
                <Text style={styles.confirmDesc}>
                  Enter your password to confirm deletion.
                </Text>

                <TextInput
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter password"
                  placeholderTextColor="grey"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
    <Ionicons
      name={showPassword ? "eye-off" : "eye"}
      size={20}
      color="#64748B"
    />
  </TouchableOpacity>

                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>
            </View>

            <TouchableOpacity
              style={styles.dangerButton}
              onPress={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.dangerText}>Delete My Account</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => setStep("confirm")}>
              <Text style={styles.secondaryText}>Back</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.footerText}>
          Need help? Contact support before deleting your account.
        </Text>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },

  header: {
    backgroundColor: "#DC2626",
    paddingTop: 55,
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

  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4
  },

  headerSub: {
    color: "#FECACA",
    fontSize: 13,
    marginTop: 4,
    marginLeft: 35
  },

  body: {
    padding: 20
  },

  warningCard: {
    backgroundColor: "#FEE2E2",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15
  },

  warningTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#991B1B"
  },

  warningDesc: {
    fontSize: 12,
    color: "#7F1D1D",
    marginTop: 2
  },

  listCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    marginBottom: 15
  },

  listHeader: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 8
  },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6
  },

  listText: {
    fontSize: 12,
    color: "#334155",
    marginLeft: 6
  },

  altCard: {
    backgroundColor: "#DBEAFE",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },

  altTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1E40AF"
  },

  altDesc: {
    fontSize: 11,
    color: "#1E3A8A",
    marginTop: 2
  },

  confirmCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    marginBottom: 15
  },

  confirmTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E293B"
  },

  confirmDesc: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4
  },

  input: {
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    fontSize: 13,
    color:"black"
  },

  dangerButton: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginTop: 5
  },

  dangerText: {
    color: "white",
    fontWeight: "bold"
  },

  secondaryButton: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },

  secondaryText: {
    color: "#334155",
    fontWeight: "bold"
  },

  errorText: {
    color: "#EF4444",
    fontSize: 11,
    marginTop: 5
  },

  footerText: {
    textAlign: "center",
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 20
  }
});
