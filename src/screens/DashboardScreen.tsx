import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getStudyPlan } from "../services/authApi";
import { getMyProfile } from "../services/user.service";
import { startTestSession } from "../services/authApi";
import { registerPushToken } from "../utils/registerPushToken";

export function DashboardScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [studyPlan, setStudyPlan] = useState<any>(null);
  const [loadingPlan, setLoadingPlan] = useState(true);

  const safeUser = user || {
    name: "Student",
    email: "student@example.com",
    role: "NEET MDS Aspirant",
    phone: ""
  };

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

  useEffect(() => {
  registerPushToken();
}, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  useEffect(() => {
    loadPlan();
  }, []);

  async function loadPlan() {
    try {
      const data = await getStudyPlan();
      setStudyPlan(data);
    } catch (err) {
      console.log("Study plan load failed");
    } finally {
      setLoadingPlan(false);
    }
  }

  function handleLearnWithAI() {
    navigation.navigate("AITutor", {
      prompt: studyPlan?.aiPrompt
    });
  }

  function handleStartPractice() {
    navigation.navigate("Practice", {
      subject: studyPlan?.focusSubject,
      questionCount: studyPlan?.recommendedQuestions
    });
  }

  const isWeak = studyPlan?.focusAccuracy < 50;

  const role = safeUser.role?.toLowerCase() || "";

  const displayName =
    role.includes("doctor") || role.includes("intern")
      ? `Dr. ${safeUser.name}`
      : safeUser.name;

  return (
    <ScrollView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.bgCircleSky} />
        <View style={styles.bgCircleGreen} />

        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.profileRow}
            onPress={() => navigation.navigate("Profile", { safeUser })}
          >
            <View style={styles.avatarBox}>
              <Image
                source={{
                  uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${safeUser.name}`
                }}
                style={styles.avatar}
              />
            </View>
            <View>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.nameText}>{displayName}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.notifyButton}
            onPress={() => navigation.navigate("DailyStudyPlan")}
          >
            <Ionicons name="calendar-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* BODY */}
      <View style={styles.body}>

        {/* ===== SMART STUDY PLAN CARD ===== */}
        <View style={styles.planCard}>
          {loadingPlan ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : studyPlan?.focusSubject ? (
            <>
              <View style={styles.planHeader}>
                <View style={styles.planHeaderLeft}>
                  <Ionicons name="sparkles-outline" size={18} color="#0EA5E9" />
                  <Text style={styles.planTitle}>Today's Focus</Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: isWeak ? "#FEF2F2" : "#ECFDF5" }
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      { color: isWeak ? "#EF4444" : "#059669" }
                    ]}
                  >
                    {isWeak ? "Focus Required" : "On Track"}
                  </Text>
                </View>
              </View>

              <View style={styles.planItem}>
                <View style={[styles.planIconBox, { backgroundColor: "#DBEAFE" }]}>
                  <Ionicons name="book-outline" size={20} color="#2563EB" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.planItemTitle}>
                    {studyPlan.focusSubject}
                  </Text>
                  <Text style={styles.planItemSub}>
                    Accuracy: {studyPlan.focusAccuracy}% • {studyPlan.recommendedTimeMinutes} mins
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.aiButton}
                  onPress={handleLearnWithAI}
                >
                  <Text style={styles.aiText}>Learn with AI</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.planItem}>
                <View style={[styles.planIconBox, { backgroundColor: "#E0F2FE" }]}>
                  <Ionicons name="create-outline" size={20} color="#0284C7" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.planItemTitle}>
                    {studyPlan.recommendedQuestions} Questions Practice
                  </Text>
                  <Text style={styles.planItemSub}>
                    Strengthen weak concepts
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.startButton}
                  onPress={async () => {
  const response = await startTestSession({
    sessionType: "daily_quiz",
    totalQuestions: studyPlan.recommendedQuestions,
    timeLimitMinutes: 15
  });

  navigation.navigate("TestScreen", {
    sessionId: response.sessionId,
    questions: response.questions
  });
}}
                >
                  <Text style={styles.startText}>Start Practice</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={{ color: "#64748B" }}>
              Complete a test to generate your smart plan.
            </Text>
          )}
        </View>

        {/* FEATURE GRID */}
        <View style={styles.grid}>
          <FeatureButton
            title="Previous Papers"
            icon="document-text-outline"
            color="#F59E0B"
            bg="#FEF3C7"
            onPress={() => navigation.navigate("PreviousPapers")}
          />

          <FeatureButton
            title="Mock Test"
            icon="timer-outline"
            color="#E11D48"
            bg="#FFE4E6"
            onPress={() => navigation.navigate("MockTestSetup")}
          />

          <FeatureButton
            title="Daily Quiz"
            icon="create-outline"
            color="#059669"
            bg="#DBFDEEFF"
            onPress={async () => {
  const response = await startTestSession({
    sessionType: "daily_quiz",
    totalQuestions: 20,
    timeLimitMinutes: 15
  });

  navigation.navigate("TestScreen", {
    sessionId: response.sessionId,
    questions: response.questions
  });
}}
          />

          <FeatureButton
            title="E-Books"
            icon="book-outline"
            color="#7C3AED"
            bg="#EDE9FE"
            onPress={() => navigation.navigate("EBooks")}
          />

          <FeatureButton
            title="AI Tutor"
            icon="chatbubble-ellipses-outline"
            color="#0284C7"
            bg="#D3EBFBFF"
            onPress={handleLearnWithAI}
          />

          <FeatureButton
            title="Analytics"
            icon="bar-chart-outline"
            color="#4F46E5"
            bg="#DBEAFE"
            onPress={() => navigation.navigate("Performance")}
          />
        </View>

      </View>
    </ScrollView>
  );
}



/* Feature Card Component */
function FeatureButton({ title, icon, color, bg, onPress }: any) {
  return (
    <TouchableOpacity style={[styles.featureCard, { backgroundColor: bg }]} onPress={onPress}>
      <View style={[styles.featureIconBox, { backgroundColor: "white" }]}>
        <Ionicons name={icon} size={22} color={color} />
      </View>
      <Text style={styles.featureText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },

  /* Header */
  header: {
    backgroundColor: "#1E40AF",
    paddingTop: 55,
    paddingBottom: 90,
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

  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },

  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    overflow: "hidden"
  },

  avatar: {
    width: "100%",
    height: "100%"
  },

  welcomeText: {
    color: "#BAE6FD",
    fontSize: 12,
    fontWeight: "500"
  },

  nameText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },

  notifyButton: {
    backgroundColor: "rgba(255,255,255,0.12)",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)"
  },

  /* Body */
  body: {
    paddingHorizontal: 20,
    marginTop: -60
  },

  planCard: {
    backgroundColor: "white",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20
  },

  buttonRow: {
  flexDirection: "row",
  justifyContent: "space-between"
},
startButton: {
  backgroundColor: "#195fd9ff",
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 10
},
startText: {
  color: "white",
  fontWeight: "bold"
},
aiButton: {
  backgroundColor: "white",
  paddingHorizontal: 14,
  paddingVertical: 8,
  borderRadius: 10
},
aiText: {
  color: "#1E3A8A",
  fontWeight: "bold"
},

  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },

  planHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },

  planTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1E293B"
  },

  statusBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6
  },

  statusText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#059669"
  },

  planItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#F1F5F9"
  },

  planIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10
  },

  planItemTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1E293B"
  },

  planItemSub: {
    fontSize: 11,
    color: "#64748B"
  },

  /* Grid */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 40
  },

  featureCard: {
  width: "48%",
  borderRadius: 16,
  padding: 16,
  marginBottom: 14,
  alignItems: "center",

  backgroundColor: "white",

  shadowColor: "#000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 6,

  elevation: 10
},

  featureIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8
  },

  featureText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B"
  }
});
