import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  Alert,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import api from "../services/api";

export function NotificationsScreen({ navigation }: any) {

  const [pushEnabled, setPushEnabled] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [quietFrom, setQuietFrom] = useState("22:00");
  const [quietTo, setQuietTo] = useState("08:00");

  /* =============================
     LOAD SETTINGS
  ============================= */
  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {

  try {

    const res = await api.get("/notification-settings");

    const settings = res.data;

    setPushEnabled(settings.pushEnabled ?? true);
    setStudyReminders(settings.studyReminders ?? true);
    setQuietFrom(settings.quietFrom ?? "22:00");
    setQuietTo(settings.quietTo ?? "08:00");

  } catch {
    console.log("Failed to load notification settings");
  }

}

  async function saveSettings(newSettings:any) {

  try {

    await api.put("/notification-settings", newSettings);

  } catch {

    console.log("Failed to save settings");

  }

}

  /* =============================
     PUSH TOGGLE
  ============================= */
  async function handlePushToggle() {
    const newValue = !pushEnabled;

    if (newValue) {
      if (Platform.OS !== "web") {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Please enable notifications in device settings."
          );
          return;
        }
      }
    } else {
      if (Platform.OS !== "web") {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    }

    setPushEnabled(newValue);

    saveSettings({
      pushEnabled: newValue,
      studyReminders,
      quietFrom,
      quietTo
    });
  }

  /* =============================
     STUDY REMINDER TOGGLE
  ============================= */
  async function handleStudyToggle() {
    const newValue = !studyReminders;

    if (!newValue && Platform.OS !== "web") {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }

    setStudyReminders(newValue);

    saveSettings({
      pushEnabled,
      studyReminders: newValue,
      quietFrom,
      quietTo
    });
  }

  /* =============================
     QUIET HOURS UPDATE
  ============================= */
  function updateQuietHours(type: "from" | "to", value: string) {
    if (type === "from") setQuietFrom(value);
    else setQuietTo(value);

    saveSettings({
      pushEnabled,
      studyReminders,
      quietFrom: type === "from" ? value : quietFrom,
      quietTo: type === "to" ? value : quietTo
    });
  }

  const ToggleItem = ({ icon, label, description, value, onToggle }: any) => (
    <View style={styles.toggleItem}>
      <View style={styles.toggleLeft}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={18} color="#475569" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemLabel}>{label}</Text>
          <Text style={styles.itemDesc}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#CBD5E1", true: "#34D399" }}
        thumbColor="#ffffff"
      />
    </View>
  );

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
      </View>

      <View style={styles.content}>

        {/* CHANNELS */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>CHANNELS</Text>

          <ToggleItem
            icon="notifications-outline"
            label="Push Notifications"
            description="Receive notifications on your device"
            value={pushEnabled}
            onToggle={handlePushToggle}
          />
        </View>

        {/* STUDY */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>STUDY</Text>

          <ToggleItem
            icon="time-outline"
            label="Study Reminders"
            description="Enable daily reminder notifications"
            value={studyReminders}
            onToggle={handleStudyToggle}
          />
        </View>

        {/* QUIET HOURS */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>QUIET HOURS</Text>

          <Text style={styles.itemDesc}>
            Notifications will be blocked during this time range
          </Text>

          <View style={styles.timeRow}>
            <View style={styles.timeBox}>
              <Text style={styles.timeLabel}>From</Text>
              <TextInput
                style={styles.timeInput}
                value={quietFrom}
                onChangeText={(value) => updateQuietHours("from", value)}
                placeholder="22:00"
              />
            </View>

            <View style={styles.timeBox}>
              <Text style={styles.timeLabel}>To</Text>
              <TextInput
                style={styles.timeInput}
                value={quietTo}
                onChangeText={(value) => updateQuietHours("to", value)}
                placeholder="08:00"
              />
            </View>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

/* =============================
   STYLES
============================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  header: {
    backgroundColor: "#1E40AF",
    paddingTop: 40,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40
  },

  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
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

  content: { padding: 20 },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 20,
    paddingVertical: 10,
    elevation: 2
  },

  cardHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748B",
    paddingHorizontal: 15,
    paddingBottom: 10
  },

  toggleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12
  },

  toggleLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    flex: 1
  },

  iconBox: {
    backgroundColor: "#F1F5F9",
    padding: 6,
    borderRadius: 8
  },

  itemLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B"
  },

  itemDesc: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    paddingHorizontal: 15
  },

  timeRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 15,
    marginTop: 15
  },

  timeBox: { flex: 1 },

  timeLabel: {
    fontSize: 11,
    color: "#64748B",
    marginBottom: 4
  },

  timeInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    textAlign: "center"
  }
});