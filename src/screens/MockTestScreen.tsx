import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function MockTestScreen({ navigation }: any) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const question = {
    number: 5,
    text: "A patient presents with bilateral parotid swelling and uveitis. Which of the following is the most likely diagnosis?",
    options: [
      "Sjogren's syndrome",
      "Heerfordt's syndrome",
      "Mikulicz's disease",
      "Warthin's tumor"
    ]
  };

  return (
    <View style={styles.container}>

      {/* Timer Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#94A3B8" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Full Mock Test 3</Text>
        </View>

        <View style={styles.timerBox}>
          <Ionicons name="time-outline" size={16} color="#34D399" />
          <Text style={styles.timerText}>02:45:30</Text>
        </View>
      </View>

      <ScrollView style={styles.body}>

        {/* Question Navigation */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.navRow}
        >
          {[...Array(10)].map((_, i) => {
            const statusStyle =
              i === 4
                ? styles.navCurrent
                : i < 4
                ? styles.navCompleted
                : styles.navPending;

            const textStyle =
              i === 4
                ? styles.navTextCurrent
                : i < 4
                ? styles.navTextCompleted
                : styles.navTextPending;

            return (
              <View key={i} style={[styles.navCircle, statusStyle]}>
                <Text style={[styles.navText, textStyle]}>{i + 1}</Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Question Card */}
        <View style={styles.card}>
          <Text style={styles.questionNumber}>
            Question {question.number}
          </Text>

          <Text style={styles.questionText}>
            {question.text}
          </Text>

          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionBox,
                selectedOption === index && styles.optionSelected
              ]}
              onPress={() => setSelectedOption(index)}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedOption === index && styles.optionTextSelected
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bottom Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.reviewButton}>
            <Text style={styles.reviewText}>Mark for Review</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.nextText}>Save & Next</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },

  header: {
    backgroundColor: "#0F172A",
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },

  headerTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "600"
  },

  timerBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E293B",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 5
  },

  timerText: {
    color: "#34D399",
    fontFamily: "monospace",
    fontWeight: "bold",
    fontSize: 13
  },

  body: {
    padding: 20
  },

  navRow: {
    marginBottom: 15
  },

  navCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8
  },

  navCurrent: {
    backgroundColor: "#1E3A8A",
    borderColor: "#1E3A8A"
  },

  navCompleted: {
    backgroundColor: "#ECFDF5",
    borderColor: "#10B981"
  },

  navPending: {
    backgroundColor: "white",
    borderColor: "#E2E8F0"
  },

  navText: {
    fontSize: 13,
    fontWeight: "600"
  },

  navTextCurrent: {
    color: "white"
  },

  navTextCompleted: {
    color: "#047857"
  },

  navTextPending: {
    color: "#94A3B8"
  },

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2
  },

  questionNumber: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E3A8A",
    marginBottom: 6
  },

  questionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
    marginBottom: 15
  },

  optionBox: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10
  },

  optionSelected: {
    borderColor: "#1E3A8A",
    backgroundColor: "#EFF6FF"
  },

  optionText: {
    fontSize: 14,
    color: "#334155"
  },

  optionTextSelected: {
    color: "#1E3A8A",
    fontWeight: "600"
  },

  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
    marginBottom: 40
  },

  reviewButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center"
  },

  reviewText: {
    color: "#475569",
    fontWeight: "600"
  },

  nextButton: {
    flex: 1,
    backgroundColor: "#1E3A8A",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#1E3A8A",
    shadowOpacity: 0.3,
    shadowRadius: 6
  },

  nextText: {
    color: "white",
    fontWeight: "600"
  }
});
