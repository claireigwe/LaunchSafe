export type AssessmentStatus =
  | "draft"
  | "processing"
  | "completed"
  | "failed";

export type ConfidenceLevel = "verified" | "estimated" | "community_reported";

export interface Assessment {
  id: string;
  userId: string;
  businessId: string | null;
  industryId: string;
  countryId: string;
  stateId: string | null;
  status: AssessmentStatus;
  summaryJson: AssessmentSummary | null;
  resultsJson: AssessmentFullReport | null;
  createdAt: string;
  updatedAt: string;
}

/** Available before payment — no locked content. */
export interface AssessmentSummary {
  businessType: string;
  location: string;
  requirementCount: number;
  agencyCount: number;
  complexityScore: number;
  categories: string[];
}

/** A cost range with a label and optional note. */
export interface CostRange {
  label: string;
  min: number;
  max: number;
  note?: string;
}

/** An item in the Common Setup Costs section. */
export interface CommonCostItem {
  label: string;
  range: string;
  reason: string;
}

/** An item in the Local Costs & Levies section. */
export interface LocalCostItem {
  label: string;
  note: string;
}

/** Available only after verified payment. */
export interface AssessmentFullReport {
  /** Category 1: Verified regulatory requirements with costs */
  requirements: AssessmentRequirement[];
  /** Agencies involved in the requirements */
  agencies: AssessmentAgency[];
  /** Category 1 summary range */
  officialCosts: CostRange;
  /** Category 2: Common business setup costs */
  commonSetupCosts: CommonCostItem[];
  commonSetupCostRange: CostRange;
  /** Category 3: Potential local costs & levies */
  localCosts: LocalCostItem[];
  localCostNote: string;
  /** Overall estimated launch budget range */
  estimatedBudget: CostRange;
  /** Complexity assessment */
  riskLevel: "low" | "medium" | "high";
  riskFactors: string[];
  /** Compliance roadmap */
  roadmap: RoadmapItem[];
  generatedAt: string;
}

export interface AssessmentRequirement {
  id: string;
  name: string;
  description: string;
  agencyName: string;
  requirementType: string;
  officialCost: number | null;
  estimatedCost: number | null;
  communityReportedCost: number | null;
  deadline: string | null;
  frequency: string;
  confidenceLevel: ConfidenceLevel;
  sourceUrl: string | null;
}

export interface AssessmentAgency {
  id: string;
  name: string;
  acronym: string | null;
  requirementCount: number;
}

export interface RoadmapItem {
  phase: number;
  title: string;
  description: string;
  estimatedDuration: string;
  requirements: string[];
}

export interface CreateAssessmentInput {
  industryId: string;
  countryId: string;
  stateId?: string;
  businessId?: string;
}
