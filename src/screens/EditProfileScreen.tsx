import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { updateMyProfile } from "../services/user.service";

export function EditProfileScreen({ navigation, route }: any) {
  const { user } = route.params;

  const [name, setName] = useState(user.name);
  const [email] = useState(user.email); // 🔒 email not editable
  const [phone, setPhone] = useState(user.phone || "");
  const [role, setRole] = useState(user.role || "");
  const [isLoading, setIsLoading] = useState(false);

  const isValidPhone = (phone: string) => /^[0-9]{10}$/.test(phone);

  const handleSave = async () => {
    if (!name || !phone || !role) {
      alert("All fields are required");
      return;
    }

    if (!isValidPhone(phone)) {
      alert("Phone number must be exactly 10 digits");
      return;
    }

    try {
      setIsLoading(true);

      await updateMyProfile({
        name,
        phone,
        role
      });

      alert("Profile updated successfully");
      navigation.goBack();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Update failed");
      } else {
        alert("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>

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

          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>
      </View>

      <View style={styles.content}>

        {/* Avatar */}
        <View style={styles.photoSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${name}`
              }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.photoHint}>Profile photo auto-generated</Text>
        </View>

        <InputField
          label="Full Name"
          icon="person-outline"
          value={name}
          onChangeText={setName}
        />

        <InputField
          label="Email Address"
          icon="mail-outline"
          value={email}
          editable={false}
        />

        <InputField
          label="Role"
          icon="briefcase-outline"
          value={role}
          onChangeText={setRole}
        />

        <InputField
          label="Phone Number"
          icon="call-outline"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <View style={styles.saveRow}>
              <Ionicons name="save-outline" size={18} color="white" />
              <Text style={styles.saveText}>Save Changes</Text>
            </View>
          )}
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

/* Reusable Input */
function InputField({
  label,
  icon,
  value,
  onChangeText,
  keyboardType,
  editable = true
}: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputBox}>
        <Ionicons name={icon} size={20} color="#64748B" />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          editable={editable}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },

  header: {
    backgroundColor: "#1E40AF",
    paddingTop: 40,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden"
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },

  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },

  backButton: {
    padding: 6,
    borderRadius: 20
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

  content: {
    padding: 20,
    maxWidth: 420,
    alignSelf: "center",
    width: "100%"
  },

  photoSection: {
    alignItems: "center",
    marginBottom: 30
  },

  avatarWrapper: {
    position: "relative"
  },

  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: "#F1F5F9"
  },

  photoHint: {
    marginTop: 8,
    fontSize: 12,
    color: "#64748B"
  },

  inputGroup: {
    marginBottom: 18
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
    fontSize: 14
  },

  saveButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#1E3A8A",
    shadowOpacity: 0.35,
    shadowRadius: 8
  },

  saveRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },

  saveText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold"
  }
});
