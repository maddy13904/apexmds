import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ChatMessageProps {
  message: string;
  isAi: boolean;
  timestamp: string;
}

export function ChatMessage({ message, isAi, timestamp }: ChatMessageProps) {
  return (
    <View
      style={[
        styles.row,
        { flexDirection: isAi ? "row" : "row-reverse" }
      ]}
    >
      {/* Avatar */}
      <View
        style={[
          styles.avatar,
          { backgroundColor: isAi ? "#2563EB" : "#E2E8F0" }
        ]}
      >
        <Ionicons
          name={isAi ? "sparkles" : "person"}
          size={16}
          color={isAi ? "white" : "#475569"}
        />
      </View>

      {/* Message Bubble */}
      <View
        style={[
          styles.messageContainer,
          { alignItems: isAi ? "flex-start" : "flex-end" }
        ]}
      >
        <View
          style={[
            styles.bubble,
            isAi ? styles.aiBubble : styles.userBubble
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: isAi ? "#1E293B" : "white" }
            ]}
          >
            {message}
          </Text>
        </View>

        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 10,
    marginBottom: 14,
    maxWidth: "90%"
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center"
  },

  messageContainer: {
    maxWidth: "80%"
  },

  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18
  },

  aiBubble: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#F1F5F9",
    borderTopLeftRadius: 4
  },

  userBubble: {
    backgroundColor: "#0EA5E9",
    borderTopRightRadius: 4
  },

  messageText: {
    fontSize: 14,
    lineHeight: 20
  },

  timestamp: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 4,
    marginHorizontal: 4
  }
});
