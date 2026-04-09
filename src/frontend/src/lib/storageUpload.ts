/**
 * Image upload utility using Firebase Storage SDK.
 * Uses uploadBytes() — no base64, no blob URLs, no JSON serialization.
 */
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Uploads an image file to Firebase Storage under the 'products/' path.
 * Returns the permanent download URL.
 *
 * @param file - The image File to upload (must be an image/* MIME type)
 * @param onProgress - Optional callback invoked with 0→100 progress (0 = start, 100 = done)
 */
export async function uploadImageToStorage(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<string> {
  // ── Validate ─────────────────────────────────────────────────────────────
  if (!file) throw new Error("No file provided");
  if (!file.type.startsWith("image/")) {
    throw new Error(
      `Invalid file type: ${file.type}. Only image files are allowed.`,
    );
  }

  // ── Init progress ─────────────────────────────────────────────────────────
  if (onProgress) onProgress(0);

  console.log("Starting upload for:", file.name, file.type, file.size);

  // ── Build storage reference ───────────────────────────────────────────────
  const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);

  // ── Upload ────────────────────────────────────────────────────────────────
  console.log("Uploading to Firebase Storage path:", storageRef.fullPath);
  await uploadBytes(storageRef, file);

  console.log("Upload complete, getting download URL...");
  if (onProgress) onProgress(80);

  // ── Get download URL ──────────────────────────────────────────────────────
  let url: string;
  try {
    url = await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }

  console.log("Download URL obtained:", url);
  if (onProgress) onProgress(100);

  return url;
}
