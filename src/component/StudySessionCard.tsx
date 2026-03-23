import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StudySessionCardProps {
  subject: string;
  time: string;
  duration: string;
  topic: string;
  onPress?: () => void;
}

export function StudySessionCard({
  subject,
  time,
  duration,
  topic,
  onPress,
}: StudySessionCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.card}
    >
      {/* Icon */}
      <View style={styles.iconBox}>
        <Ionicons name="calendar" size={22} color="#4F46E5" />
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        <Text style={styles.subject}>{subject}</Text>
        <Text style={styles.topic}>{topic}</Text>
      </View>

      {/* Time */}
      <View style={{ alignItems: "flex-end" }}>
        <View style={styles.timeRow}>
          <Ionicons name="time-outline" size={14} color="#334155" />
          <Text style={styles.timeText}>{time}</Text>
        </View>
        <Text style={styles.duration}>{duration}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 10,
    elevation: 1,
  },
  iconBox: {
    height: 56,
    width: 56,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
  },
  subject: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  topic: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },
  duration: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
});
