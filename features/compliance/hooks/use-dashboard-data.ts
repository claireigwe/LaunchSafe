"use client";

import { useQuery } from "@tanstack/react-query";
import type { SavedSubscription } from "@/types/domain/billing";
import type { RegulatoryUpdate } from "@/types/domain/regulatory";

const CACHE_KEY = "launchsafe-dashboard";

export interface DashboardDataResponse {
  businesses: any[];
  profile: { fullName: string; jobTitle: string } | null;
  subscription: SavedSubscription | null;
  score: any;
  regulatoryUpdates: RegulatoryUpdate[];
  recentActivity: any[];
}

function loadCached(): DashboardDataResponse | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCached(data: DashboardDataResponse): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch {}
}

async function fetchDashboardData(): Promise<DashboardDataResponse> {
  const cached = loadCached();
  // Show cached data immediately, refresh in background
  if (cached) {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) saveCached(json.data);
      })
      .catch(() => {});
    return cached;
  }

  const res = await fetch("/api/dashboard");
  const json = await res.json();
  if (!json.success) throw new Error(json.error?.message || "Failed to load dashboard data");
  saveCached(json.data);
  return json.data;
}

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
    staleTime: 300_000,
    gcTime: 600_000,
  });
}
