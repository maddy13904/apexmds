import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function PrivacySecurityScreen({ navigation }: any) {
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [activityStatus, setActivityStatus] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const ToggleItem = ({ icon, label, description, value, onToggle }: any) => (
    <View style={styles.toggleItem}>
      <View style={styles.toggleLeft}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={18} color="#475569" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemLabel}>{label}</Text>
          <Text style={styles.itemDesc}>{description}</Text>
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#CBD5E1", true: "#34D399" }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  const MenuItem = ({ icon, label, description, onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.toggleLeft}>
        <View style={styles.iconBox}>
          <Ionicons name={icon} size={18} color="#475569" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.itemLabel}>{label}</Text>
          <Text style={styles.itemDesc}>{description}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.bgCircleSky} />
        <View style={styles.bgCircleGreen} />
        <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
      </View>
      </View>

      <View style={styles.content}>

        {/* Privacy */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>PRIVACY</Text>

          <ToggleItem
            icon={profileVisibility ? "eye-outline" : "eye-off-outline"}
            label="Profile Visibility"
            description="Allow others to see your profile and progress"
            value={profileVisibility}
            onToggle={() => setProfileVisibility(!profileVisibility)}
          />

          <View style={styles.divider} />

          <ToggleItem
            icon={activityStatus ? "eye-outline" : "eye-off-outline"}
            label="Activity Status"
            description="Show when you're active on ApexMDS"
            value={activityStatus}
            onToggle={() => setActivityStatus(!activityStatus)}
          />
        </View>

        {/* Security */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>SECURITY</Text>

          <ToggleItem
            icon="phone-portrait-outline"
            label="Two-Factor Authentication"
            description="Add an extra layer of security"
            value={twoFactorAuth}
            onToggle={() => setTwoFactorAuth(!twoFactorAuth)}
          />

          <View style={styles.divider} />

          <MenuItem
            icon="shield-checkmark-outline"
            label="Login History"
            description="View recent login activity"
            onPress={() => navigation.navigate("LoginHistory")}
          />
        </View>

        {/* Data Management */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>DATA MANAGEMENT</Text>

          <MenuItem
            icon="download-outline"
            label="Download Your Data"
            description="Get a copy of your ApexMDS data"
            onPress={() => navigation.navigate("DownloadData")}
          />

          <View style={styles.divider} />

          <MenuItem
            icon="trash-outline"
            label="Delete Account"
            description="Permanently delete your account and data"
            color="#DC2626"
            onPress={() => navigation.navigate("DeleteAccount")}
          />
        </View>

      </View>
    </ScrollView>
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
    padding: 20
  },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 20,
    paddingVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },

  cardHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748B",
    paddingHorizontal: 15,
    paddingVertical: 10
  },

  toggleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12
  },

  toggleLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    flex: 1
  },

  iconBox: {
    backgroundColor: "#F1F5F9",
    padding: 6,
    borderRadius: 8
  },

  itemLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B"
  },

  itemDesc: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 14
  },

  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 15
  }
});
