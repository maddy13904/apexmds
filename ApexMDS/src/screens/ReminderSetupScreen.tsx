import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import {
  scheduleReminderNotification
} from "../utils/reminderNotifications";

export function ReminderSetupScreen({ navigation, route }: any) {

  const editReminder = route?.params?.editReminder;

  const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const [label, setLabel] = useState("");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  /* ===============================
     PREFILL WHEN EDITING
  =============================== */

  useEffect(() => {
    if (editReminder) {

      setLabel(editReminder.label);
      setSelectedDays(editReminder.days || []);

      const [hour, minute] = editReminder.time.split(":").map(Number);

      const newDate = new Date();
      newDate.setHours(hour);
      newDate.setMinutes(minute);

      setTime(newDate);
    }
  }, [editReminder]);

  function toggleDay(day: string) {

    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );

  }

  /* ===============================
     NOTIFICATION PERMISSION
  =============================== */

  async function ensureNotificationPermission() {

    const { status } = await Notifications.getPermissionsAsync();

    if (status === "granted") return true;

    const request = await Notifications.requestPermissionsAsync();

    return request.status === "granted";

  }

  /* ===============================
     LOAD SETTINGS FROM SERVER
  =============================== */

  async function getNotificationSettings() {

    try {

      const res = await api.get("/notification-settings");

      return res.data;

    } catch {

      return {
        pushEnabled: true,
        studyReminders: true,
        quietFrom: "22:00",
        quietTo: "08:00"
      };

    }

  }

  /* ===============================
     QUIET HOURS CHECK
  =============================== */

  function isQuietHours(now: Date, from: string, to: string) {

    const [fromH, fromM] = from.split(":").map(Number);
    const [toH, toM] = to.split(":").map(Number);

    const fromMinutes = fromH * 60 + fromM;
    const toMinutes = toH * 60 + toM;

    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    if (fromMinutes < toMinutes) {
      return nowMinutes >= fromMinutes && nowMinutes <= toMinutes;
    }

    return nowMinutes >= fromMinutes || nowMinutes <= toMinutes;

  }

  /* ===============================
     SCHEDULE NOTIFICATIONS
  =============================== */

  async function scheduleNotification(reminder: any) {

    if (Platform.OS === "web") return [];

    const permission = await ensureNotificationPermission();

    if (!permission) {
      console.log("Notification permission denied");
      return [];
    }

    const settings = await getNotificationSettings();

    if (!settings.pushEnabled || !settings.studyReminders) {
      return [];
    }

    const now = new Date();

    if (isQuietHours(now, settings.quietFrom, settings.quietTo)) {
      return [];
    }

    const [hour, minute] = reminder.time.split(":").map(Number);

    const ids: string[] = [];

    const dayMap: any = {
      Sun: 1,
      Mon: 2,
      Tue: 3,
      Wed: 4,
      Thu: 5,
      Fri: 6,
      Sat: 7
    };

    for (let day of reminder.days) {

      const weekdayIndex = dayMap[day];
      if (!weekdayIndex) continue;

      const trigger: any = {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: weekdayIndex,
        hour,
        minute,
        channelId: "default"
      };

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "📚 Study Reminder",
          body: reminder.label,
          sound: true
        },
        trigger
      });

      ids.push(id);

    }

    return ids;

  }

  /* ===============================
     CANCEL OLD NOTIFICATIONS
  =============================== */

  async function cancelNotifications(notificationIds?: string[]) {

    if (!notificationIds || Platform.OS === "web") return;

    for (let id of notificationIds) {

      await Notifications.cancelScheduledNotificationAsync(id);

    }

  }

  /* ===============================
     SAVE REMINDER
  =============================== */

  async function saveReminder() {

  if (!label.trim() || selectedDays.length === 0) {
    Alert.alert("Error", "Please enter label and select at least one day.");
    return;
  }

  try {

    const formattedTime = time.toTimeString().slice(0,5);

    /* LOAD CURRENT SETTINGS FROM SERVER */

    const res = await api.get("/notification-settings");

    let reminders = res.data.reminderTimes || [];

    /* IF EDITING REMOVE OLD REMINDER */

    if (editReminder) {

      reminders = reminders.filter(
        (r: any) => r.id !== editReminder.id
      );

      await cancelNotifications(editReminder.notificationIds);

    }

    const newReminder = {
      id: editReminder ? editReminder.id : Date.now(),
      label: label.trim(),
      time: formattedTime,
      days: selectedDays,
      enabled: true
    };

    reminders.push(newReminder);

    /* SAVE TO BACKEND */

    await api.put("/notification-settings", {
      reminderTimes: reminders
    });

    /* SCHEDULE LOCAL NOTIFICATIONS */

    const notificationIds = await scheduleReminderNotification(newReminder);

    navigation.goBack();

  } catch (error) {

    console.log("Save reminder error:", error);
    Alert.alert("Error", "Failed to save reminder");

  }

}

  /* ===============================
     UI
  =============================== */

  return (

    <View style={styles.container}>

      <View style={styles.header}>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text style={styles.title}>
          {editReminder ? "Edit Reminder" : "Add Reminder"}
        </Text>

      </View>

      <Text style={styles.label}>Reminder Label</Text>

      <TextInput
        value={label}
        onChangeText={setLabel}
        placeholder="Morning Study"
        style={styles.input}
      />

      <Text style={styles.label}>Select Time</Text>

      <TouchableOpacity
        style={styles.timeButton}
        onPress={() => setShowPicker(true)}
      >

        <Text style={styles.timeText}>
          {time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })}
        </Text>

      </TouchableOpacity>

      {showPicker && (

        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) => {

            setShowPicker(false);

            if (selectedDate) setTime(selectedDate);

          }}
        />

      )}

      <Text style={styles.label}>Repeat On</Text>

      <View style={styles.daysRow}>

        {weekDays.map(day => {

          const active = selectedDays.includes(day);

          return (

            <TouchableOpacity
              key={day}
              style={[
                styles.dayBox,
                active && styles.dayBoxActive
              ]}
              onPress={() => toggleDay(day)}
            >

              <Text
                style={[
                  styles.dayText,
                  active && styles.dayTextActive
                ]}
              >
                {day}
              </Text>

            </TouchableOpacity>

          );

        })}

      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveReminder}
      >

        <Text style={styles.saveText}>
          {editReminder ? "Update Reminder" : "Save Reminder"}
        </Text>

      </TouchableOpacity>

    </View>

  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 25
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A"
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 8,
    marginTop: 15
  },
  input: {
    backgroundColor: "white",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  timeButton: {
    backgroundColor: "white",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  timeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2563EB"
  },
  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8
  },
  dayBox: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "white"
  },
  dayBoxActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB"
  },
  dayText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#64748B"
  },
  dayTextActive: {
    color: "white"
  },
  saveButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 15,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    elevation: 3
  },
  saveText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14
  }
});