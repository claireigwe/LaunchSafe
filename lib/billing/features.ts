export type FeatureFlag =
  | "multi_business"
  | "advanced_reporting"
  | "team_collaboration"
  | "priority_support"
  | "ai_compliance";

export interface AccessInfo {
  planId: string;
  planName: string;
  features: FeatureFlag[];
  limits: Record<string, number>;
  status: string | null;
}

export const DB_TO_PLAN: Record<string, string> = {
  free: "starter",
  starter: "starter",
  growth: "growth",
  pro: "growth", // Legacy mapping if any
  business: "growth", // Legacy mapping if any
  enterprise: "enterprise",
};

export const PLAN_TO_DB: Record<string, string> = {
  starter: "free",
  growth: "pro",
  enterprise: "enterprise",
};

const PLAN_FEATURES: Record<string, FeatureFlag[]> = {
  starter: [],
  growth: ["multi_business", "advanced_reporting"],
  enterprise: ["multi_business", "advanced_reporting", "team_collaboration", "priority_support", "ai_compliance"],
};

const PLAN_LIMITS: Record<string, Record<string, number>> = {
  starter: { businesses: 1, documents: 2 },
  growth: { businesses: 5, documents: 15 },
  enterprise: { businesses: 20, documents: 100 },
};

export function resolveAccess(planSlug: string | null, planStatus: string | null): AccessInfo {
  const planId = (planSlug && DB_TO_PLAN[planSlug]) || "starter";
  return {
    planId,
    planName: planId === "starter" ? "Starter" : planId === "growth" ? "Growth" : "Enterprise",
    features: PLAN_FEATURES[planId] || [],
    limits: PLAN_LIMITS[planId] || { businesses: 1 },
    status: planStatus,
  };
}
