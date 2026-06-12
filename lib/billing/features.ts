export type FeatureFlag =
  | "multi_business"
  | "advanced_reporting"
  | "team_collaboration"
  | "priority_support"
  | "ai_compliance";

export interface AccessInfo {
  planId: string | null;
  planName: string;
  features: FeatureFlag[];
  limits: Record<string, number>;
  status: string | null;
}

export const DB_TO_PLAN: Record<string, string> = {
  starter: "starter",
  growth: "growth",
  enterprise: "enterprise",
};

export const PLAN_TO_DB: Record<string, string> = {
  starter: "starter",
  growth: "growth",
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
  if (!planSlug || !DB_TO_PLAN[planSlug]) {
    return {
      planId: null,
      planName: "No Plan",
      features: [],
      limits: { businesses: 0, documents: 0 },
      status: null,
    };
  }
  const planId = DB_TO_PLAN[planSlug];
  const planName: Record<string, string> = {
    starter: "Starter",
    growth: "Growth",
    enterprise: "Enterprise",
  };
  return {
    planId,
    planName: planName[planId] || "Starter",
    features: PLAN_FEATURES[planId] || [],
    limits: PLAN_LIMITS[planId] || { businesses: 0 },
    status: planStatus,
  };
}
