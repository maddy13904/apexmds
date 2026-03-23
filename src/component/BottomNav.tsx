import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const navItems = [
    { id: "home", icon: "home", label: "Home" },
    { id: "ebooks", icon: "book", label: "E-Books" },
    { id: "practice", icon: "create", label: "Practice" },
    { id: "aitutor", icon: "sparkles", label: "AI Tutor" },
    { id: "performance", icon: "bar-chart", label: "Stats" }
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const isActive = activeTab === item.id;

        return (
          <TouchableOpacity
            key={item.id}
            style={styles.tabButton}
            onPress={() => onTabChange(item.id)}
          >
            {/* Active Indicator */}
            {isActive && <View style={styles.activePill} />}

            <Ionicons
              name={item.icon as keyof typeof Ionicons.glyphMap}
              size={24}
              color={isActive ? "#1E3A8A" : "#94A3B8"}
            />

            <Text
              style={[
                styles.label,
                { color: isActive ? "#1E3A8A" : "#94A3B8" }
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingVertical: 10,
    paddingBottom: 18
  },

  tabButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 60
  },

  activePill: {
    position: "absolute",
    top: -6,
    width: 30,
    height: 4,
    backgroundColor: "#1E3A8A",
    borderRadius: 10
  },

  label: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2
  }
});
