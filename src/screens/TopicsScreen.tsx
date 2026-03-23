import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useEffect, useCallback, useState } from "react";
import { getUserStorageKey } from "../utils/userStorage";
import { syncDownloads } from "../utils/syncDownloads";

interface Ebook {
  _id: string;
  subject: string;
  title: string;
  pdfUrl: string;
}

export function TopicsScreen({ route, navigation }: any) {

  const { subject, topics } = route.params as {
    subject: string;
    topics: Ebook[];
  };

  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  // Load downloaded IDs when screen focuses
  useFocusEffect(
  useCallback(() => {
    syncDownloads();
    loadDownloaded();
  }, [])
);

  async function loadDownloaded() {
    try {
      const storageKey = await getUserStorageKey("downloadedBooks");
      const data = await AsyncStorage.getItem(storageKey);

      if (data) {
        const parsed = JSON.parse(data);
        setDownloadedIds(parsed.map((b: any) => b.bookId));
      } else {
        setDownloadedIds([]);
      }
    } catch (error) {
      console.log("Load downloaded error:", error);
      setDownloadedIds([]);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>

        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color="#0F172A" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>{subject}</Text>
        </View>

        {/* Topic List */}
        {topics.map((topic) => (
          <TouchableOpacity
            key={topic._id}
            style={styles.topicCard}
            onPress={() =>
              navigation.navigate("EBooksViewer", {
                topic: topic.title,
                pdfUrl: topic.pdfUrl,
                bookId: topic._id
              })
            }
          >
            <View style={styles.iconBox}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#2563EB"
              />
            </View>

            <Text style={styles.topicText}>
              {topic.title}
            </Text>

            {/* ✅ Download Badge */}
            {downloadedIds.includes(topic._id) && (
              <Ionicons
                name="cloud-done-outline"
                size={18}
                color="#22C55E"
                style={{ marginRight: 8 }}
              />
            )}

            <Ionicons
              name="chevron-forward"
              size={18}
              color="#CBD5E1"
            />
          </TouchableOpacity>
        ))}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },

  content: {
    padding: 20
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20
  },

  backButton: {
    padding: 6
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0F172A"
  },

  topicCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9"
  },

  iconBox: {
    marginRight: 10
  },

  topicText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: "#1E293B"
  }
});