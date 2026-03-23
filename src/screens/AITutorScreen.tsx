import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Keyboard,
  KeyboardAvoidingView, Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Markdown from "react-native-markdown-display";
import { generateTutorChat, generateTutorPlan } from "../services/authApi";

interface Message {
  id: number;
  text: string;
  isAi: boolean;
  timestamp: string;
}

export function AITutorScreen({ route, navigation }: any) {

  const prompt = route?.params?.prompt;
  const hasAutoRun = useRef(false);

  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const typingAnim = useRef(new Animated.Value(0)).current;
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const stopTypingRef = useRef(false);
const currentFullTextRef = useRef("");
const currentMessageIdRef = useRef<number | null>(null);

  function getTime() {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });
  }


  async function handleCopy(text: string, id: number) {
  await Clipboard.setStringAsync(text);
  setCopiedId(id);

  setTimeout(() => {
    setCopiedId(null);
  }, 1200);
}

  useEffect(() => {
  if (loading) {
    Animated.loop(
      Animated.sequence([
        Animated.timing(typingAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.timing(typingAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        })
      ])
    ).start();
  }
}, [loading]);
  // =============================
  // LOAD SAVED CHAT
  // =============================
  useEffect(() => {
    loadChatHistory();
  }, []);

  async function loadChatHistory() {
    try {
      const saved = await AsyncStorage.getItem("ai_chat_history");
      if (saved) {
        setMessages(JSON.parse(saved));
      } else {
        // First time message
        setMessages([
          {
            id: 1,
            text:
              "Hello! I'm your AI Tutor. Ask me anything about NEET MDS. I can explain concepts, break down weak areas, or create rapid revision notes.",
            isAi: true,
            timestamp: getTime()
          }
        ]);
      }
    } catch (err) {
      console.log("Failed to load chat history");
    }
  }

  // =============================
  // SAVE CHAT
  // =============================
  useEffect(() => {
    if (messages.length > 0) {
      AsyncStorage.setItem(
        "ai_chat_history",
        JSON.stringify(messages)
      );
    }
  }, [messages]);

  // =============================
  // AUTO PROMPT SUPPORT
  // =============================
  useFocusEffect(
  useCallback(() => {
    if (prompt && !hasAutoRun.current) {
      hasAutoRun.current = true;

      setTimeout(() => {
        sendMessage(prompt);
      }, 300); // 🔥 important
    }
  }, [prompt])
);

  // =============================
  // FORMAT PLAN
  // =============================
  function formatPlan(plan: any) {
    if (!plan || !plan.coreConcepts) {
      return "AI could not generate response.";
    }

    return `
📚 CORE CONCEPTS
${plan.coreConcepts.map((c: string) => `• ${c}`).join("\n")}

⚠️ COMMON MISTAKES
${plan.commonMistakes.map((c: string) => `• ${c}`).join("\n")}

🎯 EXAM TRAPS
${plan.examTraps.map((c: string) => `• ${c}`).join("\n")}

⚡ RAPID REVISION
${plan.rapidRevision.map((c: string) => `• ${c}`).join("\n")}

📝 MCQ TRAPS
${plan.mcqTraps.map((c: string) => `• ${c}`).join("\n")}
`.trim();
  }

  // =============================
  // TYPING ANIMATION
  // =============================
  async function simulateTyping(fullText: string) {
  const aiMessageId = Date.now();

  currentFullTextRef.current = fullText;
  currentMessageIdRef.current = aiMessageId;
  stopTypingRef.current = false;

  setMessages(prev => [
    ...prev,
    {
      id: aiMessageId,
      text: "",
      isAi: true,
      timestamp: getTime()
    }
  ]);

  let currentIndex = 0;
  const chunkSize = 20;

  while (currentIndex < fullText.length) {
    if (stopTypingRef.current) {
      // STOP → show full instantly
      setMessages(prev =>
        prev.map(msg =>
          msg.id === aiMessageId
            ? { ...msg, text: fullText }
            : msg
        )
      );
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 15));
    currentIndex += chunkSize;

    setMessages(prev =>
      prev.map(msg =>
        msg.id === aiMessageId
          ? { ...msg, text: fullText.slice(0, currentIndex) }
          : msg
      )
    );
  }
}

function handleStop() {
  stopTypingRef.current = true;
  setLoading(false);
}

