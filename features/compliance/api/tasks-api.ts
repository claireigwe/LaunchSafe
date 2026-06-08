import type { ComplianceTaskItem, CreateTaskInput, UpdateTaskInput } from "../types/tasks.types";
import { triggerTaskCreated, triggerTaskCompleted, triggerTaskOverdue, syncDeadlineNotifications } from "@/features/notifications/api/notification-triggers";
import { logActivity } from "@/features/activity/api/activity-api";
import { audit } from "@/features/audit/api/audit-api";
import { getActiveBusinessId } from "@/lib/stores/app-store";

function tasksKey(businessId?: string): string {
  const bid = businessId || getActiveBusinessId() || "default";
  return `launchsafe-tasks-${bid}`;
}

/* ----- localStorage fallback ----- */
function loadLocal(businessId?: string): ComplianceTaskItem[] {
  try {
    const raw = localStorage.getItem(tasksKey(businessId));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveLocal(tasks: ComplianceTaskItem[], businessId?: string): void {
  try { localStorage.setItem(tasksKey(businessId), JSON.stringify(tasks)); } catch {}
}

/* ----- API helpers ----- */
async function apiGet<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch { return null; }
}

async function apiPost<T>(url: string, body: any): Promise<T | null> {
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json();
    return json.success ? json.data : null;
  } catch { return null; }
}

async function apiPatch<T>(url: string, body: any): Promise<T | null> {
  try {
    const res = await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json();
    return json.success ? json.data : null;
  } catch { return null; }
}

async function apiDelete(url: string, body: any): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json();
    return json.success;
  } catch { return false; }
}

function genId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function computeInitialStatus(dueDate: string | undefined | null): "pending" | "overdue" {
  if (!dueDate) return "pending";
  const due = new Date(dueDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return due < now ? "overdue" : "pending";
}

/* ----- Public API ----- */

let syncPromise: Promise<void> | null = null;

function triggerSync(): void {
  if (syncPromise) return;
  const businessId = getActiveBusinessId();
  if (!businessId) return;
  syncPromise = (async () => {
    try {
      const server = await apiGet<ComplianceTaskItem[]>(`/api/compliance?businessId=${businessId}`);
      if (server) saveLocal(server, businessId);
    } catch {} finally {
      syncPromise = null;
    }
  })();
}

export function loadTasks(): ComplianceTaskItem[] {
  triggerSync();
  return loadLocal();
}

export async function ensureTasksSynced(): Promise<ComplianceTaskItem[]> {
  const businessId = getActiveBusinessId();
  if (!businessId) return loadLocal();
  try {
    const server = await apiGet<ComplianceTaskItem[]>(`/api/compliance?businessId=${businessId}`);
    if (server) {
      saveLocal(server, businessId);
      return server;
    }
  } catch {}
  return loadLocal(businessId);
}

export function saveTasks(tasks: ComplianceTaskItem[], businessId?: string): void {
  saveLocal(tasks, businessId);
}

export async function createTask(input: CreateTaskInput, businessId?: string): Promise<ComplianceTaskItem> {
  const bid = businessId || getActiveBusinessId() || "";
  const now = new Date().toISOString();
  const localTask: ComplianceTaskItem = {
    id: genId(),
    businessId: bid,
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

  const server = await apiPost<ComplianceTaskItem>("/api/compliance", { ...input, businessId: bid });
  if (server) {
    const tasks = loadLocal();
    tasks.push(server);
    saveLocal(tasks);
    triggerTaskCreated(server);
    logActivity("task_created", "New Task Created", server.title);
    return server;
  }

  const tasks = loadLocal();
  tasks.push(localTask);
  saveLocal(tasks);
  triggerTaskCreated(localTask);
  logActivity("task_created", "New Task Created", localTask.title);
  audit.taskCreated(localTask.id, localTask.title);
  return localTask;
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<ComplianceTaskItem | null> {
  const businessId = getActiveBusinessId();
  const server = await apiPatch<ComplianceTaskItem>("/api/compliance", { id, ...input, businessId });
  if (server) {
    const tasks = loadLocal();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx >= 0) tasks[idx] = server;
    else tasks.push(server);
    saveLocal(tasks);
    return server;
  }

  const tasks = loadLocal();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  tasks[idx] = { ...tasks[idx], ...input, updatedAt: new Date().toISOString() };
  if (input.dueDate) tasks[idx].status = computeInitialStatus(input.dueDate);
  saveLocal(tasks);
  return tasks[idx];
}

export async function deleteTask(id: string): Promise<void> {
  const deletedTask = loadLocal().find((t) => t.id === id);
  const businessId = getActiveBusinessId();
  await apiDelete("/api/compliance", { id, businessId });
  const tasks = loadLocal().filter((t) => t.id !== id);
  saveLocal(tasks);
  if (deletedTask) audit.taskDeleted(id, deletedTask.title);
}

export async function completeTask(id: string): Promise<ComplianceTaskItem | null> {
  const result = await updateTask(id, { status: "completed" });
  if (result) {
    triggerTaskCompleted(result.title);
    logActivity("task_completed", "Task Completed", result.title);
    audit.taskCompleted(id, result.title);
  }
  return result;
}

export async function addSuggestedTask(suggested: { title: string; description: string; priority: string; explanation?: string }, businessId?: string): Promise<ComplianceTaskItem> {
  return createTask(
    { title: suggested.title, description: suggested.description, priority: suggested.priority as any },
    businessId
  );
}

export function reconcileTaskStatuses(): void {
  const tasks = loadLocal();
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
  if (changed) saveLocal(tasks);
  syncDeadlineNotifications();
}
