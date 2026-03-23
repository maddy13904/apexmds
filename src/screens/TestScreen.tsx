import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { submitAnswerAPI } from "../services/authApi";

export function TestScreen({ route, navigation }: any) {
  const {
    sessionId,
    questions = [],
    timeLimitMinutes = 30
  } = route.params || {};

  // Safety check
  if (!questions.length) {
    return (
      <View style={styles.centered}>
        <Text>No questions available.</Text>
      </View>
    );
  }

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
  questions.map(() => null)
);
  const [submitting, setSubmitting] = useState(false);
  const [showPalette, setShowPalette] = useState(false);

  const [questionStatus, setQuestionStatus] = useState(
    questions.map(() => ({
      answered: false,
      marked: false
    }))
  );

  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);
  const timerRef = useRef<any>(null);

  const currentQuestion = questions[currentIndex];

  // =============================
  // TIMER
  // =============================
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev: number) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  function formatTime(seconds: number) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hrs > 0 ? `${hrs}:` : ""}${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  function handleAutoSubmit() {
    navigation.replace("TestResult", { sessionId });
  }

  function toggleMarkReview() {
    setQuestionStatus((prev: any[]) =>
      prev.map((item, index) =>
        index === currentIndex
          ? { ...item, marked: !item.marked }
          : item
      )
    );
  }

  async function handleSubmit() {
    if (selectedOption === null) return;

    try {
      setSubmitting(true);
      

      const res = await submitAnswerAPI({
        testSessionId: sessionId,
        questionId: currentQuestion._id,
        selectedOption,
        timeTaken: 0
      });

      // mark answered
      setQuestionStatus((prev: any[]) =>
        prev.map((item, index) =>
          index === currentIndex
            ? { ...item, answered: true }
            : item
        )
      );

      if (res?.completed) {
        navigation.replace("TestResult", { sessionId });
      } else {
        setCurrentIndex((prev: number) => prev + 1);
        setSelectedOption(null);
      }

    } catch (error) {
      console.log("SUBMIT ERROR:", error);
    } finally {
      setSubmitting(false);
    }
  }

  useEffect(() => {
  setSelectedOption(selectedAnswers[currentIndex]);
}, [currentIndex]);

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.topRow}>
        <Text style={styles.counter}>
          Q {currentIndex + 1} / {questions.length}
        </Text>

        <Text
          style={[
            styles.timer,
            timeLeft < 300 && styles.timerWarning
          ]}
        >
          ⏱ {formatTime(timeLeft)}
        </Text>

        <TouchableOpacity onPress={() => setShowPalette(true)}>
          <Text style={styles.paletteBtn}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* QUESTION */}
      <ScrollView style={styles.questionBox}>
        <Text style={styles.questionText}>
          {currentQuestion.questionText}
        </Text>
      </ScrollView>

      {/* OPTIONS */}
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option: any, index: number) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedOption === index && styles.selectedOption
            ]}
            onPress={() => {
  setSelectedOption(index);

  setSelectedAnswers((prev) =>
    prev.map((item, i) =>
      i === currentIndex ? index : item
    )
  );
}}
          >
            <Text style={styles.optionText}>{typeof option === "string" ? option : option.text}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* MARK FOR REVIEW */}
      <TouchableOpacity
        onPress={toggleMarkReview}
        style={styles.markBtn}
      >
        <Text style={styles.markText}>
          {questionStatus[currentIndex]?.marked
            ? "Unmark Review"
            : "Mark For Review"}
        </Text>
      </TouchableOpacity>

      {/* SUBMIT */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          selectedOption === null && { opacity: 0.6 }
        ]}
        onPress={handleSubmit}
        disabled={selectedOption === null || submitting}
      >
        <Text style={styles.submitText}>
          {currentIndex === questions.length - 1
            ? "Finish Test"
            : "Next"}
        </Text>
      </TouchableOpacity>

      {/* QUESTION PALETTE */}
      <Modal visible={showPalette} transparent animationType="fade">
        <View style={styles.paletteOverlay}>
          <View style={styles.paletteBox}>

            <Text style={styles.paletteTitle}>
              Question Palette
            </Text>

            <ScrollView contentContainerStyle={styles.paletteGrid}>
              {questions.map((_: any, index: number) => {
                const status = questionStatus[index];

                let bgColor = "#CBD5E1";

                if (index === currentIndex)
                  bgColor = "#3B82F6";
                else if (status?.marked)
                  bgColor = "#F59E0B";
                else if (status?.answered)
                  bgColor = "#22C55E";

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setCurrentIndex(index);
                      setShowPalette(false);
                    }}
                    style={[
                      styles.paletteItem,
                      { backgroundColor: bgColor }
                    ]}
                  >
                    <Text style={styles.paletteNumber}>
                      {index + 1}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.closePaletteBtn}
              onPress={() => setShowPalette(false)}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                Close
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8FAFC"
  },

  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 30
  },

  counter: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E3A8A"
  },

  timer: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B"
  },

  timerWarning: {
    color: "#DC2626"
  },

  paletteBtn: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3A8A"
  },

  questionBox: {
    marginBottom: 20
  },

  questionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0F172A"
  },

  optionsContainer: {
    marginTop: 10
  },

  optionButton: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },

  selectedOption: {
    borderColor: "#1E3A8A",
    backgroundColor: "#E0ECFF"
  },

  optionText: {
    fontSize: 14,
    color: "#1E293B"
  },

  markBtn: {
    marginTop: 10,
    alignSelf: "flex-start"
  },

  markText: {
    color: "#F59E0B",
    fontWeight: "600"
  },

  submitButton: {
    marginTop: 20,
    backgroundColor: "#1E3A8A",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center"
  },

  submitText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600"
  },

  paletteOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },

  paletteBox: {
    backgroundColor: "white",
    width: "90%",
    maxHeight: "80%",
    borderRadius: 16,
    padding: 20
  },

  paletteTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 15
  },

  paletteGrid: {
    flexDirection: "row",
    flexWrap: "wrap"
  },

  paletteItem: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    margin: 5
  },

  paletteNumber: {
    color: "white",
    fontWeight: "700"
  },

  closePaletteBtn: {
    marginTop: 15,
    backgroundColor: "#1E3A8A",
    padding: 12,
    borderRadius: 10,
    alignItems: "center"
  }
});
