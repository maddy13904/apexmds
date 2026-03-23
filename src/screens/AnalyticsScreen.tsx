import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { getGlobalAnalytics } from "../services/authApi";

export function AnalyticsScreen() {
  const navigation = useNavigation<any>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [studyPlan, setStudyPlan] = useState<any>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const res = await getGlobalAnalytics();
      setData(res);
    } catch (err) {
      console.log("Analytics load failed");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E3A8A" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.center}>
        <Text>No analytics available</Text>
      </View>
    );
  }

  const { overview, weakSubjects, strongSubjects, recentTests } = data;
  const progress = overview.overallAccuracy;

  function handleLearnWithAI(subject: string, accuracy: number) {
  const prompt = `
I am preparing for NEET MDS.

My weak subject is ${subject}.
My current accuracy in this subject is ${accuracy}%.

Create a structured improvement plan including:

1. Core concepts to master
2. Common mistakes students make
3. High-yield exam traps
4. Rapid revision bullets
5. How to improve from ${accuracy}% to 75%+

Return in structured format.
`;

  navigation.navigate("AITutor", { prompt });
}

  function formatSessionType(type: string) {
    if (type === "previous_year") return "Previous Year";
    if (type === "mock_test") return "Mock Test";
    if (type === "daily_quiz") return "Daily Quiz";
    return type;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      
      <Text style={styles.title}>Performance</Text>
      <Text style={styles.subtitle}>Track your progress and growth</Text>

      {/* ===== OVERALL PROGRESS CARD ===== */}
      <LinearGradient
        colors={["#1E3A8A", "#2563EB"]}
        style={styles.progressCard}
      >
        <View style={styles.progressHeader}>
          <Ionicons name="trending-up-outline" size={18} color="white" />
          <Text style={styles.progressTitle}>Overall Progress</Text>
        </View>

        <Text style={styles.progressPercent}>{progress}%</Text>

        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progress}%` }
            ]}
          />
        </View>
      </LinearGradient>

      {/* ===== STATS GRID ===== */}
      <View style={styles.statsGrid}>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{overview.totalTests}</Text>
          <Text style={styles.statLabel}>Total Tests Taken</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {overview.totalQuestionsAttempted}
          </Text>
          <Text style={styles.statLabel}>Total Questions Attempted</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {overview.totalCorrect}
          </Text>
          <Text style={styles.statLabel}>Overall Correct Answers</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {overview.totalWrong}
          </Text>
          <Text style={styles.statLabel}>Overall Wrong Answers</Text>
        </View>

      </View>

      {/* ===== RECENT TESTS ===== */}
      {recentTests.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Recent Tests</Text>

          {recentTests.slice(0, 3).map((test: any) => (
            <View key={test.sessionId} style={styles.testCard}>
              <View>
                <Text style={styles.testType}>
                  {formatSessionType(test.type)}
                </Text>
                <Text style={styles.testDate}>
                  {new Date(test.createdAt).toLocaleDateString("en-IN")}
                </Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.testScore}>
                  {test.score}/{test.totalQuestions}
                </Text>
                <Text
                  style={[
                    styles.testAccuracy,
                    test.accuracy >= 75
                      ? { color: "#16A34A" }
                      : test.accuracy < 50
                      ? { color: "#EF4444" }
                      : { color: "#F59E0B" }
                  ]}
                >
                  {test.accuracy}%
                </Text>
              </View>
            </View>
          ))}
        </>
      )}

      {/* ===== WEAK SUBJECTS ===== */}
      {weakSubjects.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Areas for Improvement</Text>

          {weakSubjects.map((subject: any) => (
            <View key={subject.subject} style={styles.weakCard}>
              <View>
                <Text style={styles.subjectName}>
                  {subject.subject}
                </Text>
                <Text style={styles.lowAccuracy}>
                  Accuracy {subject.accuracy}%
                </Text>
              </View>

              <TouchableOpacity
                style={styles.learnButton}
                onPress={()=>handleLearnWithAI(subject.subject, subject.accuracy)}
              >
                <Text style={styles.learnText}>
                  Learn with AI
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </>
      )}

      {/* ===== STRONG SUBJECTS ===== */}
      {strongSubjects.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Strong Areas</Text>

          {strongSubjects.map((subject: any) => (
            <View key={subject.subject} style={styles.strongCard}>
              <View>
                <Text style={styles.subjectName}>
                  {subject.subject}
                </Text>
                <Text style={styles.highAccuracy}>
                  Accuracy {subject.accuracy}%
                </Text>
              </View>

              <Ionicons
                name="trending-up"
                size={20}
                color="#16A34A"
              />
            </View>
          ))}
        </>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 20
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A"
  },
  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 20
  },

  /* ===== Progress Card ===== */
  progressCard: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 20
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10
  },
  progressTitle: {
    color: "white",
    fontSize: 14
  },
  progressPercent: {
    fontSize: 34,
    fontWeight: "bold",
    color: "white",
    marginBottom: 10
  },

testCard: {
  backgroundColor: "white",
  padding: 14,
  borderRadius: 14,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#E2E8F0",
  marginBottom: 12
},

testType: {
  fontSize: 14,
  fontWeight: "bold",
  color: "#0F172A"
},

testDate: {
  fontSize: 11,
  color: "#64748B",
  marginTop: 2
},

testScore: {
  fontSize: 14,
  fontWeight: "bold",
  color: "#0F172A"
},

testAccuracy: {
  fontSize: 12,
  fontWeight: "bold",
  marginTop: 2
},
  progressBarBackground: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 10
  },
  progressBarFill: {
    height: 8,
    backgroundColor: "#22C55E",
    borderRadius: 10
  },

  /* ===== Stats Row ===== */
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25
  },
  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A"
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4
  },
  statsGrid: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  marginBottom: 25
},

statCard: {
  width: "48%",
  backgroundColor: "white",
  padding: 18,
  borderRadius: 16,
  marginBottom: 12,
  alignItems: "center",
  elevation: 3
},

learnButton: {
  backgroundColor: "#DBEAFE",
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 8
},

learnText: {
  color: "#2563EB",
  fontSize: 12,
  fontWeight: "bold"
},



  /* ===== Sections ===== */
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#0F172A"
  },

  /* ===== Weak ===== */
  weakCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fcddddff",
    padding: 15,
    borderRadius: 14,
    marginBottom: 12
  },
  subjectName: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#0F172A"
  },
  lowAccuracy: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4
  },
  practiceButton: {
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  practiceText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "bold"
  },

  /* ===== Strong ===== */
  strongCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    padding: 15,
    borderRadius: 14,
    marginBottom: 12
  },
  highAccuracy: {
    fontSize: 12,
    color: "#16A34A",
    marginTop: 4
  }
});
