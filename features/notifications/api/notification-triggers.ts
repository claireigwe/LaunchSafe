import { createNotification } from "./notifications-api";
import type { ComplianceTaskItem } from "@/features/compliance/types/tasks.types";

export function triggerTaskCreated(task: ComplianceTaskItem): void {
  createNotification(
    "New Compliance Task",
    `${task.title} has been created.${task.dueDate ? ` Due: ${new Date(task.dueDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}` : ""}`,
    "task",
    task.priority === "critical" ? "critical" : task.priority === "high" ? "warning" : "info",
    "/compliance",
    "View Task"
  );
}

export function triggerTaskCompleted(title: string): void {
  createNotification(
    "Task Completed",
    `${title} has been marked as complete.`,
    "task",
    "info",
    "/compliance"
  );
}

export function triggerTaskOverdue(title: string): void {
  createNotification(
    "Task Overdue",
    `${title} is overdue and requires immediate attention.`,
    "deadline",
    "critical",
    "/compliance",
    "View Task"
  );
}

export function triggerDocumentUploaded(title: string): void {
  createNotification(
    "Document Uploaded",
    `${title} has been uploaded successfully.`,
    "document",
    "info",
    "/documents",
    "View Document"
  );
}

export function triggerSubscriptionActivated(planName: string): void {
  createNotification(
    "Subscription Activated",
    `Your ${planName} plan is now active. Welcome to Compliance Autopilot.`,
    "billing",
    "info",
    "/dashboard"
  );
}

export function triggerSubscriptionRenewal(planName: string): void {
  createNotification(
    "Subscription Renewed",
    `Your ${planName} plan has been renewed successfully.`,
    "billing",
    "info",
    "/settings/billing"
  );
}

export function triggerPaymentFailed(): void {
  createNotification(
    "Payment Failed",
    "Your recent payment could not be processed. Please update your payment method.",
    "billing",
    "critical",
    "/settings/billing",
    "Update Payment Method"
  );
}

export function triggerWelcome(): void {
  createNotification(
    "Welcome to LaunchSafe",
    "Your compliance workspace is ready. Start by adding your first compliance task.",
    "system",
    "info",
    "/compliance",
    "Create Task"
  );
}

// Email notifications for task deadlines are handled server-side by the cron job at /api/cron/reminders.
// Transactional emails (subscription activated, payment failed) are handled by the Paystack webhook handler.
