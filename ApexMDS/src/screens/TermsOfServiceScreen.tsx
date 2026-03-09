import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function TermsOfServiceScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>

      {/* Gradient Header */}
      <View style={styles.header}>
              <View style={styles.bgCircleSky} />
              <View style={styles.bgCircleGreen} />
        <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Terms of Service</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Last updated: January 29, 2026
        </Text>
      </View>

      <View style={styles.content}>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="document-text-outline" size={22} color="#2563EB" />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.infoTitle}>Important Information</Text>
            <Text style={styles.infoText}>
              Please read these terms carefully before using ApexMDS. 
              By using our services, you agree to be bound by these terms.
            </Text>
          </View>
        </View>

        {/* Main Content Card */}
        <View style={styles.card}>

          <Section
            title="1. Acceptance of Terms"
            text={[
              "By accessing and using ApexMDS - AI Based NEET MDS Preparation App, you accept and agree to be bound by these terms.",
              "If you do not agree to these Terms of Service, please do not use the App."
            ]}
          />

          <Section
            title="2. Use of Service"
            text={[
              "ApexMDS provides an educational platform for NEET MDS exam preparation. You agree to use the service only for lawful purposes."
            ]}
            bullets={[
              "You must be at least 18 years old to use this service",
              "You are responsible for maintaining account confidentiality",
              "You agree not to share your account credentials",
              "You will not use the service for illegal purposes"
            ]}
          />

          <Section
            title="3. Intellectual Property"
            text={[
              "All content in the App including text, graphics, study materials, and software is property of ApexMDS and protected by law.",
              "You may not reproduce or distribute content without permission."
            ]}
          />

          <Section
            title="4. User Conduct"
            bullets={[
              "Do not post unlawful or offensive content",
              "Do not attempt unauthorized system access",
              "Do not disrupt services",
              "Do not impersonate others"
            ]}
          />

          <Section
            title="5. Subscription and Payment"
            bullets={[
              "Provide accurate billing information",
              "Pay subscription fees on time",
              "Automatic renewal unless cancelled",
              "Refunds follow our policy"
            ]}
          />

          <Section
            title="6. Disclaimers"
            bullets={[
              "Service may be uninterrupted or error-free",
              "No guarantee of exam results",
              "Content accuracy not guaranteed"
            ]}
          />

          <Section
            title="7. Termination"
            text={[
              "ApexMDS may terminate accounts violating terms without notice."
            ]}
          />

          <Section
            title="8. Changes to Terms"
            text={[
              "Terms may change anytime. Continued usage implies acceptance."
            ]}
          />

          <Section
            title="9. Governing Law"
            text={[
              "These Terms are governed by the laws of India."
            ]}
          />

          <Section
            title="10. Contact Information"
            text={[
              "ApexMDS Support Team",
              "Email: support@apexmds.com",
              "Phone: +91 1800-123-4567"
            ]}
          />

        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          By using ApexMDS, you acknowledge that you have read and understood these Terms of Service.
        </Text>

      </View>
    </ScrollView>
  );
}

/* Section Component */
function Section({ title, text, bullets }: any) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {text && text.map((t: string, i: number) => (
        <Text key={i} style={styles.paragraph}>{t}</Text>
      ))}

      {bullets && bullets.map((b: string, i: number) => (
        <View key={i} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>{b}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },

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

  headerSubtitle: {
    color: "#BFDBFE",
    fontSize: 12,
    marginTop: 4
  },

  content: {
    padding: 20
  },

  infoCard: {
    flexDirection: "row",
    backgroundColor: "#DBEAFE",
    padding: 14,
    borderRadius: 14,
    marginBottom: 16
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E40AF"
  },

  infoText: {
    fontSize: 12,
    color: "#1E3A8A",
    marginTop: 3
  },

  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 18,
    marginBottom: 18,
    elevation: 2
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 6
  },

  paragraph: {
    fontSize: 13,
    color: "#475569",
    marginBottom: 4,
    lineHeight: 18
  },

  bulletRow: {
    flexDirection: "row",
    marginBottom: 4
  },

  bulletDot: {
    fontSize: 14,
    color: "#2563EB",
    marginRight: 6
  },

  bulletText: {
    fontSize: 13,
    color: "#475569",
    flex: 1
  },

  footer: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 20
  }
});
