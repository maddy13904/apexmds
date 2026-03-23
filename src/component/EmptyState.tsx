import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface EmptyStateProps {
  message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    // Sparkle wiggle loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2500),
      ])
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ["-10deg", "10deg"],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      
      {/* Illustration Circle */}
      <View style={styles.circle}>
        <Ionicons name="happy-outline" size={60} color="#F59E0B" />

        {/* Sparkle */}
        <Animated.Text style={[styles.sparkle, { transform: [{ rotate }] }]}>
          ✨
        </Animated.Text>
      </View>

      {/* Message */}
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },

  circle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    position: "relative",
  },

  sparkle: {
    position: "absolute",
    top: -5,
    right: -5,
    fontSize: 22,
  },

  message: {
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
    color: "#475569",
    maxWidth: 260,
  },
});
