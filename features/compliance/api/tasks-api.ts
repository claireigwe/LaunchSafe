import type { ComplianceTaskItem, CreateTaskInput, UpdateTaskInput, TaskSource } from "../types/tasks.types";
import { triggerTaskCreated, triggerTaskCompleted, triggerTaskOverdue } from "@/features/notifications/api/notification-triggers";
import { logActivity } from "@/features/activity/api/activity-api";
import { audit } from "@/features/audit/api/audit-api";
import { getActiveBusinessId } from "@/lib/stores/app-store";
import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api/base";

/* ----- Module-level cache (for synchronous reads by utilities) ----- */
let tasksCache: ComplianceTaskItem[] | null = null;
let cacheBusinessId: string | null = null;

/* ----- Server fetch ----- */

export async function refreshTasks(businessId?: string): Promise<ComplianceTaskItem[]> {
  const bid = businessId || getActiveBusinessId();
  if (!bid) return [];

  const server = await apiGet<ComplianceTaskItem[]>(`/api/compliance?businessId=${bid}`);
  if (server) {
    tasksCache = server;
    cacheBusinessId = bid;
    return server;
  }

  if (tasksCache && cacheBusinessId === bid) return tasksCache;
  return [];
}

/* ----- Synchronous read ----- */

export function loadTasks(): ComplianceTaskItem[] {
  const bid = getActiveBusinessId();

  if (tasksCache && cacheBusinessId === bid) {
    return tasksCache;
  }

  if (bid) {
    refreshTasks(bid).then((server) => {
      tasksCache = server;
      cacheBusinessId = bid;
    }).catch(() => {});
  }

  return tasksCache || [];
}

export async function ensureTasksSynced(): Promise<ComplianceTaskItem[]> {
  return refreshTasks();
}

/* ----- Mutations (server-first, cache managed by React Query) ----- */

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

  // Update in-memory cache for instant visibility
  if (tasksCache && cacheBusinessId === bid) {
    tasksCache = [server, ...tasksCache];
  }

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

  // Update in-memory cache for instant visibility
  if (tasksCache && json.data) {
    const idx = tasksCache.findIndex((t) => t.id === id);
    if (idx >= 0) {
      tasksCache = [...tasksCache];
      tasksCache[idx] = json.data;
    }
  }

  return json.data;
}

export async function deleteTask(id: string): Promise<void> {
  const businessId = getActiveBusinessId();
  const ok = await apiDelete("/api/compliance", { id, businessId });
  if (!ok) {
    throw new Error("Failed to delete task on server. Please try again.");
  }
  if (tasksCache) {
    tasksCache = tasksCache.filter((t) => t.id !== id);
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
    for (const t of updated) {
      if (t.status === "overdue") {
        await apiPatch("/api/compliance", { id: t.id, status: "overdue", businessId: bid });
        triggerTaskOverdue(t.title);
      }
    }
  }

  tasksCache = updated;
  cacheBusinessId = bid;
}
