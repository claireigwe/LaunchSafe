import type { AppDocument, DocType } from "../types/documents.types";
import { triggerDocumentUploaded } from "@/features/notifications/api/notification-triggers";
import { logActivity } from "@/features/activity/api/activity-api";
import { audit } from "@/features/audit/api/audit-api";
import { getActiveBusinessId } from "@/lib/stores/app-store";
import { apiGet, apiPatch, apiDelete } from "@/lib/api/base";

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

export async function getDocuments(businessId?: string): Promise<AppDocument[]> {
  const bid = businessId || getActiveBusinessId();
  const data = await apiGet<AppDocument[]>(`/api/documents${bid ? `?businessId=${bid}` : ""}`);
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

export async function downloadDocument(doc: AppDocument): Promise<void> {
  if (!doc.fileUrl) return;
  try {
    const res = await fetch(doc.fileUrl);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = doc.fileName || "document";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch {}
}

