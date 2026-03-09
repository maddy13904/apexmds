import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface QuestionCardProps {
  questionNumber: number;
  question: string;
  options: string[];
  selectedOption: number | null;
  onSelectOption: (index: number) => void;
}

export function QuestionCard({
  questionNumber,
  question,
  options,
  selectedOption,
  onSelectOption,
}: QuestionCardProps) {
  return (
    <View style={styles.container}>
      {/* Question Box */}
      <View style={styles.questionBox}>
        <Text style={styles.questionBadge}>Question {questionNumber}</Text>
        <Text style={styles.questionText}>{question}</Text>
      </View>

      {/* Options */}
      <View style={{ marginTop: 16 }}>
        {options.map((option, index) => {
          const isSelected = selectedOption === index;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onSelectOption(index)}
              activeOpacity={0.8}
              style={[
                styles.optionCard,
                isSelected && styles.optionCardSelected,
              ]}
            >
              <Ionicons
                name={isSelected ? "checkmark-circle" : "ellipse-outline"}
                size={22}
                color={isSelected ? "#0EA5E9" : "#CBD5E1"}
                style={{ marginTop: 2 }}
              />
              <Text
                style={[
                  styles.optionText,
                  isSelected && { color: "#0F172A" },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  questionBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  questionBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EFF6FF",
    color: "#1D4ED8",
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    lineHeight: 22,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  optionCardSelected: {
    borderColor: "#0EA5E9",
    backgroundColor: "#F0F9FF",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    flex: 1,
  },
});
