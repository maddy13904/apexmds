import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { getUserStorageKey } from "../utils/userStorage";

interface Ebook {
  _id: string;
  subject: string;
  title: string;
  pdfUrl: string;
}

interface SubjectGroup {
  title: string;
  topics: Ebook[];
  count: number;
  progress: number;
  color: string;
  bg: string;
}

const BASE_URL = "http://10.148.127.170:5000/api/v1";

export function EBooksScreen({ navigation }: any) {
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState<"az" | null>(null);
  const [subjects, setSubjects] = useState<SubjectGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);

  useEffect(() => {
  loadDownloaded();
}, []);

async function loadDownloaded() {

  try {

    const storageKey = await getUserStorageKey("downloadedBooks");

    const localData = await AsyncStorage.getItem(storageKey);
    const localBooks = localData ? JSON.parse(localData) : [];

    // 🔹 Get downloads from server
    const token = await AsyncStorage.getItem("token");
    console.log("MOBILE TOKEN:", token);

const response = await fetch(`${BASE_URL}/users/downloads`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
    const serverData = await response.json();
    console.log("SERVER DOWNLOADS:", serverData);

    const serverIds = serverData.ebooks.map((b: any) => b.contentId);

    // 🔹 Remove books that no longer exist on server
    const syncedLocal = localBooks.filter((b: any) =>
      serverIds.includes(b.bookId)
    );

    // 🔹 Update AsyncStorage
    await AsyncStorage.setItem(
      storageKey,
      JSON.stringify(syncedLocal)
    );

    setDownloadedIds(syncedLocal.map((b: any) => b.bookId));

  } catch (error) {

    console.log("Load downloaded error:", error);
    setDownloadedIds([]);

  }

}

  useEffect(() => {
    fetchEbooks();
  }, []);

  async function fetchEbooks() {
    try {
      const response = await fetch(`${BASE_URL}/ebooks`);
      const data: Ebook[] = await response.json();

      // Group by subject safely
      const grouped: Record<string, Ebook[]> = {};

      data.forEach((book) => {
        if (!grouped[book.subject]) {
          grouped[book.subject] = [];
        }
        grouped[book.subject].push(book);
      });

      const formattedSubjects: SubjectGroup[] = Object.keys(grouped).map(
        (subject) => ({
          title: subject,
          topics: grouped[subject],
          count: grouped[subject].length,
          progress: 0,
          color: "#2563EB",
          bg: "#EFF6FF"
        })
      );

      setSubjects(formattedSubjects);
    } catch (error) {
      console.log("Error fetching ebooks:", error);
    } finally {
      setLoading(false);
    }
  }

  // SEARCH FILTER
  const filteredSubjects = subjects.filter((subject) => {
    if (!search.trim()) return true;

    const q = search.toLowerCase();

    return (
      subject.title.toLowerCase().includes(q) ||
      subject.topics.some((t) =>
        t.title.toLowerCase().includes(q)
      )
    );
  });

  const finalSubjects = [...filteredSubjects].sort((a, b) => {
    if (!sortType) return 0;
    return a.title.localeCompare(b.title);
  });

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
          <Text style={styles.title}>E-Books Library</Text>
          </View>
          <Text style={styles.subtitle}>Access your study materials</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search subjects..."
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() =>
              setSortType((prev) => (prev === "az" ? null : "az"))
            }
          >
            <Ionicons
              name="filter-outline"
              size={18}
              color={sortType ? "#2563EB" : "#475569"}
            />
          </TouchableOpacity>
        </View>

        {loading && (
          <ActivityIndicator size="large" color="#2563EB" />
        )}

        {/* Subject Cards */}
        {!loading &&
          finalSubjects.map((item, index) => (
            <TouchableOpacity
              key={item.title}
              style={styles.subjectCard}
              onPress={() =>
                navigation.navigate("TopicsScreen", {
                  subject: item.title,
                  topics: item.topics
                })
              }
            >
              <View
                style={[
                  styles.subjectIcon,
                  { backgroundColor: item.bg }
                ]}
              >
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={item.color}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.subjectTitle}>
                  {item.title}
                </Text>
                <Text style={styles.subjectSub}>
                  {item.count} Books Available
                </Text>

                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `100%`,
                        backgroundColor: item.color
                      }
                    ]}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}

      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC"
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
    gap: 10,
    marginBottom: 20,
    marginTop:20
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
  backButton: {
    padding: 6,
    borderRadius: 20
  },

  content: {
    padding: 15,
    maxWidth: 420,
    alignSelf: "center",
    width: "100%"
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white"
  },

  subtitle: {
    fontSize: 13,
    color: "#dadadaff",
    marginBottom: 15,
    marginLeft:48
  },

  searchRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20
  },

  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginLeft:10,
    marginTop:10
  },

  searchInput: {
    marginLeft: 8,
    fontSize: 13,
    flex: 1
  },

  filterButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 10,
    marginTop:10
  },

  subjectCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
    width:370,
    marginLeft:10
  },

  subjectIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },

  subjectTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B"
  },

  subjectSub: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    marginBottom: 6
  },

  progressBar: {
    height: 5,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden"
  },

  progressFill: {
    height: "100%",
    borderRadius: 3
  }
});
