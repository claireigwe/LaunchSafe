export type ComplianceTaskStatus =
  | "not_started"
  | "in_progress"
  | "awaiting_submission"
  | "submitted"
  | "approved"
  | "due_soon"
  | "overdue"
  | "completed";

export interface ComplianceTask {
  id: string;
  businessId: string;
  requirementId: string;
  requirementName: string;
  agencyName: string;
  status: ComplianceTaskStatus;
  dueDate: string | null;
  completedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceScore {
  id: string;
  businessId: string;
  score: number; // 0-100
  breakdown: ComplianceScoreBreakdown;
  calculatedAt: string;
}

export interface ComplianceScoreBreakdown {
  completedTasks: number;
  totalTasks: number;
  overdueCount: number;
  missingEvidence: number;
  expiredDocuments: number;
}

export interface UpdateComplianceTaskInput {
  status?: ComplianceTaskStatus;
  dueDate?: string;
  notes?: string;
}
