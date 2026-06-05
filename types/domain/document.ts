export type DocumentStatus = "draft" | "final" | "archived";
export type DocumentType =
  | "application_letter"
  | "compliance_plan"
  | "checklist"
  | "policy"
  | "declaration"
  | "report";

export interface ComplianceDocument {
  id: string;
  businessId: string;
  userId: string;
  requirementId: string | null;
  title: string;
  documentType: DocumentType;
  status: DocumentStatus;
  storagePath: string | null;
  content: string | null;
  version: number;
  generatedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Evidence {
  id: string;
  businessId: string;
  userId: string;
  complianceTaskId: string | null;
  requirementId: string | null;
  title: string;
  description: string | null;
  fileUrl: string;
  fileType: string;
  fileSizeBytes: number;
  uploadedAt: string;
  isArchived: boolean;
}

export interface GenerateDocumentInput {
  businessId: string;
  requirementId: string;
  documentType: DocumentType;
  additionalContext?: string;
}
