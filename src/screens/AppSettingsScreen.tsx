import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function AppSettingsScreen({ navigation }: any) {
  const { logout } = useAuth();

  const MenuItem = ({ icon, label, onPress }: any) => (
    <TouchableOpacity style={styles.menuRow} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={20} color="#475569" />
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.bgCircleSky} />
        <View style={styles.bgCircleGreen} />
        <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>App Settings</Text>
      </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Study Preferences */}
        <Section title="Study Preferences">
          <MenuItem 
            icon="calendar-outline" 
            label="Daily Study Goal"
            onPress={() => navigation.navigate("DailyStudyPlan")}
          />
          <Divider />
          <MenuItem 
            icon="alarm-outline" 
            label="Reminder Times"
            onPress={() => navigation.navigate("ReminderTime")}
          />
        </Section>

        {/* Data & Storage */}
        <Section title="Data & Storage">
          <MenuItem 
            icon="cloud-download-outline" 
            label="Downloaded E-Books"
            onPress={() => navigation.navigate("DownloadedEbooks")}
          />
        </Section>

        {/* About */}
        <Section title="About">
          <MenuItem 
            icon="information-circle-outline" 
            label="About ApexMDS"
            onPress={() => navigation.navigate("AboutApexMDS")}
          />
          <Divider />
          <MenuItem 
            icon="document-text-outline" 
            label="Terms of Service"
            onPress={() => navigation.navigate("TermsOfService")}
          />
          <Divider />
          <MenuItem 
            icon="shield-checkmark-outline" 
            label="Privacy Policy"
            onPress={() => navigation.navigate("PrivacyPolicy")}
          />

          {/* App Version */}
          <View style={styles.versionRow}>
            <View style={styles.menuLeft}>
              <Ionicons name="apps-outline" size={20} color="#475569" />
              <Text style={styles.menuLabel}>App Version</Text>
            </View>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </Section>

        {/* Logout */}
        <TouchableOpacity
  style={styles.logoutButton}
  activeOpacity={0.8}
  onPress={async () => {
    await AsyncStorage.removeItem("ai_chat_history");
    await logout();
  }}
>
  <Ionicons name="log-out-outline" size={20} color="#DC2626" />
  <Text style={styles.logoutText}>Logout</Text>
</TouchableOpacity>

      </ScrollView>
    </View>
  );
}

/* Section Wrapper */
function Section({ title, children }: any) {
  return (
    <View style={styles.sectionBox}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

/* Divider */
function Divider() {
  return <View style={styles.divider} />;
}

/* Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },

header: {
    backgroundColor: "#1E40AF",
    paddingTop: 40,
    paddingBottom: 25,
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
    fontSize: 18,
    fontWeight: "bold"
  },

  content: {
    padding: 20,
    paddingBottom: 40
  },

  sectionBox: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden"
  },

  sectionHeader: {
    backgroundColor: "#F1F5F9",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0"
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 1
  },

  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },

  menuLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155"
  },

  divider: {
    height: 1,
    backgroundColor: "#E2E8F0"
  },

  versionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14
  },

  versionText: {
    fontSize: 13,
    color: "#64748B",
    fontFamily: "monospace"
  },

  logoutButton: {
    marginTop: 10,
    backgroundColor: "#FEE2E2",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8
  },

  logoutText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626"
  }
});
