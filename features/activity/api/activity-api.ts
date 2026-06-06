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

async function apiGet<T>(url: string): Promise<T | null> {
  try { const r = await fetch(url); const j = await r.json(); return j.success ? j.data : null; } catch { return null; }
}

export function getRecentActivity(limit = 5): ActivityEntry[] {
  apiGet<ActivityEntry[]>("/api/activity").then((server) => {
    if (server) saveLocal(server);
  }).catch(() => {});
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
}
