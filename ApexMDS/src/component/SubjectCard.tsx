import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SubjectCardProps {
  title: string;
  count: number;
  progress: number;
  colorClass?: string; // optional background color
  onPress: () => void;
}

export function SubjectCard({
  title,
  count,
  progress,
  colorClass = "#EEF2FF",
  onPress,
}: SubjectCardProps) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      
      {/* Left Icon Box */}
      <View style={[styles.iconBox, { backgroundColor: colorClass }]}>
        <Ionicons name="book-outline" size={24} color="#4F46E5" />
      </View>

      {/* Center Content */}
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.count}>{count} Topics</Text>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </View>

      {/* Right Arrow */}
      <Ionicons name="chevron-forward" size={22} color="#CBD5E1" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 10,
    elevation: 1,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  count: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  progressBar: {
    marginTop: 6,
    height: 5,
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#22C55E",
    borderRadius: 10,
  },
});
