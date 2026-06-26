import { getDocuments } from "@/features/documents/api/documents-api";
import { getRecentActivity } from "@/features/activity/api/activity-api";
import { fetchAllBusinesses } from "@/features/businesses/api/onboarding-api";
import type {
  ReportData,
  HealthTrendPoint,
  TaskAnalytics,
  DeadlinePerformance,
  RiskReport,
  DocumentReport,
  BusinessComparison,
  ActivityReport,
} from "../types/reporting.types";
import type { ComplianceTaskItem } from "@/features/compliance/types/tasks.types";

export async function generateReportData(tasks: ComplianceTaskItem[]): Promise<ReportData> {
  const docs = await getDocuments();
  return {
    healthTrend: computeHealthTrend(tasks),
    taskAnalytics: computeTaskAnalytics(tasks),
    deadlinePerformance: computeDeadlinePerformance(tasks),
    riskReport: await computeRiskReport(tasks, docs),
    documentReport: computeDocumentReport(docs),
    comparisons: await computeComparisons(tasks),
    activityReport: await computeActivityReport(tasks, docs),
  };
}

function computeHealthTrend(tasks: ComplianceTaskItem[]): HealthTrendPoint[] {
  if (tasks.length === 0) return [];

  const now = new Date();
  const completed = tasks.filter((t) => t.status === "completed").length;
  const currentRate = Math.round((completed / tasks.length) * 100);

  const points: HealthTrendPoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("en-NG", { month: "short", year: i > 0 ? "2-digit" : undefined }).replace(" ", " '");
    points.push({ label, score: currentRate });
  }
  return points;
}

function computeTaskAnalytics(tasks: ComplianceTaskItem[]): TaskAnalytics {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const overdue = tasks.filter((t) => t.status === "overdue").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { totalTasks: total, completedTasks: completed, pendingTasks: pending, overdueTasks: overdue, completionRate: rate };
}

function computeDeadlinePerformance(tasks: ComplianceTaskItem[]): DeadlinePerformance {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const met = tasks.filter((t) => t.status === "completed" && t.dueDate && new Date(t.dueDate) >= now).length;
  const missed = tasks.filter((t) => t.status === "overdue").length;
  const upcoming = tasks.filter((t) => t.status !== "completed" && t.dueDate && new Date(t.dueDate) >= now).length;

  const ratio = met + missed > 0 ? met / (met + missed) : 1;
  const rating = ratio >= 0.9 ? "excellent" : ratio >= 0.7 ? "good" : "needs_attention";

  return { met, missed, upcoming, rating };
}

async function computeRiskReport(tasks: ComplianceTaskItem[], docs: any[]): Promise<RiskReport> {
  const overdue = tasks.filter((t) => t.status === "overdue").length;
  const missed = tasks.filter((t) => t.status === "overdue" && t.dueDate).length;
  const hasDocs = docs.length;
  const activity = (await getRecentActivity(30)).length;

  let score = 0;
  const factors: string[] = [];

  if (overdue > 5) { score += 30; factors.push(`${overdue} compliance tasks are overdue.`); }
  else if (overdue > 2) { score += 20; factors.push(`${overdue} compliance tasks are overdue.`); }
  else if (overdue > 0) { score += 10; factors.push(`${overdue} task${overdue > 1 ? "s are" : " is"} overdue.`); }

  if (missed > 3) { score += 25; factors.push(`${missed} deadlines were missed.`); }
  else if (missed > 0) { score += 15; factors.push(`${missed} deadline${missed > 1 ? "s were" : " was"} missed.`); }

  if (hasDocs < 3) { score += 15; factors.push("Few compliance documents uploaded."); }
  if (activity < 5) { score += 10; factors.push("Low recent compliance activity."); }

  if (tasks.length === 0) {
    score = 20;
    factors.push("No compliance tasks created yet.");
  }

  const level = score >= 50 ? "high" : score >= 25 ? "medium" : "low";

  return { level, score, factors, insights: "" };
}

function computeDocumentReport(docs: any[]): DocumentReport {
  const uploaded = docs.length;

  const recommended = getMissingRecommended();
  const missing = recommended.filter((r) => !docs.some((d) => d.title.toLowerCase().includes(r.toLowerCase())));

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recent = docs.filter((d) => new Date(d.uploadedAt) >= thirtyDaysAgo).length;

  return {
    totalUploaded: uploaded,
    missingRecommended: missing.length,
    recentlyAdded: recent,
    recommendations: missing.slice(0, 3),
  };
}

function getMissingRecommended(): string[] {
  return [
    "CAC Certificate",
    "Tax Identification",
    "Business Permit",
  ];
}

async function computeComparisons(tasks: ComplianceTaskItem[]): Promise<BusinessComparison[]> {
  const businesses = await fetchAllBusinesses();

  if (businesses.length <= 1) return [];

  return businesses.map((b) => {
    const bizTasks = tasks.filter((t) => t.businessId === b.id);
    const total = bizTasks.length;
    const completed = bizTasks.filter((t) => t.status === "completed").length;
    const overdue = bizTasks.filter((t) => t.status === "overdue").length;
    const score = total > 0 ? Math.round((completed / total) * 100) : 0;
    const risk = score >= 80 ? "Low Risk" : score >= 50 ? "Medium Risk" : "High Risk";

    return {
      businessName: b.name,
      score,
      openTasks: total - completed,
      overdueTasks: overdue,
      riskLevel: risk,
    };
  });
}

async function computeActivityReport(tasks: ComplianceTaskItem[], docs: any[]): Promise<ActivityReport> {
  const activity = await getRecentActivity(100);

  const tasksCreated = activity.filter((a) => a.type === "task_created").length + tasks.length;
  const tasksCompleted = activity.filter((a) => a.type === "task_completed").length + tasks.filter((t) => t.status === "completed").length;
  const documentsUploaded = activity.filter((a) => a.type === "document_uploaded").length + docs.length;
  const events = activity.filter((a) => a.type === "subscription_activated" || a.type === "notification_triggered").length;

  return { tasksCreated, tasksCompleted, documentsUploaded, events, trendDays: [] };
}

export function canAccessReporting(planId: string): boolean {
  return planId === "growth" || planId === "enterprise";
}

export function canExport(planId: string): boolean {
  return planId === "enterprise";
}
