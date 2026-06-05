export type ConfidenceLevel = "verified" | "estimated" | "community_reported";
export type RequirementType =
  | "registration"
  | "license"
  | "permit"
  | "inspection"
  | "tax"
  | "filing"
  | "certification"
  | "reporting";

export type RequirementFrequency =
  | "one_time"
  | "monthly"
  | "quarterly"
  | "annual"
  | "event_driven";

export type RequirementStatus =
  | "draft"
  | "under_review"
  | "verified"
  | "active"
  | "updated"
  | "archived";

export interface Country {
  id: string;
  name: string;
  code: string;
  currencyCode: string;
  isActive: boolean;
}

export interface State {
  id: string;
  countryId: string;
  name: string;
  code: string | null;
}

export interface LGA {
  id: string;
  stateId: string;
  name: string;
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
}

export interface Agency {
  id: string;
  name: string;
  acronym: string | null;
  countryId: string;
  website: string | null;
  description: string | null;
}

export interface Requirement {
  id: string;
  agencyId: string;
  agency: Agency;
  industryId: string;
  countryId: string;
  stateId: string | null;
  name: string;
  description: string;
  requirementType: RequirementType;
  frequency: RequirementFrequency;
  status: RequirementStatus;
  confidenceLevel: ConfidenceLevel;
  isVerified: boolean;
  sourceUrl: string | null;
  sourceDocument: string | null;
  verifiedAt: string | null;
  lastReviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  costs: RequirementCost[];
}

export interface RequirementCost {
  id: string;
  requirementId: string;
  costType: "official" | "estimated" | "community_reported";
  amount: number;
  currency: string;
  notes: string | null;
  isVerified: boolean;
}

export interface RegulatoryUpdate {
  id: string;
  title: string;
  summary: string;
  source: string;
  sourceUrl: string | null;
  effectiveDate: string;
  affectedIndustries: string[];
  affectedRequirements: string[];
  impactLevel: "low" | "medium" | "high";
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}
