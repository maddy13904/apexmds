import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../services/api";
import { getUserStorageKey } from "../utils/userStorage";

export const syncDownloads = async () => {

  try {

    // ✅ correct user-specific storage key
    const storageKey = await getUserStorageKey("downloadedBooks");

    // local downloads
    const local = await AsyncStorage.getItem(storageKey);
    const localBooks = JSON.parse(local || "[]");

    // server downloads
    const res = await api.get("/users/downloads");
    const serverBooks = res.data.ebooks || [];

    const serverIds = serverBooks.map((b: any) => b.contentId);

    // keep only books still present on server
    const filtered = localBooks.filter((b: any) =>
      serverIds.includes(b.bookId)
    );

    // update AsyncStorage
    await AsyncStorage.setItem(
      storageKey,
      JSON.stringify(filtered)
    );

    return filtered;

  } catch (err) {

    console.log("Download sync failed:", err);
    return [];

  }

};