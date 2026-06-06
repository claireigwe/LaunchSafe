import type { DocumentType, ComplianceDocument } from "@/types/domain/document";
import { logActivity } from "@/features/activity/api/activity-api";
import { audit } from "@/features/audit/api/audit-api";

const GEN_KEY = "launchsafe-generated-documents";
const EVIDENCE_KEY = "launchsafe-evidence";

export interface EvidenceRecord {
  id: string;
  documentId: string;
  documentTitle: string;
  complianceTaskId: string;
  uploadedAt: string;
}

function loadGenerated(): ComplianceDocument[] {
  try {
    const raw = localStorage.getItem(GEN_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveGenerated(docs: ComplianceDocument[]) {
  try { localStorage.setItem(GEN_KEY, JSON.stringify(docs)); } catch {} 
}

function loadEvidence(): EvidenceRecord[] {
  try {
    const raw = localStorage.getItem(EVIDENCE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveEvidence(records: EvidenceRecord[]) {
  try { localStorage.setItem(EVIDENCE_KEY, JSON.stringify(records)); } catch {} 
}

function genId(): string {
  return `gen-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

const templates: Record<DocumentType, (context: string, businessName: string) => { title: string; content: string }> = {
  application_letter: (ctx, biz) => ({
    title: `${ctx || "General"} Application Letter`,
    content: `APPLICATION LETTER\n\n${biz}\n\nDate: ${new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}\n\nTo Whom It May Concern,\n\nThis is to formally apply for the necessary approvals, permits, and regulatory clearances required for our business operations.\n\nBusiness Name: ${biz}\nContext: ${ctx || "General business compliance"}\n\nWe undertake to comply with all applicable regulations and provide any additional information as required.\n\nYours faithfully,\n${biz}`,
  }),
  compliance_plan: (ctx, biz) => ({
    title: `${ctx || "General"} Compliance Plan`,
    content: `COMPLIANCE PLAN\n\n${biz}\n\nDate: ${new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}\n\n1. OBJECTIVES\nEstablish a compliance framework for ${biz} to ensure adherence to all applicable regulatory requirements.\n\n2. SCOPE\nThis compliance plan covers all business operations and regulatory obligations applicable to ${ctx || "our industry"}.\n\n3. KEY ACTIONS\n- Register with relevant regulatory bodies\n- Obtain required permits and licenses\n- Implement compliance monitoring systems\n- Schedule regular compliance reviews\n- Maintain accurate records\n\n4. TIMELINE\nPhased implementation over the next 90 days.\n\n5. RESPONSIBILITIES\nThe management team is responsible for ensuring compliance with all regulatory requirements.`,
  }),
  checklist: (ctx, biz) => ({
    title: `${ctx || "General"} Compliance Checklist`,
    content: `COMPLIANCE CHECKLIST\n\n${biz}\n\n${new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}\n\n[ ] Business name registered with CAC\n[ ] Tax Identification Number (TIN) obtained\n[ ] Business premises permit secured\n[ ] Industry-specific licenses applied for\n[ ] Employee registration completed\n[ ] Data protection compliance initiated\n[ ] Insurance policies obtained\n[ ] Vendor registration completed\n\nNotes: ${ctx || "Review and complete each item."}`,
  }),
  policy: (ctx, biz) => ({
    title: `${ctx || "General"} Compliance Policy`,
    content: `COMPLIANCE POLICY\n\n${biz}\n\nDate: ${new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}\n\n1. PURPOSE\nThis policy establishes the compliance framework for ${biz}. All employees and stakeholders must adhere to these guidelines.\n\n2. POLICY STATEMENT\n${biz} is committed to conducting business in full compliance with all applicable laws, regulations, and industry standards.\n\n3. COMPLIANCE PRINCIPLES\n- Integrity in all operations\n- Transparency with regulatory bodies\n- Timely fulfillment of obligations\n- Continuous improvement of compliance practices\n\n4. REPORTING\nAny compliance concerns should be reported to management immediately.\n\n5. REVIEW\nThis policy will be reviewed annually and updated as necessary.`,
  }),
  declaration: (ctx, biz) => ({
    title: `${ctx || "General"} Declaration`,
    content: `DECLARATION\n\n${biz}\n\nDate: ${new Date().toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}\n\nI, the undersigned representative of ${biz}, hereby declare that:\n\n1. The information provided to regulatory authorities is true and accurate.\n2. ${biz} will comply with all applicable laws and regulations.\n3. All required filings and submissions will be made within stipulated deadlines.\n\nContext: ${ctx || "General business declaration"}\n\nSigned on behalf of ${biz},\n\n______________________________\nAuthorized Signatory`,
  }),
  report: (ctx, biz) => ({
    title: `${ctx || "General"} Compliance Report`,
    content: `COMPLIANCE REPORT\n\n${biz}\n\nReporting Period: ${new Date().toLocaleDateString("en-NG", { month: "long", year: "numeric" })}\n\nSUMMARY\nThis report outlines the compliance status of ${biz} for the reporting period.\n\nCOMPLIANCE STATUS\n- Registrations: Complete\n- Licenses: Current\n- Filings: Up to date\n- Obligations: Being tracked\n\nDETAILS\n${ctx || "All compliance obligations are being monitored and addressed in a timely manner."}\n\nNEXT STEPS\n- Continue monitoring upcoming deadlines\n- Review regulatory updates\n- Update compliance documentation as needed`,
  }),
};

export function generateDocument(
  docType: DocumentType,
  context: string,
  businessName: string
): ComplianceDocument {
  const template = templates[docType];
  const { title, content } = template(context, businessName);

  const doc: ComplianceDocument = {
    id: genId(),
    businessId: "onboarded",
    userId: "user",
    requirementId: null,
    title,
    documentType: docType,
    status: "final",
    storagePath: null,
    content,
    version: 1,
    generatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const docs = loadGenerated();
  docs.unshift(doc);
  saveGenerated(docs);
  logActivity("document_uploaded", "Document Generated", doc.title);
  audit.documentGenerated(doc.id, doc.title);
  return doc;
}

export function getGeneratedDocuments(): ComplianceDocument[] {
  return loadGenerated().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function linkDocumentAsEvidence(documentId: string, documentTitle: string, complianceTaskId: string): void {
  const records = loadEvidence();
  records.unshift({
    id: genId(),
    documentId,
    documentTitle,
    complianceTaskId,
    uploadedAt: new Date().toISOString(),
  });
  saveEvidence(records);
}

export function getEvidenceForTask(taskId: string): EvidenceRecord[] {
  return loadEvidence().filter((e) => e.complianceTaskId === taskId);
}

export function getAllEvidence(): EvidenceRecord[] {
  return loadEvidence();
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
