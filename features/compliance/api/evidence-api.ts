export interface EvidenceRecord {
  id: string;
  documentId?: string; // Optional, kept for backward compatibility with UI that expects it
  documentTitle: string;
  complianceTaskId: string;
  requirementId?: string;
  uploadedAt: string;
  fileUrl?: string;
  fileType?: string;
  fileSizeBytes?: number;
}

export async function fetchEvidence(): Promise<EvidenceRecord[]> {
  try {
    const res = await fetch("/api/evidence");
    const json = await res.json();
    if (json.success) {
      return json.data as EvidenceRecord[];
    }
  } catch {}
  return [];
}

export async function uploadEvidence(
  file: File,
  title: string,
  complianceTaskId: string,
  description?: string
): Promise<EvidenceRecord> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("complianceTaskId", complianceTaskId);
  if (description) {
    formData.append("description", description);
  }

  const res = await fetch("/api/evidence/upload", {
    method: "POST",
    body: formData,
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error?.message || "Failed to upload evidence");
  }

  return json.data as EvidenceRecord;
}

export async function linkDocumentAsEvidenceAPI(
  documentId: string,
  documentTitle: string,
  complianceTaskId: string,
  businessId?: string
): Promise<EvidenceRecord> {
  const res = await fetch("/api/evidence/link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ documentId, complianceTaskId, businessId }),
  });

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error?.message || "Failed to link document as evidence");
  }

  return json.data as EvidenceRecord;
}
