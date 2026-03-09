import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function PrivacyPolicyScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.bgCircleSky} />
        <View style={styles.bgCircleGreen} />
        <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        </View>
        <Text style={styles.headerSub}>Last updated: January 29, 2026</Text>
      </View>

      <View style={styles.body}>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="shield-checkmark" size={22} color="#1E40AF" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.infoTitle}>Your Privacy Matters</Text>
            <Text style={styles.infoText}>
              This Privacy Policy explains how ApexMDS collects, uses,
              and protects your personal information.
            </Text>
          </View>
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>

          <Text style={styles.sectionTitle}>1. Information We Collect</Text>
          <Text style={styles.paragraph}>
            We collect information to provide better services to our users.
          </Text>

          <Text style={styles.subTitle}>1.1 Information You Provide</Text>
          <Text style={styles.bullet}>• Account registration information</Text>
          <Text style={styles.bullet}>• Profile information</Text>
          <Text style={styles.bullet}>• Payment details</Text>
          <Text style={styles.bullet}>• Communications with support</Text>

          <Text style={styles.subTitle}>1.2 Automatically Collected</Text>
          <Text style={styles.bullet}>• Device information</Text>
          <Text style={styles.bullet}>• Usage data</Text>
          <Text style={styles.bullet}>• Study progress</Text>
          <Text style={styles.bullet}>• IP address</Text>

          <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
          <Text style={styles.bullet}>• Provide and improve services</Text>
          <Text style={styles.bullet}>• Personalize learning</Text>
          <Text style={styles.bullet}>• Track study progress</Text>
          <Text style={styles.bullet}>• Send reminders</Text>

          <Text style={styles.sectionTitle}>3. Data Security</Text>
          <Text style={styles.paragraph}>
            We use industry-standard security measures to protect your data.
            However, no online transmission is 100% secure.
          </Text>

          <Text style={styles.sectionTitle}>4. Data Retention</Text>
          <Text style={styles.paragraph}>
            We retain data only as long as necessary to provide services.
          </Text>

          <Text style={styles.sectionTitle}>5. Your Rights</Text>
          <Text style={styles.bullet}>• Access your data</Text>
          <Text style={styles.bullet}>• Correct information</Text>
          <Text style={styles.bullet}>• Delete your data</Text>
          <Text style={styles.bullet}>• Export your data</Text>

          <Text style={styles.sectionTitle}>6. Contact Us</Text>
          <View style={styles.contactBox}>
            <Text style={styles.paragraph}>ApexMDS Privacy Team</Text>
            <Text style={styles.paragraph}>Email: privacy@apexmds.com</Text>
            <Text style={styles.paragraph}>Phone: +91 1800-123-4567</Text>
          </View>

        </View>

        <Text style={styles.footerText}>
          Your privacy is important to us. We are committed to protecting your personal information.
        </Text>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  header: {
    backgroundColor: "#1E40AF",
    paddingTop: 25,
    paddingBottom: 35,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden"
  },

    bgCircleSky: {
    position: "absolute",
    width: 200,
    height: 200,
    backgroundColor: "#38BDF8",
    opacity: 0.2,
    borderRadius: 100,
    top: -60,
    left: -60
  },

  bgCircleGreen: {
    position: "absolute",
    width: 160,
    height: 160,
    backgroundColor: "#34D399",
    opacity: 0.2,
    borderRadius: 80,
    bottom: -40,
    right: -40
  },

     headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20
  },


  backButton: {
    padding: 6,
    borderRadius: 20
  },

  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4
  },
  headerSub: {
    color: "#BFDBFE",
    fontSize: 12,
    marginTop: 4
  },

  body: { padding: 20 },

  infoCard: {
    flexDirection: "row",
    backgroundColor: "#e8e8ffff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center"
  },
  infoTitle: { fontSize: 14, fontWeight: "700", color: "#2121a8ff" },
  infoText: { fontSize: 12, color: "#1c2387ff", marginTop: 2, flexShrink: 1 },

  contentCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 12,
    marginBottom: 6
  },

  subTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginTop: 8
  },

  paragraph: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 18
  },

  bullet: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 6,
    lineHeight: 18
  },

  contactBox: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 8
  },

  footerText: {
    fontSize: 11,
    color: "#94A3B8",
    textAlign: "center",
    marginTop: 15
  }
});
