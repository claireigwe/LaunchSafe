import type { ComplianceTaskItem, CreateTaskInput, UpdateTaskInput, TaskSource } from "../types/tasks.types";
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
    const res = await fetch(url + (url.includes('?') ? '&' : '?') + 't=' + Date.now(), { cache: 'no-store' });
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
  try { return crypto.randomUUID(); } catch { return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }
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
let lastLocalMutation: number = Date.now();

function triggerSync(): void {
  if (syncPromise) return;
  const businessId = getActiveBusinessId();
  if (!businessId) return;
  const startTime = Date.now();
  syncPromise = (async () => {
    try {
      const server = await apiGet<ComplianceTaskItem[]>(`/api/compliance?businessId=${businessId}`);
      if (server) {
        const local = loadLocal(businessId);
        if (lastLocalMutation < startTime && server.length >= local.length) {
          saveLocal(server, businessId);
        } else if (server.length < local.length) {
          console.log("[LaunchSafe] triggerSync: server has fewer tasks than local, skipping overwrite", { serverCount: server.length, localCount: local.length });
        }
      }
    } catch {} finally {
      syncPromise = null;
    }
  })();
}

const OLD_TASKS_KEY = "launchsafe-tasks";

export function loadTasks(): ComplianceTaskItem[] {
  triggerSync();

  const businessId = getActiveBusinessId();
  const tasks = loadLocal(businessId || undefined);

  if (tasks.length === 0 && businessId) {
    try {
      const oldRaw = localStorage.getItem(OLD_TASKS_KEY);
      if (oldRaw) {
        const oldTasks: ComplianceTaskItem[] = JSON.parse(oldRaw);
        if (oldTasks.length > 0) {
          const migrated = oldTasks.map((t) => ({ ...t, businessId }));
          saveLocal(migrated, businessId || undefined);
          try { localStorage.removeItem(OLD_TASKS_KEY); } catch {}
          return migrated;
        }
      }
    } catch {}
  }

  console.log("[LaunchSafe] loadTasks returning", { count: tasks.length, businessId });
  return tasks;
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

export async function createTask(input: CreateTaskInput & { source?: TaskSource; suggestionReason?: string | null }, businessId?: string): Promise<ComplianceTaskItem> {
  const bid = businessId || getActiveBusinessId() || "";
  const now = new Date().toISOString();
  const taskId = genId();
  const localTask: ComplianceTaskItem = {
    id: taskId,
    businessId: bid,
    title: input.title,
    description: input.description || "",
    dueDate: input.dueDate || null,
    priority: input.priority,
    status: computeInitialStatus(input.dueDate),
    source: input.source || "manual",
    suggestionReason: input.suggestionReason ?? null,
    reminderDate: null,
    reminderEnabled: false,
    createdBy: "user",
    createdAt: now,
    updatedAt: now,
  };

  const server = await apiPost<ComplianceTaskItem>("/api/compliance", { ...input, businessId: bid, id: taskId, source: input.source || "manual", suggestionReason: input.suggestionReason ?? null });
  if (server) {
    lastLocalMutation = Date.now();
    const tasks = loadLocal();
    tasks.push(server);
    saveLocal(tasks);
    console.log("[LaunchSafe] createTask: server success", { taskTitle: server.title, totalTasks: tasks.length, bid });
    triggerTaskCreated(server);
    logActivity("task_created", "New Task Created", server.title);
    return server;
  }

  console.log("[LaunchSafe] createTask: POST failed, saving locally", { taskTitle: localTask.title, bid });
  lastLocalMutation = Date.now();
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
    lastLocalMutation = Date.now();
    const tasks = loadLocal();
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx >= 0) tasks[idx] = server;
    else tasks.push(server);
    saveLocal(tasks);
    return server;
  }

  lastLocalMutation = Date.now();
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
  lastLocalMutation = Date.now();
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
    { title: suggested.title, description: suggested.description, priority: suggested.priority as any, source: "suggested", suggestionReason: suggested.explanation || null },
    businessId
  );
}

export async function reconcileTaskStatuses(): Promise<void> {
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
  if (changed) {
    lastLocalMutation = Date.now();
    saveLocal(tasks);
  }
  syncDeadlineNotifications().catch(() => {});
}
