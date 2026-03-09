import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function SplashScreen({ navigation }: any) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo scale + fade animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true
      })
    ]).start();

    // Spinner animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();

    // Move to Login after 2.5 seconds
    const timer = setTimeout(() => {
      navigation.replace("Login");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"]
  });

  return (
    <View style={styles.container}>

      {/* Background Decorative Circles */}
      <View style={styles.bgCircleTop} />
      <View style={styles.bgCircleBottom} />

      {/* Logo Section */}
      <Animated.View
        style={[
          styles.logoContainer,
          { transform: [{ scale: scaleAnim }], opacity: opacityAnim }
        ]}
      >
        <View style={styles.logoBox}>
          <Ionicons name="pulse" size={48} color="#1E3A8A" />
        </View>

        <Text style={styles.logoText}>ApexMDS</Text>
        <Text style={styles.tagline}>
          AI Based NEET MDS Preparation
        </Text>
      </Animated.View>

      {/* Loading Spinner */}
      <View style={styles.spinnerContainer}>
        <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E3A8A",
    alignItems: "center",
    justifyContent: "center",
    position: "relative"
  },

  bgCircleTop: {
    position: "absolute",
    top: -100,
    left: -100,
    width: 200,
    height: 200,
    backgroundColor: "#38BDF8",
    borderRadius: 100,
    opacity: 0.2
  },

  bgCircleBottom: {
    position: "absolute",
    bottom: -100,
    right: -100,
    width: 200,
    height: 200,
    backgroundColor: "#10B981",
    borderRadius: 100,
    opacity: 0.2
  },

  logoContainer: {
    alignItems: "center"
  },

  logoBox: {
    width: 96,
    height: 96,
    backgroundColor: "white",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    elevation: 10
  },

  logoText: {
    fontSize: 34,
    fontWeight: "bold",
    color: "white",
    marginBottom: 6
  },

  tagline: {
    fontSize: 12,
    color: "#BFDBFE",
    letterSpacing: 1
  },

  spinnerContainer: {
    position: "absolute",
    bottom: 50
  },

  spinner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
    borderTopColor: "white"
  }
});
