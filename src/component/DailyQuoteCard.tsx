import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface DailyQuoteCardProps {
  quote: string;
  author: string;
}

export function DailyQuoteCard({ quote, author }: DailyQuoteCardProps) {
  return (
    <View style={styles.card}>
      
      {/* Decorative Background Glow */}
      <View style={styles.glow} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="sparkles" size={18} color="#0EA5E9" />
          <Text style={styles.headerText}>Daily Inspiration</Text>
        </View>

        {/* Quote */}
        <Text style={styles.quote}>
          “{quote}”
        </Text>

        {/* Author */}
        <View style={styles.footer}>
          <Text style={styles.author}>— {author}</Text>
          <View style={styles.line} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#FEF3C7",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: "hidden",
    marginBottom: 16
  },

  glow: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    backgroundColor: "#E0F2FE",
    borderRadius: 60,
    opacity: 0.6
  },

  content: {
    position: "relative"
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10
  },

  headerText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0EA5E9",
    textTransform: "uppercase",
    letterSpacing: 1
  },

  quote: {
    fontSize: 18,
    fontWeight: "500",
    color: "#334155",
    lineHeight: 26,
    marginBottom: 14
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },

  author: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500"
  },

  line: {
    height: 4,
    width: 50,
    borderRadius: 4,
    backgroundColor: "#38BDF8"
  }
});
