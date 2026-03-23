import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getLoginHistory } from "../services/authApi";

interface LoginRecord {
  id: string;
  platform: string;
  ipAddress?: string;
  userAgent: string;
  status: "success" | "failed";
  loggedInAt: string;
}

export function LoginHistoryScreen({ navigation }: any) {
  const [loginHistory, setLoginHistory] = useState<{
    today: LoginRecord[];
    yesterday: LoginRecord[];
    older: LoginRecord[];
  }>({
    today: [],
    yesterday: [],
    older: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLoginHistory();
  }, []);

  async function loadLoginHistory() {
    try {
      setLoading(true);

      const data = await getLoginHistory();
      console.log("LOGIN HISTORY FROM BACKEND:", data);

      // backend returns ARRAY
      const formatted: LoginRecord[] = data.map((item: any) => ({
        id: item._id,
        platform: item.platform || "unknown",
        ipAddress: item.ipAddress,
        userAgent: item.userAgent || "Unknown browser",
        status: item.status === "success" ? "success" : "failed",
        loggedInAt: item.loggedInAt || item.createdAt
      }));

      setLoginHistory(groupByDate(formatted));
    } catch (err) {
      Alert.alert("Error", "Failed to load login history");
    } finally {
      setLoading(false);
    }
  }

  function formatTimestamp(timestamp: string) {
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    day: "2-digit",
    month: "short"
  }).format(new Date(timestamp));
}
  function groupByDate(records: LoginRecord[]) {
  const today: LoginRecord[] = [];
  const yesterday: LoginRecord[] = [];
  const older: LoginRecord[] = [];

  const now = new Date();

  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const yesterdayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1
  );

  records.forEach(record => {
    const recordDate = new Date(record.loggedInAt);

    if (recordDate >= todayStart) {
      today.push(record);
    } else if (recordDate >= yesterdayStart) {
      yesterday.push(record);
    } else {
      older.push(record);
    }
  });

  return { today, yesterday, older };
}

  function renderSection(title: string, data: LoginRecord[]) {
    if (data.length === 0) return null;

    return (
      <>
        <Text style={styles.sectionTitle}>{title}</Text>

        {data.map(record => (
          <View
            key={record.id}
            style={[
              styles.historyCard,
              record.status === "failed" && styles.failedCard
            ]}
          >
            <View style={styles.row}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="desktop-outline"
                  size={20}
                  color="#2563EB"
                />
              </View>

              <View style={{ flex: 1 }}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.deviceText}>
                    {record.platform.toUpperCase()}
                  </Text>

                  {record.status === "failed" && (
                    <View style={styles.failedBadge}>
                      <Ionicons
                        name="alert-circle"
                        size={12}
                        color="#EF4444"
                      />
                      <Text style={styles.failedText}>Failed</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.metaText}>{record.userAgent}</Text>

                {record.ipAddress && (
                  <Text style={styles.metaText}>
                    IP: {record.ipAddress}
                  </Text>
                )}

                <Text style={styles.metaText}>
                  🕒 {formatTimestamp(record.loggedInAt)}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </>
    );
  }

  const isEmpty =
    !loading &&
    loginHistory.today.length === 0 &&
    loginHistory.yesterday.length === 0 &&
    loginHistory.older.length === 0;

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

        <Text style={styles.headerTitle}>Login History</Text>
        </View>
        <Text style={styles.headerSub}>Track your account activity</Text>
      </View>

      <View style={styles.body}>
        {loading && (
          <ActivityIndicator
            size="large"
            color="#1E3A8A"
            style={{ marginTop: 30 }}
          />
        )}

        {!loading && (
          <>
            {renderSection("Today", loginHistory.today)}
            {renderSection("Yesterday", loginHistory.yesterday)}
            {renderSection("Older", loginHistory.older)}
          </>
        )}

        {isEmpty && (
          <Text style={styles.emptyText}>
            No login history available
          </Text>
        )}

        <Text style={styles.footerText}>
          Login history is stored for 30 days for security purposes.
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

  header: {
    backgroundColor: "#1E40AF",
    paddingTop: 40,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden"
  },

  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 3
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
    gap: 10
  },

  headerSub: {
    color: "#BFDBFE",
    fontSize: 13,
    marginTop: 4,
    marginLeft: 35
  },

  body: {
    padding: 20
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#475569",
    marginVertical: 10
  },

  historyCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12
  },

  failedCard: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2"
  },

  row: {
    flexDirection: "row",
    gap: 12
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EFF6FF"
  },

  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  deviceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0F172A"
  },

  failedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6
  },

  failedText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#EF4444",
    marginLeft: 4
  },

  metaText: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2
  },

  emptyText: {
    textAlign: "center",
    color: "#64748B",
    marginTop: 30
  },

  footerText: {
    textAlign: "center",
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 20
  }
});
