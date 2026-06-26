export type ComplianceTaskStatus =
  | "not_started"
  | "pending"
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
  score: number;
  breakdown: ComplianceScoreBreakdown;
  previousScore: number | null;
  calculatedAt: string;
}

export interface ComplianceScoreBreakdown {
  completedTasks: number;
  totalTasks: number;
  overdueCount: number;
  missingEvidence: number;
  expiredDocuments: number;
  upcomingDeadlineCount: number;
}

export interface UpdateComplianceTaskInput {
  status?: ComplianceTaskStatus;
  dueDate?: string;
  notes?: string;
}
