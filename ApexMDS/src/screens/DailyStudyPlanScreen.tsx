import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getGlobalAnalytics } from "../services/authApi";

export function DailyStudyPlanScreen({ navigation }: any) {

  const [weakSubjects, setWeakSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeakSubjects();
  }, []);

  async function loadWeakSubjects() {
    try {
      const res = await getGlobalAnalytics();
      
      // sort weakest first
      const sorted = (res.weakSubjects || []).sort(
        (a: any, b: any) => a.accuracy - b.accuracy
      );

      setWeakSubjects(sorted);
    } catch (err) {
      console.log("Failed to load weak subjects");
    } finally {
      setLoading(false);
    }
  }

  function handleLearnWithAI(subject: string, accuracy: number) {
    console.log("Learn with AI Button Presses!");
    const prompt = `
I am preparing for NEET MDS.

My weak subject is ${subject}.
My current accuracy is ${accuracy}%.

Create a structured improvement plan including:
1. Core concepts to master
2. Common mistakes
3. High-yield exam traps
4. Rapid revision bullets
5. How to improve to 75%+
`;

    navigation.navigate("AITutor", { prompt });
  }

  const highPriorityCount = weakSubjects.filter(
    (s: any) => s.accuracy < 50
  ).length;

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.bgCircleSky} />
        <View style={styles.bgCircleGreen} />
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Daily Study Plan</Text>
        </View>
        <Text style={styles.headerSub}>
          AI-recommended focus areas for today
        </Text>
      </View>

      <View style={styles.body}>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <View>
            <Text style={styles.statsLabel}>Focus Subjects Today</Text>
            <Text style={styles.statsValue}>
              {weakSubjects.length}
            </Text>

            <View style={styles.statsRow}>
              <Ionicons
                name="alert-circle"
                size={14}
                color="#EF4444"
              />
              <Text style={styles.statsSub}>
                {highPriorityCount} high priority
              </Text>
            </View>
          </View>

          <View style={styles.statsIconBox}>
            <Ionicons
              name="analytics-outline"
              size={32}
              color="#2563EB"
            />
          </View>
        </View>

        {/* Tip Card */}
        <View style={styles.tipCard}>
          <Ionicons
            name="sparkles-outline"
            size={20}
            color="#2563EB"
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.tipTitle}>
              Smart Study Tip
            </Text>
            <Text style={styles.tipText}>
              Start with lowest accuracy subjects first for maximum score improvement.
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          TODAY'S FOCUS AREAS
        </Text>

        {loading ? (
          <ActivityIndicator size="small" color="#2563EB" />
        ) : weakSubjects.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No weak subjects found 🎉
          </Text>
        ) : (
          weakSubjects.map((subject: any) => (
            <View
              key={subject.subject}
              style={[
                styles.sessionCard,
                subject.accuracy < 50 && {
                  borderColor: "#EF4444"
                }
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.sessionTitle}>
                  {subject.subject}
                </Text>

                <View style={styles.sessionRow}>
                  <Ionicons
                    name="stats-chart-outline"
                    size={14}
                    color="#64748B"
                  />
                  <Text style={styles.sessionTime}>
                    Accuracy: {subject.accuracy}%
                  </Text>

                  <View
                    style={[
                      styles.durationBadge,
                      {
                        backgroundColor:
                          subject.accuracy < 50
                            ? "#FEE2E2"
                            : "#FEF3C7"
                      }
                    ]}
                  >
                    <Text
                      style={[
                        styles.durationText,
                        {
                          color:
                            subject.accuracy < 50
                              ? "#DC2626"
                              : "#D97706"
                        }
                      ]}
                    >
                      {subject.accuracy < 50
                        ? "High Priority"
                        : "Needs Revision"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Learn With AI */}
              <TouchableOpacity
                style={styles.aiButton}
                onPress={() =>
                  handleLearnWithAI(
                    subject.subject,
                    subject.accuracy
                  )
                }
              >
                <Text style={styles.aiButtonText}>
                  Learn with AI
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        <Text style={styles.footerText}>
          Your study plan updates automatically based on performance.
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

  headerTitle: { color: "white", fontSize: 20, fontWeight: "bold", marginBottom: 4 },
  headerSub: { color: "#BFDBFE", fontSize: 13, marginTop: 4 },

  body: { padding: 20 },

  statsCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2
  },
  statsLabel: { fontSize: 12, color: "#64748B" },
  statsValue: { fontSize: 22, fontWeight: "bold", color: "#2563EB" },
  statsRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  statsSub: { fontSize: 11, color: "#64748B", marginLeft: 4 },

  statsIconBox: {
    backgroundColor: "#EFF6FF",
    padding: 10,
    borderRadius: 12
  },

  tipCard: {
    backgroundColor: "#DBEAFE",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15
  },
  tipTitle: { fontSize: 13, fontWeight: "bold", color: "#1E40AF" },
  tipText: { fontSize: 11, color: "#1E3A8A", marginTop: 2 },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748B",
    marginBottom: 10
  },

  sessionCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10
  },

  toggleBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },

  sessionTitle: { fontSize: 14, fontWeight: "bold", color: "#1E293B" },

  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4
  },

  sessionTime: { fontSize: 11, color: "#64748B", marginLeft: 4 },

  durationBadge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8
  },
  durationText: { fontSize: 10, color: "#2563EB", fontWeight: "bold" },

  addButton: {
    backgroundColor: "#2563EB",
    borderStyle: "dashed",
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  addText: { fontSize: 13, fontWeight: "600", color: "white", marginLeft: 6 },

  footerText: {
    textAlign: "center",
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 15
  },
  aiButton: {
  backgroundColor: "#2563EB",
  paddingVertical: 6,
  paddingHorizontal: 10,
  borderRadius: 8
},

aiButtonText: {
  color: "white",
  fontSize: 11,
  fontWeight: "600"
},
});
