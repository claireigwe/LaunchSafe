import { createNotification } from "./notifications-api";
import { loadTasks } from "@/features/compliance/api/tasks-api";
import { fetchProfileAndPrefs } from "@/features/settings/api/settings-api";
import type { ComplianceTaskItem } from "@/features/compliance/types/tasks.types";

async function fireEmail(type: string, data?: Record<string, unknown>): Promise<void> {
  try {
    const pData = await fetchProfileAndPrefs();
    const email = pData?.profile?.email;
    if (!email) return;

    fetch("/api/notifications/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to: email, type, data }),
    }).catch(() => {});
  } catch {}
}

export function triggerTaskCreated(task: ComplianceTaskItem): void {
  createNotification(
    "New Compliance Task",
    `${task.title} has been created.${task.dueDate ? ` Due: ${new Date(task.dueDate).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}` : ""}`,
    "task",
    task.priority === "critical" ? "critical" : task.priority === "high" ? "warning" : "info",
    "/compliance",
    "View Task"
  );
  fireEmail("task_created", { title: task.title, dueDate: task.dueDate });
}

export function triggerTaskCompleted(title: string): void {
  createNotification(
    "Task Completed",
    `${title} has been marked as complete.`,
    "task",
    "info",
    "/compliance"
  );
  fireEmail("task_completed", { title });
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
  fireEmail("task_overdue", { title });
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
  fireEmail("document_uploaded", { title });
}

export function triggerSubscriptionActivated(planName: string): void {
  createNotification(
    "Subscription Activated",
    `Your ${planName} plan is now active. Welcome to Compliance Autopilot.`,
    "billing",
    "info",
    "/dashboard"
  );
  fireEmail("subscription_activated", { planName });
}

export function triggerSubscriptionRenewal(planName: string): void {
  createNotification(
    "Subscription Renewed",
    `Your ${planName} plan has been renewed successfully.`,
    "billing",
    "info",
    "/settings/billing"
  );
  fireEmail("subscription_renewed", { planName });
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
  fireEmail("payment_failed");
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
  fireEmail("welcome");
}

export function syncDeadlineNotifications(): void {
  const tasks = loadTasks();
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  for (const t of tasks) {
    if (t.status === "completed") continue;
    if (!t.dueDate) continue;

    const due = new Date(t.dueDate);
    due.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (t.status === "overdue") {
      const existing = loadNotificationsForTask(t.id);
      if (!existing.some((n) => n.title === "Task Overdue")) {
        triggerTaskOverdue(t.title);
      }
    } else if (diffDays <= 0) {
      const existing = loadNotificationsForTask(t.id);
      if (!existing.some((n) => n.title.includes("Due"))) {
        const title = "Due Today";
        createNotification(title, `${t.title} is due today.`, "deadline", "critical", "/compliance", "View Task");
        fireEmail("deadline_today", { title: t.title });
      }
    } else if (diffDays === 1) {
      const existing = loadNotificationsForTask(t.id);
      if (!existing.some((n) => n.title.includes("Due"))) {
        createNotification("Due Tomorrow", `${t.title} is due tomorrow.`, "deadline", "critical", "/compliance", "View Task");
        fireEmail("deadline_due_soon", { title: t.title, days: 1 });
      }
    } else if (diffDays <= 3) {
      const existing = loadNotificationsForTask(t.id);
      if (!existing.some((n) => n.title === "Due Soon")) {
        createNotification("Due Soon", `${t.title} is due in ${diffDays} days.`, "deadline", "warning", "/compliance", "View Task");
        fireEmail("deadline_due_soon", { title: t.title, days: diffDays });
      }
    } else if (diffDays <= 7) {
      const existing = loadNotificationsForTask(t.id);
      if (!existing.some((n) => n.title === "Deadline Approaching")) {
        createNotification("Deadline Approaching", `${t.title} is due in ${diffDays} days.`, "deadline", "warning", "/compliance", "View Task");
        fireEmail("deadline_approaching", { title: t.title, days: diffDays });
      }
    }
  }
}

function loadNotificationsForTask(taskId: string): any[] {
  try {
    const key = "launchsafe-notifications";
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw).filter((n: any) => n.message?.includes(taskId) || n.title?.match(/Due|Overdue|Deadline/)) : [];
  } catch { return []; }
}
