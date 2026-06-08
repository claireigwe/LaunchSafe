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

export function getActiveBusinessId(): string | null {
  return loadActiveBusinessId();
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
    set({ activeBusinessId: id });
  },
  sidebarCollapsed: false,
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  taskFilter: "all",
  setTaskFilter: (v) => set({ taskFilter: v }),
}));
