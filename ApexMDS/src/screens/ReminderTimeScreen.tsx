import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import api from "../services/api";
import {
  scheduleReminderNotification,
  cancelAllReminderNotifications
} from "../utils/reminderNotifications";

interface Reminder {
  id: number;
  label: string;
  time: string;
  days: string[];
  enabled: boolean;
}

export function ReminderTimesScreen({ navigation }: any) {

  const [reminders, setReminders] = useState<Reminder[]>([]);

  /* ===============================
     LOAD REMINDERS
  =============================== */

  useFocusEffect(
    useCallback(() => {
      loadReminders();
    }, [])
  );

 async function loadReminders() {

  try {

    const res = await api.get("/notification-settings");

    const times = res.data.reminderTimes || [];

    setReminders(times);

    await cancelAllReminderNotifications();

    for (const reminder of times) {

      if (reminder.enabled) {
        await scheduleReminderNotification(reminder);
      }

    }

  } catch (error) {

    console.log("Load reminders error:", error);

  }

}

  /* ===============================
     DELETE REMINDER
  =============================== */

  async function deleteReminder(id: number) {

    try {

      const res = await api.get("/notification-settings");

      const updatedTimes = (res.data.reminderTimes || []).filter(
        (r: Reminder) => r.id !== id
      );

      await api.put("/notification-settings", {
        ...res.data,
        reminderTimes: updatedTimes
      });

      setReminders(updatedTimes);

    } catch (error) {

      console.log("Delete reminder error:", error);

    }

  }

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <View style={styles.bgCircleSky} />
        <View style={styles.bgCircleGreen} />

        <View style={styles.headerContent}>

          <View style={styles.headerRow}>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>
              Reminder Times
            </Text>

          </View>

          <Text style={styles.headerSub}>
            Manage your study reminders
          </Text>

        </View>

      </View>

      {/* BODY */}

      <View style={styles.body}>

        <Text style={styles.sectionTitle}>
          YOUR REMINDERS
        </Text>

        {reminders.length === 0 ? (

          <View style={{ alignItems: "center", marginTop: 40 }}>

            <Ionicons
              name="notifications-off-outline"
              size={40}
              color="#94A3B8"
            />

            <Text style={{ marginTop: 10, color: "#64748B" }}>
              No reminders yet
            </Text>

          </View>

        ) : (

          reminders.map(reminder => (

            <TouchableOpacity
              key={reminder.id}
              style={styles.reminderCard}
              onPress={() =>
                navigation.navigate("AddReminder", {
                  editReminder: reminder
                })
              }
            >

              <View style={{ flex: 1 }}>

                <Text style={styles.timeText}>
                  {reminder.time}
                </Text>

                <Text style={styles.labelText}>
                  {reminder.label}
                </Text>

                {reminder.days?.length > 0 && (
                  <Text style={styles.daysText}>
                    {reminder.days.join(", ")}
                  </Text>
                )}

              </View>

              <TouchableOpacity
                onPress={() => deleteReminder(reminder.id)}
                style={{ marginLeft: 10 }}
              >

                <Ionicons
                  name="trash-outline"
                  size={18}
                  color="#EF4444"
                />

              </TouchableOpacity>

            </TouchableOpacity>

          ))

        )}

        {/* ADD BUTTON */}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddReminder")}
        >

          <Ionicons name="add-circle-outline" size={20} color="white" />

          <Text style={styles.addText}>
            Add New Reminder
          </Text>

        </TouchableOpacity>

      </View>

    </ScrollView>
  );
}

/* ===============================
   STYLES
=============================== */

const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: "#F8FAFC" },

  header: {
    backgroundColor: "#1E40AF",
    paddingTop: 25,
    paddingBottom: 35,
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

  headerContent: {
    paddingHorizontal: 20
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20
  },

  backButton: {
    padding: 6,
    borderRadius: 20
  },

  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  },

  headerSub: {
    color: "#DBEAFE",
    fontSize: 13,
    marginLeft: 45
  },

  body: { padding: 20 },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748B",
    marginBottom: 10
  },

  reminderCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10
  },

  timeText: {
    fontSize: 16,
    fontWeight: "bold"
  },

  labelText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2
  },

  daysText: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2
  },

  addButton: {
    backgroundColor: "#2563EB",
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15
  },

  addText: {
    fontSize: 13,
    fontWeight: "600",
    color: "white",
    marginLeft: 6
  }

});