import { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * IMPORTANT:
 * - Android Emulator → use http://10.0.2.2:5000
 * - Physical phone   → use your LAN IP (e.g. http://192.168.1.5:5000)
 * - Expo Web         → use http://localhost:5000
 */
const BASE_URL = "http://localhost:5000";

export function PracticeSummaryScreen({ route, navigation }: any) {
  const {
    paperId,
    year,
    edition,
    total,
    attempted,
    correct,
    wrong,
    accuracy
  } = route.params;

  /* 🔥 SAVE PRACTICE ATTEMPT ONCE WHEN SCREEN LOADS */
  useEffect(() => {
    console.log("📤 Saving practice attempt from summary");

    fetch(`${BASE_URL}/api/practice-attempts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        paperId,
        year,
        edition,
        totalQuestions: total,
        attempted,
        correct,
        wrong,
        accuracy
      })
    })
      .then(res => res.json())
      .then(() => console.log("✅ Practice attempt saved"))
      .catch(err => console.log("❌ Save failed", err));
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="checkmark-circle" size={60} color="#22C55E" />
        <Text style={styles.title}>Practice Completed</Text>
        <Text style={styles.subtitle}>
          {year} • {edition}
        </Text>
      </View>

      {/* Summary Card */}
      <View style={styles.card}>
        <SummaryRow label="Total Questions" value={total} />
        <SummaryRow label="Attempted" value={attempted} />
        <SummaryRow label="Correct" value={correct} />
        <SummaryRow label="Wrong" value={wrong} />
        <SummaryRow
          label="Accuracy"
          value={`${accuracy.toFixed(1)}%`}
        />
      </View>

      {/* Actions */}
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.primaryBtnText}>Review Answers</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => navigation.navigate("MainTabs")}
      >
        <Text style={styles.secondaryBtnText}>Go to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

/* 🔹 Reusable Row Component */
function SummaryRow({ label, value }: { label: string; value: any }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

/* 🎨 Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20,
    justifyContent: "center"
  },

  header: {
    alignItems: "center",
    marginBottom: 30
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 10
  },

  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4
  },

  card: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 30
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8
  },

  rowLabel: {
    fontSize: 14,
    color: "#475569"
  },

  rowValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A"
  },

  primaryBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12
  },

  primaryBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600"
  },

  secondaryBtn: {
    paddingVertical: 12,
    alignItems: "center"
  },

  secondaryBtnText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600"
  }
});
