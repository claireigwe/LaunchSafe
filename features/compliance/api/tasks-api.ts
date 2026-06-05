import type { ComplianceTaskItem, CreateTaskInput, UpdateTaskInput } from "../types/tasks.types";
import { triggerTaskCreated, triggerTaskCompleted, triggerTaskOverdue, syncDeadlineNotifications } from "@/features/notifications/api/notification-triggers";

const TASKS_KEY = "launchsafe-tasks";

export function loadTasks(): ComplianceTaskItem[] {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: ComplianceTaskItem[]): void {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch {}
}

export function createTask(input: CreateTaskInput, businessId: string): ComplianceTaskItem {
  const tasks = loadTasks();
  const now = new Date().toISOString();
  const task: ComplianceTaskItem = {
    id: crypto.randomUUID?.() || `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    businessId,
    title: input.title,
    description: input.description || "",
    dueDate: input.dueDate || null,
    priority: input.priority,
    status: computeInitialStatus(input.dueDate),
    source: "manual",
    suggestionReason: null,
    reminderDate: null,
    reminderEnabled: false,
    createdBy: "user",
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(task);
  saveTasks(tasks);
  triggerTaskCreated(task);
  return task;
}

export function updateTask(id: string, input: UpdateTaskInput): ComplianceTaskItem | null {
  const tasks = loadTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  tasks[idx] = { ...tasks[idx], ...input, updatedAt: new Date().toISOString() };
  if (input.dueDate) {
    tasks[idx].status = computeInitialStatus(input.dueDate);
  }
  saveTasks(tasks);
  return tasks[idx];
}

export function deleteTask(id: string): void {
  const tasks = loadTasks().filter((t) => t.id !== id);
  saveTasks(tasks);
}

export function completeTask(id: string): ComplianceTaskItem | null {
  const result = updateTask(id, { status: "completed" });
  if (result) triggerTaskCompleted(result.title);
  return result;
}

export function addSuggestedTask(suggested: { title: string; description: string; priority: string; explanation?: string }, businessId: string): ComplianceTaskItem {
  return createTask(
    {
      title: suggested.title,
      description: suggested.description,
      priority: suggested.priority as any,
    },
    businessId
  );
}

function computeInitialStatus(dueDate: string | undefined | null): "pending" | "overdue" {
  if (!dueDate) return "pending";
  const due = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return due < now ? "overdue" : "pending";
}

export function reconcileTaskStatuses(): void {
  const tasks = loadTasks();
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  let changed = false;
  for (const t of tasks) {
    if (t.status === "completed") continue;
    if (t.dueDate) {
      const due = new Date(t.dueDate);
      if (due < now && t.status !== "overdue") {
        t.status = "overdue";
        t.updatedAt = new Date().toISOString();
        changed = true;
        triggerTaskOverdue(t.title);
      }
    }
  }
  if (changed) saveTasks(tasks);
  syncDeadlineNotifications();
}
