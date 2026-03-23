import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://10.58.26.113:5000/api/v1";

interface SubjectStat {
  subject: string;
  total: number;
  correct: number;
  wrong: number;
  accuracy: number;
}

interface RecentTest {
  sessionId: string;
  type: string;
  totalQuestions: number;
  score: number;
  accuracy: number;
  completed: boolean;
  createdAt: string;
}

interface AnalyticsResponse {
  overview: {
    totalTests: number;
    totalQuestionsAttempted: number;
    totalCorrect: number;
    totalWrong: number;
    overallAccuracy: number;
    performanceLevel: string;
  };
  strongSubjects: SubjectStat[];
  weakSubjects: SubjectStat[];
  recentTests: RecentTest[];
}

export function DownloadDataScreen({ navigation }: any) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState("");

  const dataCategories = [
  {
    title: "Profile Information",
    description: "Name, email, and account details",
    icon: "person-outline"
  },
  {
    title: "Study Progress",
    description: "Completed topics and progress stats",
    icon: "bar-chart-outline"
  },
  {
    title: "Practice History",
    description: "Attempted questions and answers",
    icon: "create-outline"
  },
  {
    title: "Mock Test Results",
    description: "Mock scores and analytics",
    icon: "document-text-outline"
  },
  {
    title: "Downloaded E-Books",
    description: "List of saved study materials",
    icon: "book-outline"
  },
  {
    title: "Analytics Data",
    description: "Performance insights",
    icon: "analytics-outline"
  }
];


  async function handleDownload() {
  setIsGenerating(true);
  setError("");
  setIsComplete(false);

  try {
    // 1️⃣ Collect data (example)
    const downloaded = await AsyncStorage.getItem("downloadedBooks");
    const downloadedBooks = downloaded ? JSON.parse(downloaded) : [];
    const token = await AsyncStorage.getItem("accessToken");

if (!token) {
  setError("User not authenticated. Please login again.");
  setIsGenerating(false);
  return;
}

const profileRes = await fetch(`${BASE_URL}/users/me`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const analyticsRes = await fetch(`${BASE_URL}/analytics/global`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const profile = await profileRes.json();
const analytics: AnalyticsResponse = await analyticsRes.json();
const htmlContent = `
<html>
<head>
  <style>
    body { font-family: Arial; padding: 20px; }
    h1 { color: #1E40AF; }
    h2 { margin-top: 30px; color: #2563EB; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th, td { border: 1px solid #ccc; padding: 8px; font-size: 12px; }
    th { background-color: #f1f5f9; }
  </style>
</head>
<body>
<h1>ApexMDS Data Export</h1>

<h2>Profile Information</h2>
<p><b>Name:</b> ${profile.user.name}</p>
<p><b>Email:</b> ${profile.user.email}</p>
<p><b>Phone:</b> ${profile.user.phone}</p>
<p><b>Role:</b> ${profile.user.role}</p>
<p><b>Joined:</b> ${new Date(profile.user.createdAt).toLocaleDateString()}</p>

<h2>Performance Overview</h2>
<p>Total Tests: ${analytics.overview.totalTests}</p>
<p>Total Questions Attempted: ${analytics.overview.totalQuestionsAttempted}</p>
<p>Total Correct: ${analytics.overview.totalCorrect}</p>
<p>Total Wrong: ${analytics.overview.totalWrong}</p>
<p>Overall Accuracy: ${analytics.overview.overallAccuracy}%</p>
<p>Performance Level: ${analytics.overview.performanceLevel}</p>

<h2>Strong Subjects</h2>
<ul>
${analytics.strongSubjects
  .map(
    s =>
      `<li>${s.subject} - ${s.accuracy}% Accuracy</li>`
  )
  .join("")}
</ul>

<h2>Weak Subjects</h2>
<ul>
${analytics.weakSubjects
  .map(
    s =>
      `<li>${s.subject} - ${s.accuracy}% Accuracy</li>`
  )
  .join("")}
</ul>

<h2>Recent Tests</h2>
<ul>
${analytics.recentTests
  .map(
    t =>
      `<li>${t.type.toUpperCase()} - Score: ${t.score}/${t.totalQuestions} (${t.accuracy}%) - ${new Date(
        t.createdAt
      ).toLocaleDateString()}</li>`
  )
  .join("")}
</ul>

<h2>Downloaded E-Books</h2>
<ul>
${downloadedBooks
  .map((b: any) => `<li>${b.title}</li>`)
  .join("")}
</ul>

<h2>Performance Summary</h2>
<p>
Based on your test data, your average score is <strong>${analytics.overview.overallAccuracy}</strong>.
Keep practicing to improve consistency and accuracy.
</p>
<p><b>Generated On:</b> ${new Date().toLocaleString()}</p>

</body>
</html>
`;

    // 3️⃣ Generate temporary PDF
    const { uri } = await Print.printToFileAsync({
      html: htmlContent
    });

    // 4️⃣ Ask user where to save
    const permissions =
      await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

    if (!permissions.granted) {
      setError("Permission required to save file.");
      setIsGenerating(false);
      return;
    }

    const pdfName = `ApexMDS_Data_Export_${Date.now()}.pdf`;

    const fileUri =
      await FileSystem.StorageAccessFramework.createFileAsync(
        permissions.directoryUri,
        pdfName,
        "application/pdf"
      );

    const pdfBase64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    setIsComplete(true);

    Alert.alert(
      "Download Complete",
      "Your data file has been saved successfully."
    );

  } catch (e) {
    console.log(e);
    setError("Failed to generate data file. Please try again.");
  } finally {
    setIsGenerating(false);
  }
}

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.bgCircleSky} />
                <View style={styles.bgCircleGreen} />
                <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Download Your Data</Text>
        </View>
        <Text style={styles.headerSub}>
          Export all your ApexMDS data
        </Text>
      </View>

      <View style={styles.body}>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="document-text" size={22} color="#2563EB" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.infoTitle}>Your Data Package</Text>
            <Text style={styles.infoSub}>
              We'll compile all your data into a secure PDF document.
            </Text>
          </View>
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>INCLUDED IN EXPORT</Text>

        {dataCategories.map((item, index) => (
          <View key={index} style={styles.categoryCard}>
            <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={20} color="#2563EB" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.categoryTitle}>{item.title}</Text>
              <Text style={styles.categoryDesc}>{item.description}</Text>
            </View>
          </View>
        ))}

        {/* Privacy Notice */}
        <View style={styles.noticeCard}>
          <Ionicons name="alert-circle" size={20} color="#D97706" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.noticeTitle}>Privacy Notice</Text>
            <Text style={styles.noticeDesc}>
              Your data export will be generated securely and accessible only to you.
            </Text>
          </View>
        </View>

        {/* Success Message */}
        {isComplete && (
          <View style={styles.successCard}>
            <Ionicons name="checkmark-circle" size={20} color="#059669" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.successTitle}>Download Complete</Text>
              <Text style={styles.successDesc}>
                Your data file has been successfully generated.
              </Text>
            </View>
          </View>
        )}

        {/* Error Message */}
        {error !== "" && (
          <View style={styles.errorCard}>
            <Ionicons name="close-circle" size={20} color="#EF4444" />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.errorTitle}>Error</Text>
              <Text style={styles.errorDesc}>{error}</Text>
            </View>
          </View>
        )}

        {/* Download Button */}
        <TouchableOpacity
          style={[
            styles.downloadButton,
            isGenerating && { backgroundColor: "#CBD5E1" }
          ]}
          onPress={handleDownload}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="download" size={20} color="white" />
              <Text style={styles.downloadText}>
                {isComplete ? "Download Again" : "Download My Data"}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Footer Text */}
        <Text style={styles.footerText}>
          Estimated file size: 2–5 MB • Format: PDF
        </Text>

        <Text style={styles.footerHelp}>
          This data export is part of your privacy rights. Contact support if needed.
        </Text>

      </View>
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
    paddingTop: 40,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden"
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

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10
  },

  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4
  },

  headerSub: {
    color: "#BFDBFE",
    fontSize: 13,
    marginTop: 4,
    marginLeft: 35
  },

  body: {
    padding: 20
  },

  infoCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E40AF"
  },

  infoSub: {
    fontSize: 12,
    color: "#1E3A8A",
    marginTop: 2
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748B",
    marginBottom: 10
  },

  categoryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 8
  },

  categoryTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B"
  },

  categoryDesc: {
    fontSize: 11,
    color: "#64748B"
  },

  noticeCard: {
    backgroundColor: "#FEF3C7",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15
  },

  noticeTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#92400E"
  },

  noticeDesc: {
    fontSize: 11,
    color: "#78350F",
    marginTop: 2
  },

  successCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15
  },

  successTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#065F46"
  },

  successDesc: {
    fontSize: 11,
    color: "#047857",
    marginTop: 2
  },

  errorCard: {
    backgroundColor: "#FEE2E2",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15
  },

  errorTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#991B1B"
  },

  errorDesc: {
    fontSize: 11,
    color: "#7F1D1D",
    marginTop: 2
  },

  downloadButton: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 20
  },

  downloadText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold"
  },

  footerText: {
    textAlign: "center",
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 12
  },

  footerHelp: {
    textAlign: "center",
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 6
  }
});
