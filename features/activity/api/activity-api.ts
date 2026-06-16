const ACTIVITY_KEY = "launchsafe-activity";

export interface ActivityEntry {
  id: string;
  type: "task_created" | "task_completed" | "document_uploaded" | "subscription_activated" | "notification_triggered";
  title: string;
  description: string;
  timestamp: string;
}

function loadLocal(): ActivityEntry[] {
  try { const raw = localStorage.getItem(ACTIVITY_KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
}

function saveLocal(entries: ActivityEntry[]): void { try { localStorage.setItem(ACTIVITY_KEY, JSON.stringify(entries)); } catch {} }

function genId(): string { return `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`; }

import { apiGet } from "@/lib/api/base";

export async function getRecentActivity(limit = 5): Promise<ActivityEntry[]> {
  try {
    const server = await apiGet<ActivityEntry[]>("/api/activity");
    if (server) {
      saveLocal(server);
      return server.slice(0, limit);
    }
  } catch {}
  return loadLocal().slice(0, limit);
}

export function logActivity(
  type: ActivityEntry["type"],
  title: string,
  description: string
): void {
  const entries = loadLocal();
  entries.unshift({ id: genId(), type, title, description, timestamp: new Date().toISOString() });
  if (entries.length > 50) entries.length = 50;
  saveLocal(entries);
  fetch("/api/activity", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, title, description }) }).catch(() => {});
}
