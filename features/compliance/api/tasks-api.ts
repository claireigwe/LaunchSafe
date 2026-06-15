import type { ComplianceTaskItem, CreateTaskInput, UpdateTaskInput, TaskSource } from "../types/tasks.types";
import { triggerTaskCreated, triggerTaskCompleted, triggerTaskOverdue, syncDeadlineNotifications } from "@/features/notifications/api/notification-triggers";
import { logActivity } from "@/features/activity/api/activity-api";
import { audit } from "@/features/audit/api/audit-api";
import { getActiveBusinessId } from "@/lib/stores/app-store";

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
  } catch {
    return null;
  }
}

async function apiDelete(url: string, body: any): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json();
    return json.success;
  } catch { return false; }
}

/* ----- In-memory cache (source of truth for the session) ----- */
let tasksCache: ComplianceTaskItem[] | null = null;
let cacheBusinessId: string | null = null;

function cacheKey(businessId?: string): string {
  return `launchsafe-tasks-${businessId || getActiveBusinessId() || "default"}`;
}

function hydrateFromLocal(businessId?: string): ComplianceTaskItem[] {
  try {
    const raw = localStorage.getItem(cacheKey(businessId));
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function persistToLocal(tasks: ComplianceTaskItem[], businessId?: string): void {
  try { localStorage.setItem(cacheKey(businessId), JSON.stringify(tasks)); } catch {}
}

/* ----- Server fetch ----- */

export async function refreshTasks(businessId?: string): Promise<ComplianceTaskItem[]> {
  const bid = businessId || getActiveBusinessId();
  if (!bid) return [];

  const server = await apiGet<ComplianceTaskItem[]>(`/api/compliance?businessId=${bid}`);
  if (server) {
    tasksCache = server;
    cacheBusinessId = bid;
    persistToLocal(server, bid);
    return server;
  }

  // Server down — fall back to cache or localStorage
  if (tasksCache && cacheBusinessId === bid) return tasksCache;
  const local = hydrateFromLocal(bid);
  tasksCache = local;
  cacheBusinessId = bid;
  return local;
}

/* ----- Synchronous read (returns cached data, triggers background refresh) ----- */

export function loadTasks(): ComplianceTaskItem[] {
  const bid = getActiveBusinessId();

  // Return cache if it matches the current business
  if (tasksCache && cacheBusinessId === bid) {
    return tasksCache;
  }

  // Hydrate cache from localStorage
  const local = hydrateFromLocal(bid || undefined);
  tasksCache = local;
  cacheBusinessId = bid || null;

  // Trigger background server refresh
  if (bid) {
    refreshTasks(bid).then((server) => {
      tasksCache = server;
      cacheBusinessId = bid;
    }).catch(() => {});
  }

  return tasksCache;
}

export async function ensureTasksSynced(): Promise<ComplianceTaskItem[]> {
  return refreshTasks();
}

export function saveTasks(tasks: ComplianceTaskItem[], businessId?: string): void {
  tasksCache = tasks;
  cacheBusinessId = businessId || getActiveBusinessId() || null;
  persistToLocal(tasks, businessId);
}

/* ----- Mutations (server-first) ----- */

export async function createTask(input: CreateTaskInput & { source?: TaskSource; suggestionReason?: string | null }, businessId?: string): Promise<ComplianceTaskItem> {
  const bid = businessId || getActiveBusinessId() || "";

  const server = await apiPost<ComplianceTaskItem>("/api/compliance", {
    ...input,
    businessId: bid,
    source: input.source || "manual",
    suggestionReason: input.suggestionReason ?? null,
  });

  if (!server) {
    throw new Error("Failed to create task on server. Please try again.");
  }

  // Update cache
  const tasks = tasksCache && cacheBusinessId === bid ? [...tasksCache] : [];
  tasks.push(server);
  tasksCache = tasks;
  cacheBusinessId = bid;
  persistToLocal(tasks, bid);

  triggerTaskCreated(server);
  logActivity("task_created", "New Task Created", server.title);
  return server;
}

export async function updateTask(id: string, input: UpdateTaskInput): Promise<ComplianceTaskItem | null> {
  const businessId = getActiveBusinessId();

  const body = { id, ...input, businessId };
  const res = await fetch("/api/compliance", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error?.message || `Server error (${res.status})`);
  }
  const server = json.data;

  // Update cache
  if (tasksCache) {
    const idx = tasksCache.findIndex((t) => t.id === id);
    if (idx >= 0) {
      tasksCache = [...tasksCache];
      tasksCache[idx] = server;
    } else {
      tasksCache = [...tasksCache, server];
    }
    persistToLocal(tasksCache, businessId || undefined);
  }

  return server;
}

export async function deleteTask(id: string): Promise<void> {
  const businessId = getActiveBusinessId();
  const ok = await apiDelete("/api/compliance", { id, businessId });
  if (!ok) {
    throw new Error("Failed to delete task on server. Please try again.");
  }

  // Update cache
  if (tasksCache) {
    tasksCache = tasksCache.filter((t) => t.id !== id);
    persistToLocal(tasksCache, businessId || undefined);
  }
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
  const bid = getActiveBusinessId();
  if (!bid) return;

  // Fetch fresh data from server
  const server = await apiGet<ComplianceTaskItem[]>(`/api/compliance?businessId=${bid}`);
  if (!server) return;

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  let changed = false;
  const updated = server.map((t) => {
    if (t.status === "completed") return t;
    if (t.dueDate) {
      const due = new Date(t.dueDate);
      if (due < now && t.status !== "overdue") {
        changed = true;
        return { ...t, status: "overdue" as const, updatedAt: new Date().toISOString() };
      }
    }
    return t;
  });

  if (changed) {
    // Update each overdue task on the server
    for (const t of updated) {
      if (t.status === "overdue") {
        await apiPatch("/api/compliance", { id: t.id, status: "overdue", businessId: bid });
        triggerTaskOverdue(t.title);
      }
    }
  }

  tasksCache = updated;
  cacheBusinessId = bid;
  persistToLocal(updated, bid);
  syncDeadlineNotifications().catch(() => {});
}
