export type FeatureFlag =
  | "multi_business"
  | "advanced_reporting"
  | "team_collaboration"
  | "priority_support";

export interface AccessInfo {
  planId: string;
  planName: string;
  features: FeatureFlag[];
  limits: Record<string, number>;
  status: string | null;
}

const DB_TO_PLAN: Record<string, string> = {
  free: "starter",
  pro: "starter",
  business: "starter",
  enterprise: "enterprise",
};

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
