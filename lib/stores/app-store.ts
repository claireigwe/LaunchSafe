import { create } from "zustand";

const ACTIVE_BIZ_KEY = "launchsafe-active-business";

function loadActiveBusinessId(): string | null {
  try {
    const stored = localStorage.getItem(ACTIVE_BIZ_KEY);
    if (stored) return stored;
    return null;
  } catch { return null; }
}

function saveActiveBusinessId(id: string | null): void {
  try {
    if (id) localStorage.setItem(ACTIVE_BIZ_KEY, id);
    else localStorage.removeItem(ACTIVE_BIZ_KEY);
  } catch {}
}

function syncToServer(id: string | null): void {
  try {
    fetch("/api/user/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ preferredBusinessId: id }),
    }).catch(() => {});
  } catch {}
}

export function getActiveBusinessId(): string | null {
  return loadActiveBusinessId();
}

export async function fetchPreferredBusiness(): Promise<string | null> {
  try {
    const res = await fetch("/api/user/preferences");
    const json = await res.json();
    if (json.success && json.data?.preferredBusinessId) {
      saveActiveBusinessId(json.data.preferredBusinessId);
      return json.data.preferredBusinessId;
    }
    return null;
  } catch { return null; }
}

interface AppState {
  activeBusinessId: string | null;
  setActiveBusinessId: (id: string | null) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  taskFilter: string;
  setTaskFilter: (v: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeBusinessId: loadActiveBusinessId(),
  setActiveBusinessId: (id) => {
    saveActiveBusinessId(id);
    syncToServer(id);
    set({ activeBusinessId: id });
  },
  sidebarCollapsed: false,
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  taskFilter: "all",
  setTaskFilter: (v) => set({ taskFilter: v }),
}));
