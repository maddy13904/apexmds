import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function AddReminderScreen({ navigation, route }: any) {
  const { onSave } = route.params || {};

  const [label, setLabel] = useState("");
  const [time, setTime] = useState("09:00");
  const [enabled, setEnabled] = useState(true);
  const [selectedDays, setSelectedDays] = useState<string[]>([
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
  ]);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const handleSave = () => {
    if (!label.trim()) {
      Alert.alert("Error", "Please enter reminder label");
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert("Error", "Select at least one day");
      return;
    }

    const reminder = {
      id: Date.now(),
      label,
      time,
      enabled,
      days: selectedDays,
    };

    onSave?.(reminder);
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.bgCircleSky} />
        <View style={styles.bgCircleGreen} />
        <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Reminder</Text>
      </View>
      </View>

      <View style={styles.content}>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="notifications-outline" size={20} color="#2563EB" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.infoTitle}>Stay Consistent</Text>
            <Text style={styles.infoText}>
              Set reminders so you never miss your study sessions.
            </Text>
          </View>
        </View>

        {/* Reminder Label */}
        <View style={styles.card}>
          <Text style={styles.label}>Reminder Label *</Text>
          <View style={styles.inputBox}>
            <Ionicons name="create-outline" size={18} color="#64748B" />
            <TextInput
              style={styles.input}
              placeholder="e.g. Morning Study"
              value={label}
              onChangeText={setLabel}
            />
          </View>
        </View>

        {/* Time Picker (simple input for now) */}
        <View style={styles.card}>
          <Text style={styles.label}>Reminder Time *</Text>
          <View style={styles.inputBox}>
            <Ionicons name="time-outline" size={18} color="#64748B" />
            <TextInput
              style={styles.input}
              value={time}
              onChangeText={setTime}
              placeholder="HH:MM"
            />
          </View>
          <Text style={styles.helperText}>Use 24-hour format (HH:MM)</Text>
        </View>

        {/* Repeat Days */}
        <View style={styles.card}>
          <Text style={styles.label}>Repeat On *</Text>
          <View style={styles.daysRow}>
            {weekDays.map((day) => {
              const active = selectedDays.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayChip,
                    active && styles.dayChipActive,
                  ]}
                  onPress={() => toggleDay(day)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      active && styles.dayTextActive,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.helperText}>
            {selectedDays.length === 7
              ? "Every day"
              : `${selectedDays.length} day(s) selected`}
          </Text>
        </View>

        {/* Enable Switch */}
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.label}>Enable Reminder</Text>
              <Text style={styles.helperText}>
                Receive notification at scheduled time
              </Text>
            </View>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{ false: "#CBD5E1", true: "#93C5FD" }}
              thumbColor={enabled ? "#2563EB" : "#F1F5F9"}
            />
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Ionicons name="checkmark-circle-outline" size={18} color="white" />
            <Text style={styles.saveText}>Save Reminder</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

   header: {
    backgroundColor: "#1E40AF",
    paddingTop: 25,
    paddingBottom: 35,
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
    gap: 10,
    marginBottom: 20
  },


  backButton: {
    padding: 6,
    borderRadius: 20
  },

  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  content: {
    padding: 20,
    maxWidth: 420,
    alignSelf: "center",
    width: "100%",
  },

  infoCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E40AF",
  },

  infoText: {
    fontSize: 12,
    color: "#1E3A8A",
    marginTop: 4,
  },

  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#F8FAFC",
  },

  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },

  helperText: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 6,
  },

  daysRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  dayChip: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F8FAFC",
  },

  dayChipActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },

  dayText: {
    fontSize: 12,
    color: "#475569",
    fontWeight: "600",
  },

  dayTextActive: {
    color: "white",
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },

  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },

  cancelText: {
    color: "#334155",
    fontWeight: "600",
  },

  saveButton: {
    flex: 1,
    backgroundColor: "#2563EB",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },

  saveText: {
    color: "white",
    fontWeight: "600",
  },
});
