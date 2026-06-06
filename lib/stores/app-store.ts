import { create } from "zustand";

interface AppState {
  activeBusinessId: string | null;
  setActiveBusinessId: (id: string | null) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  taskFilter: string;
  setTaskFilter: (v: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeBusinessId: null,
  setActiveBusinessId: (id) => set({ activeBusinessId: id }),
  sidebarCollapsed: false,
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  taskFilter: "all",
  setTaskFilter: (v) => set({ taskFilter: v }),
}));
