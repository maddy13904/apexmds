import { useEffect, useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeContext } from "../ThemeContext";

export function AppSettingsScreen({ navigation }: any) {
  const theme = useContext(ThemeContext);

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [studyReminders, setStudyReminders] = useState(true);

  const ToggleItem = ({ icon, label, description, value, onToggle }: any) => (
    <View style={styles.toggleRow}>
      <View style={styles.toggleLeft}>
        <View style={[styles.iconBox, { backgroundColor: theme.darkMode ? "#1E293B" : "#F1F5F9" }]}>
          <Ionicons name={icon} size={18} color={theme.colors.textSecondary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>{label}</Text>
          <Text style={[styles.toggleDesc, { color: theme.colors.textSecondary }]}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#64748B", true: "#10B981" }}
        thumbColor="white"
      />
    </View>
  );

  const MenuItem = ({ icon, label, onPress }: any) => (
    <TouchableOpacity style={styles.menuRow} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={20} color={theme.colors.textSecondary} />
        <Text style={[styles.menuLabel, { color: theme.colors.text }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.card, borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>App Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {/* Appearance */}
        <Section title="Appearance" theme={theme}>
          <ToggleItem
            icon={theme.darkMode ? "moon" : "sunny"}
            label="Dark Mode"
            description="Switch to dark theme for night study"
            value={theme.darkMode}
            onToggle={theme.toggleDarkMode}
          />
        </Section>

        {/* Notifications */}
        <Section title="Notifications" theme={theme}>
          <ToggleItem
            icon="notifications"
            label="Push Notifications"
            description="Receive alerts for new content"
            value={pushNotifications}
            onToggle={() => setPushNotifications(!pushNotifications)}
          />
          <Divider theme={theme} />
          <ToggleItem
            icon="mail"
            label="Email Notifications"
            description="Get weekly progress reports"
            value={emailNotifications}
            onToggle={() => setEmailNotifications(!emailNotifications)}
          />
          <Divider theme={theme} />
          <ToggleItem
            icon="time"
            label="Study Reminders"
            description="Daily reminders to maintain streak"
            value={studyReminders}
            onToggle={() => setStudyReminders(!studyReminders)}
          />
        </Section>

        {/* Study Preferences */}
        <Section title="Study Preferences" theme={theme}>
          <MenuItem icon="calendar" label="Daily Study Goal" />
          <Divider theme={theme} />
          <MenuItem icon="alarm" label="Reminder Times" />
          <Divider theme={theme} />
          <MenuItem icon="language" label="Language" />
        </Section>

        {/* Data */}
        <Section title="Data & Storage" theme={theme}>
          <MenuItem icon="trash" label="Clear Cache" />
          <Divider theme={theme} />
          <MenuItem icon="cloud-download" label="Download for Offline" />
        </Section>

        {/* About */}
        <Section title="About" theme={theme}>
          <MenuItem 
            icon="information-circle" 
            label="About ApexMDS"
            onPress={() => navigation.navigate("AboutApexMDS")}
          />
          <Divider theme={theme} />
          <MenuItem icon="document-text" label="Terms of Service" />
          <Divider theme={theme} />
          <MenuItem icon="shield-checkmark" label="Privacy Policy" />

          <View style={styles.versionRow}>
            <View style={styles.menuLeft}>
              <Ionicons name="information-circle" size={20} color={theme.colors.textSecondary} />
              <Text style={[styles.menuLabel, { color: theme.colors.text }]}>App Version</Text>
            </View>
            <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>1.0.0</Text>
          </View>
        </Section>

      </ScrollView>
    </View>
  );
}

/* Section Wrapper */
function Section({ title, children, theme }: any) {
  return (
    <View style={[styles.sectionBox, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
      <View style={[styles.sectionHeader, { backgroundColor: theme.darkMode ? "#1E293B" : "#F1F5F9", borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

/* Divider */
function Divider({ theme }: any) {
  return <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />;
}

/* Styles */
const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingTop: 50,
    paddingBottom: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold"
  },

  content: {
    padding: 20,
    paddingBottom: 40
  },

  sectionBox: {
    borderRadius: 16,
    marginBottom: 18,
    borderWidth: 1,
    overflow: "hidden"
  },

  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderBottomWidth: 1
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1
  },

  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14
  },

  toggleLeft: {
    flexDirection: "row",
    gap: 12,
    flex: 1
  },

  iconBox: {
    padding: 8,
    borderRadius: 8
  },

  toggleLabel: {
    fontSize: 14,
    fontWeight: "600"
  },

  toggleDesc: {
    fontSize: 11,
    marginTop: 2
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
    fontWeight: "500"
  },

  divider: {
    height: 1
  },

  versionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14
  },

  versionText: {
    fontSize: 13,
    fontFamily: "monospace"
  }
});
