import { createAdminClient } from "@/lib/supabase/server";

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

const PLAN_NAMES: Record<string, string> = {
  starter: "Starter",
  growth: "Growth",
  enterprise: "Enterprise",
};

const FEATURE_FLAG_MAP: Record<string, FeatureFlag> = {
  multi_business: "multi_business",
  advanced_reporting: "advanced_reporting",
  team_collaboration: "team_collaboration",
  priority_support: "priority_support",
  ai_compliance: "ai_compliance",
};

export async function resolveAccess(planSlug: string | null, planStatus: string | null): Promise<AccessInfo> {
  if (!planSlug) {
    return {
      planId: null,
      planName: "",
      features: [],
      limits: { businesses: 0, documents: 0 },
      status: null,
    };
  }

  // Use hardcoded plan configs as the primary source of truth
  const planId = planSlug;
  const features = PLAN_FEATURES[planId] || [];
  const limits = PLAN_LIMITS[planId] || { businesses: 0, documents: 0 };
  const planName = PLAN_NAMES[planId] || planId;

  return {
    planId,
    planName,
    features,
    limits,
    status: planStatus,
  };
}
