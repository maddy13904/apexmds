import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function PracticeScreen({ navigation }: any) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const question = {
    number: 5,
    text: "Which of the following is the most common benign tumor of the parotid gland?",
    options: [
      "Warthin's tumor",
      "Pleomorphic adenoma",
      "Mucoepidermoid carcinoma",
      "Adenoid cystic carcinoma"
    ]
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inner}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#475569" />
          </TouchableOpacity>

          <View style={styles.headerIcons}>
            <TouchableOpacity>
              <Ionicons name="flag-outline" size={22} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity>
              <Ionicons name="share-social-outline" size={22} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBox}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressText}>Question 5/20</Text>
            <Text style={styles.progressText}>Time: 14:20</Text>
          </View>

          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

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

        {/* Navigation Buttons */}
        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.prevButton}>
            <Text style={styles.prevText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.nextText}>Next</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },

  inner: {
    padding: 20,
    paddingBottom: 40
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20
  },

  headerIcons: {
    flexDirection: "row",
    gap: 15
  },

  progressBox: {
    marginBottom: 25
  },

  progressTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6
  },

  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B"
  },

  progressBarBg: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 8,
    overflow: "hidden"
  },

  progressBarFill: {
    width: "25%",
    height: "100%",
    backgroundColor: "#1E3A8A",
    borderRadius: 8
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

  navButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 25
  },

  prevButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center"
  },

  prevText: {
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
