import { getSubscription } from "./billing-api";

export type FeatureFlag =
  | "multi_business"
  | "advanced_reporting"
  | "team_collaboration"
  | "priority_support";

const PLAN_FEATURES: Record<string, FeatureFlag[]> = {
  starter: [],
  growth: ["multi_business", "advanced_reporting"],
  enterprise: ["multi_business", "advanced_reporting", "team_collaboration", "priority_support"],
};

const PLAN_LIMITS: Record<string, Record<string, number>> = {
  starter: { businesses: 1 },
  growth: { businesses: 5 },
  enterprise: { businesses: 20 },
};

export function canAccess(feature: FeatureFlag): boolean {
  const sub = getSubscription();
  if (!sub) return false;
  const features = PLAN_FEATURES[sub.planId];
  if (!features) return false;
  return features.includes(feature);
}

export function getPlanLimit(key: string): number {
  const sub = getSubscription();
  if (!sub) return 0;
  return PLAN_LIMITS[sub.planId]?.[key] ?? 0;
}

export function getCurrentPlanId(): string {
  return getSubscription()?.planId || "starter";
}

export function getCurrentPlanName(): string {
  return getSubscription()?.planName || "Starter";
}
