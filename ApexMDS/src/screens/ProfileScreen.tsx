import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { getMyProfile } from "../services/user.service";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function ProfileScreen({ navigation }: any) {
  const { logout } = useAuth();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Load profile every time screen is focused
  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await getMyProfile();
      setUser(res.data.user);
    } catch (error) {
      console.log("PROFILE LOAD ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const MenuItem = ({ icon, label, onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuLeft}>
        <Ionicons name={icon} size={20} color="#475569" />
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
    </TouchableOpacity>
  );

  if (loading || !user) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  const role = user.role?.toLowerCase() || "";

const displayName =
  role.includes("doctor") || role.includes("intern")
    ? `Dr. ${user.name}`
    : user.name;

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.bgCircleSky} />
        <View style={styles.bgCircleGreen} />

        <View style={styles.headerContent}>
          <View style={styles.headerRow}>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Profile</Text>
          </View>

          {/* Profile Info */}
          <View style={styles.profileRow}>
            <View style={styles.avatarBox}>
              <Image
                source={{
                  uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${user.name}`
                }}
                style={styles.avatar}
              />
            </View>

            <View>
              <Text style={styles.profileName}>{displayName}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
              <Text style={styles.role}>{user.role}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.cardContainer}>

        {/* Account */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>ACCOUNT</Text>

          <MenuItem
            icon="person-outline"
            label="Edit Profile"
            onPress={() => navigation.navigate("EditProfile", { user })}
          />
          <View style={styles.divider} />

          <MenuItem
            icon="lock-closed-outline"
            label="Change Password"
            onPress={() => navigation.navigate("ChangePassword")}
          />
          <View style={styles.divider} />

          <MenuItem
            icon="shield-checkmark-outline"
            label="Login History"
            description="View recent login activity"
            onPress={() => navigation.navigate("LoginHistory")}
          />
          <View style={styles.divider} />

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

        {/* Preferences */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>PREFERENCES</Text>

          <MenuItem
            icon="settings-outline"
            label="App Settings"
            onPress={() => navigation.navigate("AppSettings")}
          />
          <View style={styles.divider} />

          <MenuItem
            icon="notifications-outline"
            label="Notifications"
            onPress={() => navigation.navigate("Notifications")}
          />
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await logout();
            await AsyncStorage.removeItem("ai_chat_history");
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>
          Version 1.0.0 • ApexMDS Inc.
        </Text>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
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

  headerContent: {
    paddingHorizontal: 20,
    marginRight:30
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
    marginTop:15
  },

  backButton: {
    padding: 6,
    borderRadius: 20
  },

  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold"
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap:10
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

  avatarBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
    backgroundColor: "white"
  },

  avatar: {
    width: "100%",
    height: "100%"
  },

  profileName: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold"
  },

  profileEmail: {
    color: "#BFDBFE",
    fontSize: 13
  },

  role: {
    color: "#BFDBFE",
    fontSize: 13,
    marginTop: 2
  },

  cardContainer: {
    paddingHorizontal: 20,
    marginTop: -30,
    paddingBottom: 40
  },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 5,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },

  cardHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748B",
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5
  },

  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 14
  },

  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },

  menuLabel: {
    fontSize: 15,
    color: "#334155",
    fontWeight: "500"
  },

  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 15
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
  },

  versionText: {
    textAlign: "center",
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 20
  }
});
