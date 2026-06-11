import type { SuggestedDocument, DocType } from "../types/documents.types";

interface DocProfile {
  industry: string;
  isRegistered: boolean | null;
  hasCAC: boolean | null;
  hasPhysicalLocation: boolean | null;
  hasOnlineOperations: boolean | null;
}

export function generateDocumentSuggestions(profile: DocProfile | null): SuggestedDocument[] {
  if (!profile) return [];

  const suggestions: SuggestedDocument[] = [];

  if (profile.hasCAC || profile.isRegistered) {
    suggestions.push({
      id: "sug-cac-cert",
      title: "CAC Certificate of Incorporation",
      docType: "cac_certificate" as DocType,
      reason: "Your business is registered with CAC. Consider uploading your certificate.",
      description: "Certificate of Incorporation issued by the Corporate Affairs Commission.",
    });
  }

  suggestions.push({
    id: "sug-tin",
    title: "Tax Identification Number (TIN) Document",
    docType: "tax_registration" as DocType,
    reason: "Every business requires a TIN for tax compliance.",
    description: "TIN registration certificate from the Federal Inland Revenue Service (FIRS).",
  });

  if (profile.hasPhysicalLocation) {
    suggestions.push({
      id: "sug-premises",
      title: "Business Premises Permit",
      docType: "business_permit" as DocType,
      reason: "Your business operates from a physical location that may require a permit.",
      description: "Permit from your local government authority for business premises.",
    });
  }

  if (profile.industry === "food-beverage") {
    suggestions.push({
      id: "sug-nafdac",
      title: "NAFDAC Registration Certificate",
      docType: "operating_license" as DocType,
      reason: "Food businesses typically require NAFDAC registration.",
      description: "NAFDAC product registration certificate for food products.",
    });
  }

  if (profile.industry === "health-pharma") {
    suggestions.push({
      id: "sug-health-license",
      title: "Health Facility License",
      docType: "operating_license" as DocType,
      reason: "Health businesses require facility licensing.",
      description: "License from the relevant health regulatory body.",
    });
  }

  if (profile.industry === "technology-saas" || profile.hasOnlineOperations) {
    suggestions.push({
      id: "sug-data-policy",
      title: "Data Protection Policy",
      docType: "policy_document" as DocType,
      reason: "Online businesses should maintain a data protection policy.",
      description: "Data protection and privacy policy document.",
    });
  }

  if (profile.industry === "finance-fintech") {
    suggestions.push({
      id: "sug-aml-policy",
      title: "Anti-Money Laundering (AML) Policy",
      docType: "policy_document" as DocType,
      reason: "Financial services must have strict AML compliance policies.",
      description: "Internal AML and KYC compliance guidelines.",
    });
    suggestions.push({
      id: "sug-cbn-license",
      title: "CBN Operating License",
      docType: "operating_license" as DocType,
      reason: "Financial institutions require Central Bank licensing.",
      description: "Operating license from the Central Bank or equivalent financial regulator.",
    });
  }

  if (profile.industry === "manufacturing" || profile.industry === "energy-mining" || profile.industry === "agriculture") {
    suggestions.push({
      id: "sug-eia",
      title: "Environmental Impact Assessment (EIA)",
      docType: "compliance_certificate" as DocType,
      reason: "Industrial and agricultural activities often require environmental clearance.",
      description: "Approved EIA report from the Ministry of Environment.",
    });
  }

  if (profile.industry === "education") {
    suggestions.push({
      id: "sug-min-ed",
      title: "Ministry of Education Approval",
      docType: "operating_license" as DocType,
      reason: "Educational institutions require government approval to operate.",
      description: "Approval letter or certificate from the Ministry of Education.",
    });
  }

  if (profile.industry === "transportation-logistics") {
    suggestions.push({
      id: "sug-fleet-insurance",
      title: "Commercial Fleet Insurance",
      docType: "insurance_policy" as DocType,
      reason: "Transport businesses must insure commercial vehicles.",
      description: "Comprehensive insurance coverage for commercial vehicles.",
    });
  }

  suggestions.push({
    id: "sug-compliance-policy",
    title: "Compliance Policy Document",
    docType: "policy_document" as DocType,
    reason: "A compliance policy helps document your commitment to regulatory compliance.",
    description: "Internal compliance policy document outlining your regulatory approach.",
  });

  return suggestions;
}
