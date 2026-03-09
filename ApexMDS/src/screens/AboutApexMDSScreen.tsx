import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function AboutApexMDSScreen({ navigation }: any) {
  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={22} color="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>About ApexMDS</Text>

        <View style={{ width: 36 }} />
      </View>

      {/* Content */}
      <View style={styles.content}>

        {/* Logo Placeholder */}
        <View style={styles.logoBox}>
          <Ionicons name="school-outline" size={50} color="#2563EB" />
        </View>

        <Text style={styles.appName}>ApexMDS</Text>
        <Text style={styles.tagline}>
          AI-Based NEET MDS Preparation Platform
        </Text>

        <Text style={styles.description}>
          ApexMDS is a smart learning platform designed to help dental students 
          prepare efficiently for the NEET MDS examination. The application 
          provides AI-powered personalized study plans, adaptive question practice, 
          instant explanations, revision guidance, and performance analytics — 
          all in one mobile-friendly experience.
        </Text>

        {/* Info Cards */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Developed By</Text>
          <Text style={styles.infoValue}>ApexMDS Development Team</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Institution</Text>
          <Text style={styles.infoValue}>
            Saveetha Institute of Medical and Technical Sciences
          </Text>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#E2E8F0"
  },

  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center"
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A"
  },

  content: {
    padding: 20,
    alignItems: "center"
  },

  logoBox: {
    width: 90,
    height: 90,
    borderRadius: 20,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15
  },

  appName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A"
  },

  tagline: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 20
  },

  description: {
    fontSize: 13,
    color: "#475569",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 25
  },

  infoCard: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10
  },

  infoTitle: {
    fontSize: 12,
    color: "#64748B"
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginTop: 4
  }
});
