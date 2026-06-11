import type { AppDocument, DocType } from "../types/documents.types";
import { triggerDocumentUploaded } from "@/features/notifications/api/notification-triggers";
import { logActivity } from "@/features/activity/api/activity-api";
import { audit } from "@/features/audit/api/audit-api";
import { getActiveBusinessId } from "@/lib/stores/app-store";

/* ----- API helpers ----- */
async function apiGet<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch { return null; }
}

async function apiPatch<T>(url: string, body: any): Promise<T | null> {
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const json = await res.json();
    return json.success ? json.data : null;
  } catch { return null; }
}

async function apiDelete(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "DELETE" });
    const json = await res.json();
    return json.success;
  } catch { return false; }
}

/* ----- Public API ----- */

export interface UploadDocumentInput {
  title: string;
  description?: string;
  docType: DocType;
  file: File;
}

export async function uploadDocument(input: UploadDocumentInput): Promise<AppDocument> {
  const businessId = getActiveBusinessId();
  const formData = new FormData();
  formData.append("title", input.title);
  formData.append("description", input.description || "");
  formData.append("docType", input.docType);
  if (businessId) formData.append("businessId", businessId);

  formData.append("file", input.file);

  const res = await fetch("/api/documents/upload", { method: "POST", body: formData });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error?.message || "Failed to upload document");
  }
  
  const doc = json.data as AppDocument;
  triggerDocumentUploaded(doc.title);
  logActivity("document_uploaded", "Document Uploaded", doc.title);
  audit.documentUploaded(doc.id, doc.title);
  return doc;
}

export async function getDocuments(): Promise<AppDocument[]> {
  const businessId = getActiveBusinessId();
  const data = await apiGet<AppDocument[]>(`/api/documents${businessId ? `?businessId=${businessId}` : ""}`);
  return data || [];
}

export async function getDocument(id: string): Promise<AppDocument | undefined> {
  const data = await apiGet<AppDocument>(`/api/documents/${id}`);
  return data || undefined;
}

export async function updateDocument(id: string, updates: Partial<AppDocument>): Promise<AppDocument | null> {
  const businessId = getActiveBusinessId();
  const mappedUpdates: any = { ...updates, businessId };
  if (updates.description !== undefined) mappedUpdates.content = updates.description;
  if (updates.docType !== undefined) mappedUpdates.document_type = updates.docType;

  return await apiPatch<AppDocument>(`/api/documents/${id}`, mappedUpdates);
}

export async function deleteDocument(id: string): Promise<void> {
  await apiDelete(`/api/documents/${id}`);
  audit.documentDeleted(id, id);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export async function getDocumentsByType(type: DocType): Promise<AppDocument[]> {
  const allDocs = await getDocuments();
  return allDocs.filter((d) => d.docType === type);
}

export async function searchDocuments(query: string, typeFilter?: string): Promise<AppDocument[]> {
  let docs = await getDocuments();
  if (typeFilter && typeFilter !== "all") {
    docs = docs.filter((d) => d.docType === typeFilter);
  }
  if (query.trim()) {
    const q = query.toLowerCase();
    docs = docs.filter((d) => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
  }
  return docs;
}
