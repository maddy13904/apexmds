import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Pdf from "react-native-pdf";
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Slider from "@react-native-community/slider";
import { getUserFolder, getUserStorageKey } from "../utils/userStorage";

const { width } = Dimensions.get("window");

export function QuestionPaperViewerScreen({ route, navigation }: any) {
  const { pdfUrl, year } = route.params;

  const [loading, setLoading] = useState(true);
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState("1");

  const pdfRef = useRef<any>(null);

  useEffect(() => {
    prepareFile();
  }, []);

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  async function prepareFile() {
    try {
      const paperFolder = await getUserFolder("papers");
      const fileUri = paperFolder + `neet_mds_${year}.pdf`;

      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (fileInfo.exists && fileInfo.size && fileInfo.size > 1000) {
        setLocalUri(fileUri);
        setLoading(false);
        return;
      }

      Alert.alert(
        "Download Required",
        "This paper needs to be downloaded first.",
        [
          { text: "Cancel", style: "cancel", onPress: () => navigation.goBack() },
          { text: "Download", onPress: () => downloadFile(fileUri) }
        ]
      );
    } catch (error) {
      console.log("Prepare error:", error);
      setLoading(false);
    }
  }

  async function downloadFile(fileUri: string) {
    try {
      setLoading(true);

      const downloadResumable = FileSystem.createDownloadResumable(
        pdfUrl,
        fileUri
      );

      await downloadResumable.downloadAsync();

      setLocalUri(fileUri);
    } catch (error) {
      console.log("Download error:", error);
      Alert.alert("Download Failed", "Unable to download file.");
    } finally {
      setLoading(false);
    }
  }

  async function saveLastPage(page: number) {
    const key = await getUserStorageKey(`question_page_${year}`);
    await AsyncStorage.setItem(key, page.toString());
  }

  async function restoreLastPage(total: number) {
    const key = await getUserStorageKey(`question_page_${year}`);
    const saved = await AsyncStorage.getItem(key);

    if (saved) {
      const page = parseInt(saved, 10);

      if (page >= 1 && page <= total) {
        setCurrentPage(page);
        setTimeout(() => {
          pdfRef.current?.setPage(page);
        }, 500);
      }
    }
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>NEET MDS {year}</Text>
          <Text style={styles.headerSub}>Previous Year Paper</Text>
        </View>
      </View>

      {!loading && localUri && pageCount > 0 && (
        <View style={styles.footer}>

          <View style={styles.pageBar}>
            <TextInput
              style={styles.pageInput}
              value={pageInput}
              keyboardType="numeric"
              onChangeText={(text) =>
                setPageInput(text.replace(/[^0-9]/g, ""))
              }
              onSubmitEditing={() => {
                const pageNumber = parseInt(pageInput, 10);

                if (pageNumber >= 1 && pageNumber <= pageCount) {
                  pdfRef.current?.setPage(pageNumber);
                } else {
                  Alert.alert(
                    "Invalid Page",
                    `Enter a number between 1 and ${pageCount}`
                  );
                  setPageInput(currentPage.toString());
                }
              }}
            />

            <Text style={styles.pageDivider}>
              / {pageCount}
            </Text>
          </View>

          <Slider
            style={{ width: "90%", marginTop: 8 }}
            minimumValue={1}
            maximumValue={pageCount}
            value={currentPage}
            step={1}
            onSlidingComplete={(value) => {
              pdfRef.current?.setPage(value);
            }}
          />
        </View>
      )}

      <View style={styles.pdfContainer}>
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#2563EB" />
            <Text style={styles.loadingText}>Loading Paper...</Text>
          </View>
        )}

        {!loading && localUri && (
          <Pdf
            ref={pdfRef}
            source={{ uri: localUri }}
            style={{ flex: 1, width }}
            onLoadComplete={(numberOfPages) => {
              setPageCount(numberOfPages);
              restoreLastPage(numberOfPages);
            }}
            onPageChanged={(page) => {
              setCurrentPage(page);
              saveLastPage(page);
            }}
          />
        )}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    backgroundColor: "#1E40AF",
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },
  headerSub: {
    color: "#DBEAFE",
    fontSize: 12,
    marginTop: 2
  },
  pdfContainer: { flex: 1 },
  loader: {
    position: "absolute",
    top: "45%",
    left: 0,
    right: 0,
    alignItems: "center"
  },
  loadingText: {
    marginTop: 10,
    color: "#2563EB",
    fontWeight: "500"
  },
  footer: {
    paddingVertical: 10,
    backgroundColor: "white",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0"
  },
  pageBar: {
    flexDirection: "row",
    alignItems: "center"
  },
  pageInput: {
    width: 50,
    height: 36,
    backgroundColor: "white",
    borderRadius: 8,
    textAlign: "center",
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "#E2E8F0"
  },
  pageDivider: {
    marginLeft: 6,
    fontSize: 14,
    color: "#475569"
  }
});