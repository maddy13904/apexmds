import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

export function GradientHeader({ title, subtitle, navigation }: any) {
  return (
    <LinearGradient
      colors={["#2563EB", "#1D4ED8", "#1E40AF"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 55,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8
  },
  subtitle: {
    color: "#BFDBFE",
    fontSize: 12,
    marginTop: 4
  }
});
