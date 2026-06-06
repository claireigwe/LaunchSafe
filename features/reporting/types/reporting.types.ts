export interface HealthTrendPoint {
  label: string;
  score: number;
}

export interface TaskAnalytics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
}

export interface DeadlinePerformance {
  met: number;
  missed: number;
  upcoming: number;
  rating: "excellent" | "good" | "needs_attention";
}

export interface RiskReport {
  level: "low" | "medium" | "high";
  score: number;
  factors: string[];
  insights: string;
}

export interface DocumentReport {
  totalUploaded: number;
  missingRecommended: number;
  recentlyAdded: number;
  recommendations: string[];
}

export interface BusinessComparison {
  businessName: string;
  score: number;
  openTasks: number;
  overdueTasks: number;
  riskLevel: string;
}

export interface ActivityReport {
  tasksCreated: number;
  tasksCompleted: number;
  documentsUploaded: number;
  events: number;
  trendDays: { date: string; count: number }[];
}

export interface ReportData {
  healthTrend: HealthTrendPoint[];
  taskAnalytics: TaskAnalytics;
  deadlinePerformance: DeadlinePerformance;
  riskReport: RiskReport;
  documentReport: DocumentReport;
  comparisons: BusinessComparison[];
  activityReport: ActivityReport;
}
