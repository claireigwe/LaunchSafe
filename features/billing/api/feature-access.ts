import type { FeatureFlag, AccessInfo } from "@/lib/billing/features";
import { resolveAccess } from "@/lib/billing/features";
import { getSubscription } from "./billing-api";

let cachedAccess: AccessInfo | null = null;
let refreshPromise: Promise<AccessInfo | null> | null = null;

function ensureAccess(): AccessInfo {
  if (cachedAccess) return cachedAccess;
  if (typeof window === "undefined") return resolveAccess(null, null);
  const sub = getSubscription();
  if (sub?.planId) {
    cachedAccess = resolveAccess(sub.planId, sub.status);
    return cachedAccess;
  }
  return resolveAccess(null, null);
}

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

export function getAccess(): AccessInfo {
  return ensureAccess();
}

export async function refreshAccess(): Promise<AccessInfo | null> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    const server = await fetchAccess();
    if (server && server.planId !== "starter") {
      cachedAccess = server;
    } else if (!cachedAccess) {
      const sub = getSubscription();
      if (sub?.planId) {
        cachedAccess = resolveAccess(sub.planId, sub.status);
      } else if (server) {
        cachedAccess = server;
      }
    }
    refreshPromise = null;
    return cachedAccess;
  })();
  return refreshPromise;
}

export function canAccess(feature: FeatureFlag): boolean {
  const access = getAccess();
  return access.features.includes(feature);
}

export function getPlanLimit(key: string): number {
  const access = getAccess();
  return access.limits[key] ?? 0;
}

export function getCurrentPlanId(): string {
  return getAccess().planId;
}

export function getCurrentPlanName(): string {
  return getAccess().planName;
}
