import { useEffect, useState, useCallback } from "react";
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
import * as FileSystem from "expo-file-system/legacy";
import { getUserStorageKey } from "../utils/userStorage";
import api from "../services/api";

interface DownloadedBook {
  bookId: string;
  title: string;
  localUri?: string;
  isOffline?: boolean;
}

export function DownloadedEbooksScreen({ navigation }: any) {

  const [downloadedBooks, setDownloadedBooks] = useState<DownloadedBook[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadDownloadedBooks();
    }, [])
  );

  async function loadDownloadedBooks() {
  try {

    const storageKey = await getUserStorageKey("downloadedBooks");

    const localData = await AsyncStorage.getItem(storageKey);

    const localBooks: DownloadedBook[] =
      localData ? JSON.parse(localData) : [];

    /* =========================
       Fetch from backend
    ========================= */

    const response = await api.get("/users/downloads");

    const backendBooks = response.data.ebooks || [];

    /* =========================
       Merge backend + local
    ========================= */

    const merged = backendBooks.map((book: any) => {

      const local = localBooks.find(
        (b) => b.bookId === book.contentId
      );

      return {
        bookId: book.contentId,
        title: book.title,
        localUri: local?.localUri,
        isOffline: !!local
      };

    });

    setDownloadedBooks(merged);

  } catch (error) {

    console.log("Error loading downloads:", error);

    setDownloadedBooks([]);

  }
}

  async function deleteBook(bookId: string, localUri?: string) {
    try {
      const storageKey = await getUserStorageKey("downloadedBooks");

      if (localUri) {
  await FileSystem.deleteAsync(localUri, { idempotent: true });
}

      const updated = downloadedBooks.filter(
        (b) => b.bookId !== bookId
      );

      setDownloadedBooks(updated);

      await AsyncStorage.setItem(
        storageKey,
        JSON.stringify(updated)
      );
      await api.delete(`/users/downloads/${bookId}`);
    } catch (error) {
      console.log("Delete error:", error);
    }
  }

  async function clearAllDownloads() {
    try {
      const storageKey = await getUserStorageKey("downloadedBooks");

      for (const book of downloadedBooks) {
        if (book.localUri) {
  await FileSystem.deleteAsync(book.localUri, { idempotent: true });
}
      }

      await AsyncStorage.removeItem(storageKey);
      setDownloadedBooks([]);
    } catch (error) {
      console.log("Clear error:", error);
    }
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={22} color="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Downloaded E-Books</Text>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {downloadedBooks.length === 0 && (
          <View style={styles.emptyBox}>
            <Ionicons name="cloud-download-outline" size={60} color="#CBD5E1" />
            <Text style={styles.emptyText}>No downloaded books yet</Text>
            <Text style={styles.emptySubText}>
              Download e-books to access them offline
            </Text>
          </View>
        )}

        {downloadedBooks.map((book) => (
          <TouchableOpacity
            key={book.bookId}
            style={styles.bookCard}
            onPress={() =>
  navigation.navigate("EBooksViewer", {
    topic: book.title,
    pdfUrl: book.isOffline ? "" : "API_PDF_URL_HERE",
    bookId: book.bookId
  })
}
          >
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.bookTitle}>{book.title}</Text>
              <Text style={styles.bookSub}>
  {book.isOffline ? "Available Offline" : "Tap to Download"}
</Text>
            </View>

            <Ionicons
              name="trash-outline"
              size={18}
              color="#EF4444"
              onPress={() => deleteBook(book.bookId, book.localUri)}
            />
          </TouchableOpacity>
        ))}

        {downloadedBooks.length > 0 && (
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={clearAllDownloads}
          >
            <Text style={{ color: "#EF4444" }}>Delete All</Text>
          </TouchableOpacity>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC"
  },
  logoutButton: {
    marginTop: 10,
    backgroundColor: "#FEE2E2",
    borderRadius: 14,
    padding: 14,
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    paddingTop:40,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#E2E8F0"
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center"
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#0F172A"
  },
  content: {
    padding: 20
  },
  bookCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B"
  },
  bookSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2
  },
  emptyBox: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100
  },
  emptyText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
    marginTop: 12
  },
  emptySubText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
    textAlign: "center"
  }
});