import { jwtDecode } from "jwt-decode";
import { loadToken } from "./authStorage";
import * as FileSystem from "expo-file-system/legacy";

type DecodedToken = {
  id?: string;
  _id?: string;
  userId?: string;
};

async function getUserId(): Promise<string> {
  const token = await loadToken();
  if (!token) throw new Error("No token found");

  const decoded: DecodedToken = jwtDecode(token);

  const id = decoded.id || decoded._id || decoded.userId;

  if (!id) throw new Error("User ID not found in token");

  return id;
}

/* =========================
   FILE FOLDER GENERATOR
========================= */

export async function getUserFolder(
  type: "papers" | "ebooks"
): Promise<string> {
  const userId = await getUserId();

  const basePath =
    FileSystem.documentDirectory +
    `${type}/${userId}/`;

  await FileSystem.makeDirectoryAsync(basePath, {
    intermediates: true,
  });

  return basePath;
}

/* =========================
   STORAGE KEY GENERATOR
========================= */

export async function getUserStorageKey(
  key: string
): Promise<string> {
  const userId = await getUserId();
  return `${key}_${userId}`;
}