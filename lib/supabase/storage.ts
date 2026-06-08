import { createAdminClient } from "./server";

const BUCKET = "compliance-documents";

export async function uploadFile(
  userId: string,
  documentId: string,
  fileName: string,
  fileBuffer: ArrayBuffer,
  contentType: string
): Promise<string | null> {
  try {
    const supabase = createAdminClient();
    const path = `${userId}/${documentId}/${fileName}`;

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, fileBuffer, { contentType, upsert: false });

    if (error) {
      console.error("[Storage] Upload error:", error.message);
      return null;
    }

    return path;
  } catch (err) {
    console.error("[Storage] Upload exception:", err);
    return null;
  }
}

export async function getFileUrl(storagePath: string): Promise<string | null> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(storagePath, 86400, { download: true });

    return data?.signedUrl || null;
  } catch {
    return null;
  }
}

export async function deleteFile(storagePath: string): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([storagePath]);

    return !error;
  } catch {
    return false;
  }
}
