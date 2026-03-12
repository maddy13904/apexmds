import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

interface Paper {
  _id: string;
  year: number;
  paperNumber: number;
  pdfUrl: string;
}

const BASE_URL = "http://10.73.65.134:5000/api/v1";

export function PreviousYearPapersScreen({ navigation }: any) {

  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPapers();
  }, []);

  async function fetchPapers() {
    try {
      const response = await fetch(`${BASE_URL}/papers`);
      const data = await response.json();
      setPapers(data);
    } catch (error) {
      console.log("Error fetching papers:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inner}>

        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#475569" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Previous Papers</Text>
        </View>

        {loading && (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Loading papers...</Text>
          </View>
        )}

        {!loading && papers.length === 0 && (
          <View style={styles.center}>
            <Text style={{ color: "#64748B" }}>
              No previous papers available.
            </Text>
          </View>
        )}

        {!loading && papers.map((paper) => (
          <TouchableOpacity
            key={paper._id}
            style={styles.card}
            onPress={() =>
              navigation.navigate("QuestionPaperViewer", {
                year: paper.year,
                pdfUrl: paper.pdfUrl
              })
            }
          >
            <View style={styles.cardLeft}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="document-text-outline"
                  size={26}
                  color="#2563EB"
                />
              </View>

              <View>
                <Text style={styles.paperTitle}>
                  NEET MDS {paper.year}
                </Text>
                <Text style={styles.paperSubtitle}>
                  Paper {paper.paperNumber} • 240 Questions • 3 Hours
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#CBD5E1"
            />
          </TouchableOpacity>
        ))}

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  inner: { padding: 20 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20
  },
  backButton: { padding: 6 },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0F172A"
  },
  center: {
    marginTop: 40,
    alignItems: "center"
  },
  loadingText: {
    marginTop: 10,
    color: "#64748B"
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center"
  },
  paperTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B"
  },
  paperSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2
  }
});