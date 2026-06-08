import type { DocumentType, ComplianceDocument } from "@/types/domain/document";
import { logActivity } from "@/features/activity/api/activity-api";
import { audit } from "@/features/audit/api/audit-api";
import { getActiveBusinessId } from "@/lib/stores/app-store";

export async function generateDocument(
  docType: DocumentType,
  context: string,
  businessId?: string
): Promise<ComplianceDocument> {
  const res = await fetch("/api/documents/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ docType, context, businessId }),
  });
  
  const json = await res.json();
  if (!json.success || !json.data?.document) {
    throw new Error(json.error?.message || "Failed to generate document");
  }
  
  const doc = json.data.document;
  
  logActivity("document_uploaded", "Document Generated", doc.title);
  audit.documentGenerated(doc.id, doc.title);
  
  return doc;
}

export async function getGeneratedDocuments(): Promise<ComplianceDocument[]> {
  try {
    const businessId = getActiveBusinessId();
    const res = await fetch(`/api/documents/generated${businessId ? `?businessId=${businessId}` : ""}`);
    const json = await res.json();
    return json.success ? json.data : [];
  } catch {
    return [];
  }
}

export const DOC_TYPE_LABELS_GEN: Record<DocumentType, string> = {
  application_letter: "Application Letter",
  compliance_plan: "Compliance Plan",
  checklist: "Compliance Checklist",
  policy: "Compliance Policy",
  declaration: "Declaration",
  report: "Compliance Report",
};

export const DOC_TYPE_DESCRIPTIONS: Record<DocumentType, string> = {
  application_letter: "Generate a formal application letter for permits, licenses, or registrations.",
  compliance_plan: "Create a compliance plan outlining your regulatory approach.",
  checklist: "Generate a compliance checklist to track your obligations.",
  policy: "Create a compliance policy document for your business.",
  declaration: "Generate a formal declaration for regulatory submissions.",
  report: "Generate a compliance status report for review.",
};
