import type { DocumentType } from "@/types/domain/document";

// Maps each DocumentType to the best matching template slug from document_templates
export const DOC_TYPE_TO_TEMPLATE: Record<DocumentType, string | null> = {
  application_letter: "application-cover-letter",
  compliance_plan: "compliance-plan",
  checklist: "compliance-checklist",
  policy: "privacy-policy",
  declaration: "application-declaration",
  report: null,
};
