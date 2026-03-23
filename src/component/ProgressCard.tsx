import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ProgressCardProps {
  subject: string;
  progress: number;
  label: string;
  color?: string;
}

export function ProgressCard({
  subject,
  progress,
  label,
  color = "#0EA5E9", // default sky blue
}: ProgressCardProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.subject}>{subject}</Text>
          <View style={styles.labelRow}>
            <Ionicons name="trending-up" size={14} color="#10B981" />
            <Text style={styles.labelText}>{label}</Text>
          </View>
        </View>

        <View style={styles.percentBadge}>
          <Text style={styles.percentText}>{progress}%</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBackground}>
        <Animated.View
          style={[
            styles.progressFill,
            { width: widthInterpolated, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  subject: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  labelText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
    color: "#10B981",
  },
  percentBadge: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  percentText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0284C7",
  },
  progressBackground: {
    height: 10,
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
  },
});
