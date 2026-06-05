export type DocType =
  | "cac_certificate"
  | "tax_registration"
  | "business_permit"
  | "operating_license"
  | "inspection_report"
  | "compliance_certificate"
  | "policy_document"
  | "employee_record"
  | "other";

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  cac_certificate: "CAC Certificate",
  tax_registration: "Tax Registration",
  business_permit: "Business Permit",
  operating_license: "Operating License",
  inspection_report: "Inspection Report",
  compliance_certificate: "Compliance Certificate",
  policy_document: "Policy Document",
  employee_record: "Employee Record",
  other: "Other",
};

export const DOC_TYPE_CATEGORIES: Record<string, DocType[]> = {
  certificates: ["cac_certificate", "compliance_certificate"],
  permits: ["business_permit", "operating_license"],
  licenses: ["operating_license"],
  reports: ["inspection_report"],
  policies: ["policy_document"],
};

export interface AppDocument {
  id: string;
  businessId: string;
  userId: string;
  title: string;
  description: string;
  docType: DocType;
  fileUrl: string | null;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  updatedAt: string;
  expiryDate: string | null;
  issuingAgency: string | null;
  verificationStatus: string | null;
  renewalDate: string | null;
  tags: string[];
}

export interface SuggestedDocument {
  id: string;
  title: string;
  docType: DocType;
  reason: string;
  description: string;
}
