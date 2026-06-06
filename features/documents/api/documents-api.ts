import type { AppDocument, DocType } from "../types/documents.types";
import { triggerDocumentUploaded } from "@/features/notifications/api/notification-triggers";
import { logActivity } from "@/features/activity/api/activity-api";
import { audit } from "@/features/audit/api/audit-api";

const DOCS_KEY = "launchsafe-documents";

/* ----- localStorage ----- */
function loadLocal(): AppDocument[] {
  try {
    const raw = localStorage.getItem(DOCS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveLocal(items: AppDocument[]): void {
  try { localStorage.setItem(DOCS_KEY, JSON.stringify(items)); } catch {} 
}

function genId(): string {
  return `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ----- API helpers ----- */
async function apiGet<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
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
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string | null;
}

export async function uploadDocument(input: UploadDocumentInput): Promise<AppDocument> {
  const formData = new FormData();
  formData.append("title", input.title);
  formData.append("description", input.description || "");
  formData.append("docType", input.docType);

  if (input.fileUrl && input.fileName) {
    try {
      const res = await fetch(input.fileUrl);
      const blob = await res.blob();
      formData.append("file", blob, input.fileName);
    } catch {
      formData.append("file", new Blob(), input.fileName);
    }
  }

  try {
    const res = await fetch("/api/documents/upload", { method: "POST", body: formData });
    const json = await res.json();
    if (json.success) {
      const doc = json.data;
      const items = loadLocal();
      items.unshift(doc);
      saveLocal(items);
      triggerDocumentUploaded(doc.title);
      logActivity("document_uploaded", "Document Uploaded", doc.title);
      audit.documentUploaded(doc.id, doc.title);
      return doc;
    }
  } catch {}

  const now = new Date().toISOString();
  const doc: AppDocument = {
    id: genId(),
    businessId: "onboarded",
    userId: "user",
    title: input.title,
    description: input.description || "",
    docType: input.docType,
    fileUrl: input.fileUrl,
    fileName: input.fileName,
    fileSize: input.fileSize,
    fileType: input.fileType,
    uploadedBy: "You",
    uploadedAt: now,
    updatedAt: now,
    expiryDate: null,
    issuingAgency: null,
    verificationStatus: null,
    renewalDate: null,
    tags: [],
  };
  const items = loadLocal();
  items.unshift(doc);
  saveLocal(items);
  triggerDocumentUploaded(doc.title);
  logActivity("document_uploaded", "Document Uploaded", doc.title);
  audit.documentUploaded(doc.id, doc.title);
  return doc;
}

export function getDocuments(): AppDocument[] {
  apiGet<AppDocument[]>("/api/documents").then((server) => {
    if (server) saveLocal(server);
  }).catch(() => {});
  return loadLocal().sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

export function getDocument(id: string): AppDocument | undefined {
  return loadLocal().find((d) => d.id === id);
}

export function updateDocument(id: string, updates: Partial<AppDocument>): AppDocument | null {
  const items = loadLocal();
  const idx = items.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...updates, updatedAt: new Date().toISOString() };
  saveLocal(items);
  return items[idx];
}

export async function deleteDocument(id: string): Promise<void> {
  await apiDelete(`/api/documents/${id}`);
  saveLocal(loadLocal().filter((d) => d.id !== id));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function getDocumentsByType(type: DocType): AppDocument[] {
  return loadLocal().filter((d) => d.docType === type);
}

export function searchDocuments(query: string, typeFilter?: string): AppDocument[] {
  let docs = loadLocal();
  if (typeFilter && typeFilter !== "all") {
    docs = docs.filter((d) => d.docType === typeFilter);
  }
  if (query.trim()) {
    const q = query.toLowerCase();
    docs = docs.filter((d) => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
  }
  return docs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}
