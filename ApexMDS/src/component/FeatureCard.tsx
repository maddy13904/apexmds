import React, { useEffect, useRef } from "react";
import { Text, TouchableOpacity, StyleSheet, Animated, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FeatureCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color?: string;
  backgroundColor?: string;
  onPress: () => void;
  delay?: number;
}

export function FeatureCard({
  title,
  icon,
  color = "#2563EB",
  backgroundColor = "#EFF6FF",
  onPress,
  delay = 0,
}: FeatureCardProps) {

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay * 1000),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: translateAnim }],
      }}
    >
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
        
        <View style={[styles.iconBox, { backgroundColor }]}>
          <Ionicons name={icon} size={26} color={color} />
        </View>

        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  iconBox: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
  },
});
