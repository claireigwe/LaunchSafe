import type { FeatureFlag, AccessInfo } from "@/lib/billing/features";

let cachedAccess: AccessInfo | null = null;
let refreshPromise: Promise<AccessInfo | null> | null = null;

async function fetchAccess(): Promise<AccessInfo | null> {
  try {
    const res = await fetch("/api/billing/access");
    const json = await res.json();
    if (json.success && json.data) return json.data as AccessInfo;
    return null;
  } catch {
    return null;
  }
}

export async function refreshAccess(): Promise<AccessInfo | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    const server = await fetchAccess();
    if (server) {
      cachedAccess = server;
    }
    refreshPromise = null;
    return cachedAccess;
  })();
  return refreshPromise;
}

export function getAccess(): AccessInfo | null {
  return cachedAccess;
}

export function canAccess(feature: FeatureFlag): boolean {
  return cachedAccess?.features.includes(feature) ?? false;
}

export function getPlanLimit(key: string): number {
  return cachedAccess?.limits[key] ?? 0;
}

export function getCurrentPlanId(): string | null {
  return cachedAccess?.planId ?? null;
}

export function getCurrentPlanName(): string {
  return cachedAccess?.planName ?? "No Plan";
}
