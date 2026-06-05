import type { AppDocument, DocType } from "../types/documents.types";
import { triggerDocumentUploaded } from "@/features/notifications/api/notification-triggers";

const DOCS_KEY = "launchsafe-documents";

function load(): AppDocument[] {
  try {
    const raw = localStorage.getItem(DOCS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function save(items: AppDocument[]): void {
  try { localStorage.setItem(DOCS_KEY, JSON.stringify(items)); } catch {}
}

function generateId(): string {
  return `doc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getDocuments(): AppDocument[] {
  return load().sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}

export function getDocument(id: string): AppDocument | undefined {
  return load().find((d) => d.id === id);
}

export interface UploadDocumentInput {
  title: string;
  description?: string;
  docType: DocType;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string | null;
}

export function uploadDocument(input: UploadDocumentInput): AppDocument {
  const items = load();
  const now = new Date().toISOString();
  const doc: AppDocument = {
    id: generateId(),
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
  items.unshift(doc);
  save(items);
  triggerDocumentUploaded(doc.title);
  return doc;
}

export function updateDocument(id: string, updates: Partial<AppDocument>): AppDocument | null {
  const items = load();
  const idx = items.findIndex((d) => d.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...updates, updatedAt: new Date().toISOString() };
  save(items);
  return items[idx];
}

export function deleteDocument(id: string): void {
  save(load().filter((d) => d.id !== id));
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export function getDocumentsByType(type: DocType): AppDocument[] {
  return load().filter((d) => d.docType === type);
}

export function searchDocuments(query: string, typeFilter?: string): AppDocument[] {
  let docs = load();
  if (typeFilter && typeFilter !== "all") {
    docs = docs.filter((d) => d.docType === typeFilter);
  }
  if (query.trim()) {
    const q = query.toLowerCase();
    docs = docs.filter((d) => d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q));
  }
  return docs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
}
