export type TaskPriority = "low" | "medium" | "high" | "critical";
export type TaskStatus = "pending" | "in_progress" | "awaiting_submission" | "submitted" | "approved" | "due_soon" | "overdue" | "completed";
export type TaskSource = "manual" | "suggested";

export interface ComplianceTaskItem {
  id: string;
  businessId: string;
  title: string;
  description: string;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  source: TaskSource;
  suggestionReason: string | null;
  reminderDate: string | null;
  reminderEnabled: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface SuggestedTask {
  id: string;
  title: string;
  description: string;
  explanation: string;
  priority: TaskPriority;
  reason: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  priority: TaskPriority;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  dueDate?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  reminderDate?: string | null;
  reminderEnabled?: boolean;
}
