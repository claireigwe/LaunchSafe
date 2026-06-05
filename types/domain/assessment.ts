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

/** Available only after verified payment. */
export interface AssessmentFullReport {
  requirements: AssessmentRequirement[];
  agencies: AssessmentAgency[];
  totalOfficialCost: number;
  totalEstimatedCost: number;
  riskLevel: "low" | "medium" | "high";
  riskFactors: string[];
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
