import { getActiveBusinessId } from "@/lib/stores/app-store";

export interface EvidenceRecord {
  id: string;
  documentId?: string;
  businessId?: string;
  documentTitle: string;
  complianceTaskId: string;
  requirementId?: string;
  description?: string;
  fileUrl?: string;
  fileType?: string;
  fileSizeBytes?: number;
  isArchived?: boolean;
  uploadedAt: string;
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
  description?: string,
  businessId?: string
): Promise<EvidenceRecord> {
  const bid = businessId || getActiveBusinessId();
  if (!bid) throw new Error("Business ID is required to upload evidence");

  // Step 1: Get a signed upload URL
  const urlRes = await fetch("/api/evidence/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, fileType: file.type }),
  });
  const urlJson = await urlRes.json();
  if (!urlJson.success) throw new Error(urlJson.error?.message || "Failed to get upload URL");

  const { evidenceId, uploadUrl, storagePath } = urlJson.data;

  // Step 2: Upload file directly to Supabase Storage (one hop, no server buffering)
  const uploadRes = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type },
  });
  if (!uploadRes.ok) throw new Error("Failed to upload file to storage");

  // Step 3: Confirm the upload and save the evidence record
  const confirmRes = await fetch("/api/evidence/confirm", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      evidenceId,
      businessId: bid,
      complianceTaskId,
      title,
      description: description || "",
      storagePath,
      fileType: file.type,
      fileSize: file.size,
    }),
  });
  const confirmJson = await confirmRes.json();
  if (!confirmJson.success) throw new Error(confirmJson.error?.message || "Failed to save evidence record");

  return confirmJson.data as EvidenceRecord;
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

export async function removeEvidence(evidenceId: string): Promise<void> {
  const res = await fetch("/api/evidence", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: evidenceId }),
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error?.message || "Failed to remove evidence");
  }
}
