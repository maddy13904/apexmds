import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { useEffect, useState } from "react";
import { getTestResultAPI } from "../services/authApi";

export function TestResultScreen({ route, navigation }: any) {
  const { sessionId } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetchResult();
  }, []);

  async function fetchResult() {
    try {
      const res = await getTestResultAPI(sessionId);
      console.log("RESULT:", res);
      setResult(res);
    } catch (error) {
      console.log("RESULT ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  if (!result) {
    return (
      <View style={styles.centered}>
        <Text>Unable to load result.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      {/* SUMMARY */}
      <View style={styles.summaryCard}>
        <Text style={styles.score}>
          Score: {result.correct} / {result.totalQuestions}
        </Text>

        <Text style={styles.accuracy}>
          Accuracy: {result.accuracy}%
        </Text>

        <Text style={styles.meta}>
          Attempted: {result.attempted}
        </Text>

        <Text style={styles.meta}>
          Time Taken: {result.timeTakenMinutes} mins
        </Text>

        <Text style={styles.performance}>
          Performance: {result.performanceLevel}
        </Text>
      </View>

      {/* SUBJECT STATS */}
      <Text style={styles.sectionTitle}>
        Subject Performance
      </Text>

      {result.subjectStats?.map((subject: any, index: number) => (
        <View key={index} style={styles.subjectCard}>
          <Text style={styles.subjectName}>
            {subject.subject}
          </Text>

          <Text>
            Accuracy: {subject.accuracy}%
          </Text>

          <Text>
            Correct: {subject.correct} | Wrong: {subject.wrong}
          </Text>
        </View>
      ))}

      {/* STRONG SUBJECTS */}
      <Text style={styles.sectionTitle}>
        Strong Subjects
      </Text>

      {result.strongSubjects?.map((subject: any, index: number) => (
        <Text key={index} style={styles.strong}>
          ✔ {subject.subject} ({subject.accuracy}%)
        </Text>
      ))}

      {/* WEAK SUBJECTS */}
      <Text style={styles.sectionTitle}>
        Weak Subjects
      </Text>

      {result.weakSubjects?.map((subject: any, index: number) => (
        <Text key={index} style={styles.weak}>
          ✘ {subject.subject} ({subject.accuracy}%)
        </Text>
      ))}

      {/* BUTTON */}
      <TouchableOpacity
        style={styles.dashboardButton}
        onPress={() => navigation.navigate("MainTabs")}
      >
        <Text style={styles.dashboardText}>
          Back to Dashboard
        </Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 18,
    paddingTop: 20
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  summaryCard: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 22,
    marginBottom: 25,

    // iOS soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },

  score: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E3A8A",
    letterSpacing: 0.3
  },

  accuracy: {
    fontSize: 18,
    marginTop: 6,
    fontWeight: "500"
  },

  meta: {
    fontSize: 14,
    color: "#475569",
    marginTop: 4
  },

  performance: {
    marginTop: 12,
    fontWeight: "600",
    fontSize: 15
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 8
  },

  subjectCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },

  subjectName: {
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 6
  },

  strong: {
    color: "#16A34A",
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500"
  },

  weak: {
    color: "#DC2626",
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500"
  },

  dashboardButton: {
    marginTop: 30,
    marginBottom: 50,
    backgroundColor: "#1E3A8A",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
  },

  dashboardText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16
  }
});
