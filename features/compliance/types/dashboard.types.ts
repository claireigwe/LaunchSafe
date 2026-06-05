import type { ComplianceTask, ComplianceScore } from "@/types/domain/compliance";
import type { Business } from "@/types/domain/business";
import type { RegulatoryUpdate } from "@/types/domain/regulatory";
import type { Notification } from "@/types/domain/notification";

export interface DashboardActivity {
  id: string;
  type: "task_completed" | "document_uploaded" | "compliance_event" | "subscription";
  title: string;
  description: string;
  timestamp: string;
}

export interface DashboardData {
  score: ComplianceScore | null;
  upcomingDeadlines: ComplianceTask[];
  overdueItems: ComplianceTask[];
  tasks: ComplianceTask[];
  regulatoryUpdates: RegulatoryUpdate[];
  business: Business | null;
  recentActivity: DashboardActivity[];
  notifications: Notification[];
}