function handleSkip() {
  if (!currentMessageIdRef.current) return;

  setMessages(prev =>
    prev.map(msg =>
      msg.id === currentMessageIdRef.current
        ? { ...msg, text: currentFullTextRef.current }
        : msg
    )
  );

  stopTypingRef.current = true;
  setLoading(false);
}

  // =============================
  // SEND MESSAGE
  // =============================
  async function sendMessage(customText?: string) {
    const text = customText || inputMessage;
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text,
      isAi: false,
      timestamp: getTime()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    try {
      const conversationHistory = [...messages, userMessage]
        .map(m => `${m.isAi ? "AI" : "User"}: ${m.text}`)
        .join("\n");

      const isPlanRequest = text.includes("Create a structured improvement plan");

      let responseText = "";

      if (isPlanRequest) {
        const plan = await generateTutorPlan(text, conversationHistory);
        responseText = formatPlan(plan);
      } else {
        const chat = await generateTutorChat(text, conversationHistory);
        responseText = chat.reply;
      }

      await simulateTyping(responseText);

    } catch (error: any) {
      let messageText = "⚠️ AI Tutor is temporarily unavailable.";

      if (error.response?.status === 429) {
        messageText =
          "🧠 You've reached today's AI tutor limit.\n\nCome back tomorrow stronger 💪";
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          text: messageText,
          isAi: true,
          timestamp: getTime()
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  // =============================
  // RENDER MESSAGE
  // =============================
  function renderMessage({ item }: { item: Message }) {
  return (
    <View
      style={[
        styles.messageRow,
        item.isAi ? styles.leftAlign : styles.rightAlign
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          item.isAi ? styles.aiBubble : styles.userBubble
        ]}
      >
        {item.isAi ? (
          <>
            <Markdown
              style={{
                body: {
                  color: "#1E293B",
                  fontSize: 14,
                  lineHeight: 20
                }
              }}
            >
              {item.text}
            </Markdown>

            {/* COPY BUTTON */}
            <TouchableOpacity
  style={styles.copyButton}
  onPress={() => handleCopy(item.text, item.id)}
>
  <Ionicons
    name={copiedId === item.id ? "checkmark" : "copy-outline"}
    size={14}
    color="#64748B"
  />

  <Text style={styles.copyText}>
    {copiedId === item.id ? "Copied" : "Copy"}
  </Text>
</TouchableOpacity>
          </>
        ) : (
          <Text style={[styles.messageText, { color: "white" }]}>
            {item.text}
          </Text>
        )}
      </View>

      <Text style={styles.timeText}>{item.timestamp}</Text>
    </View>
  );
}

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
  >
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <View style={styles.aiIcon}>
          <Ionicons name="sparkles" size={20} color="white" />
        </View>

        <View>
          <Text style={styles.headerTitle}>AI Tutor</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Online</Text>
          </View>
        </View>
      </View>

      <FlatList
  ref={flatListRef}
  data={messages}
  keyboardShouldPersistTaps="handled"
  onTouchStart={() => Keyboard.dismiss()}
  keyExtractor={(item) => item.id.toString()}
  renderItem={renderMessage}
  contentContainerStyle={styles.chatArea}
  onContentSizeChange={() =>
    flatListRef.current?.scrollToEnd({ animated: true })
  }
/>

      {loading && (
  <View style={styles.thinkingContainer}>
    <Animated.Text
      style={[
        styles.thinkingText,
        { opacity: typingAnim }
      ]}
    >
      AI is typing...
    </Animated.Text>

    <View style={{ flexDirection: "row", gap: 10, marginTop: 6 }}>
      
      {/* STOP BUTTON */}
      <TouchableOpacity onPress={handleStop} style={styles.actionBtn}>
        <Ionicons name="stop-circle" size={16} color="red" />
        <Text style={styles.actionText}>Stop</Text>
      </TouchableOpacity>

      {/* SKIP BUTTON */}
      <TouchableOpacity onPress={handleSkip} style={styles.actionBtn}>
        <Ionicons name="play-forward" size={16} color="#2563EB" />
        <Text style={styles.actionText}>Skip</Text>
      </TouchableOpacity>

    </View>
  </View>
)}

      <View style={styles.inputBar}>
        <TextInput
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Ask anything about NEET MDS..."
          placeholderTextColor="#94A3B8"
          style={styles.input}
        />

        <TouchableOpacity
          style={styles.sendButton}
          onPress={() => sendMessage()}
        >
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>

    </View>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    marginTop:30
  },

  thinkingContainer: {
  paddingHorizontal: 16,
  paddingVertical: 8
},

thinkingText: {
  fontSize: 13,
  fontStyle: "italic",
  color: "#64748B"
},
backButton: {
    padding: 6,
    borderRadius: 20
  },

  actionBtn: {
  flexDirection: "row",
  alignItems: "center",
  gap: 4,
  backgroundColor: "#F1F5F9",
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 8
},

actionText: {
  fontSize: 12,
  color: "#334155"
},
  aiIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center"
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A"
  },
  copyButton: {
  flexDirection: "row",
  alignItems: "center",
  gap: 4,
  marginTop: 6
},

copyText: {
  fontSize: 11,
  color: "#64748B"
},
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981"
  },

  statusText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "500"
  },

  chatArea: {
    padding: 16,
    paddingBottom: 120
  },

  messageRow: {
    marginBottom: 14,
    maxWidth: "80%"
  },

  leftAlign: {
    alignSelf: "flex-start"
  },

  rightAlign: {
    alignSelf: "flex-end"
  },

  messageBubble: {
    padding: 12,
    borderRadius: 14
  },

  aiBubble: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },

  userBubble: {
    backgroundColor: "#2563EB"
  },

  messageText: {
    fontSize: 14,
    lineHeight: 20
  },

  timeText: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 4,
    marginLeft: 4
  },

  inputBar: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    backgroundColor: "white",
    alignItems: "center",
    gap: 10
  },

  input: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0F172A"
  },

  sendButton: {
    backgroundColor: "#1E3A8A",
    padding: 12,
    borderRadius: 12
  }
});
