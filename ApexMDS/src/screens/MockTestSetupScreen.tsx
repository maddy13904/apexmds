import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { startTestSession } from "../services/authApi";

export function MockTestSetupScreen({ navigation }: any) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleStartMockTest() {
    try {
      setLoading(true);

      const response = await startTestSession({
        sessionType: "mock_test",
        subjects: [], // backend handles subject selection for full mock
        totalQuestions: 240,
        timeLimitMinutes: 180
      });

      setShowConfirm(false);

      navigation.replace("TestScreen", {
        sessionId: response.sessionId,
        questions: response.questions,
        timeLimitMinutes: 180
      });

    } catch (error) {
      console.log("START TEST ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
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

          <Text style={styles.headerTitle}>Mock Test</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Full-Length Mock Test</Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="time-outline" size={20} color="#1E3A8A" />
            <Text style={styles.label}>Duration:</Text>
            <Text style={styles.value}>3 Hours</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="help-circle-outline" size={20} color="#1E3A8A" />
            <Text style={styles.label}>Questions:</Text>
            <Text style={styles.value}>240</Text>
          </View>

          <View style={styles.row}>
            <Ionicons name="layers-outline" size={20} color="#1E3A8A" />
            <Text style={styles.label}>Subjects:</Text>
            <Text style={styles.value}>All 16 Subjects</Text>
          </View>
        </View>

        <Text style={styles.warning}>
          ⚠ Once started, the timer will begin immediately.
          Make sure you have 3 hours of uninterrupted time.
        </Text>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => setShowConfirm(true)}
        >
          <Text style={styles.startText}>Start Full Mock</Text>
        </TouchableOpacity>

        {/* CONFIRM MODAL */}
        {showConfirm && (
          <View style={styles.overlay}>
            <View style={styles.confirmBox}>
              <Text style={styles.confirmTitle}>
                Are You Ready?
              </Text>

              <Text style={styles.confirmText}>
                This is a 3-hour NEET MDS full-length mock with 240 questions.
                Once started, the timer begins immediately.
              </Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setShowConfirm(false)}
                >
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.startExamBtn}
                  onPress={handleStartMockTest}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={styles.startExamText}>
                      Start Exam
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center"
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

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },

  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },

  backButton: {
    padding: 6,
    borderRadius: 20
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
  content: {
    padding: 20
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 20,
    textAlign: "center"
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155"
  },
  value: {
    fontSize: 14,
    color: "#1E293B",
    marginLeft: 4
  },
  warning: {
    fontSize: 13,
    color: "#DC2626",
    marginBottom: 20,
    textAlign: "center"
  },
  startButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center"
  },
  startText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600"
  },
  overlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  justifyContent: "center",
  alignItems: "center",
  padding: 20
},

confirmBox: {
  backgroundColor: "white",
  width: "100%",
  borderRadius: 16,
  padding: 20
},

confirmTitle: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#0F172A",
  marginBottom: 10
},

confirmText: {
  fontSize: 14,
  color: "#475569",
  marginBottom: 20
},

buttonRow: {
  flexDirection: "row",
  justifyContent: "space-between"
},

cancelBtn: {
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 10,
  backgroundColor: "#E2E8F0"
},

cancelText: {
  color: "#334155",
  fontWeight: "600"
},

startExamBtn: {
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 10,
  backgroundColor: "#1E3A8A"
},

startExamText: {
  color: "white",
  fontWeight: "600"
}

});
