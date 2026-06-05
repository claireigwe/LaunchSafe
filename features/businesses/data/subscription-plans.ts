export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  annualTotal: number;
  description: string;
  bestFor: string[];
  features: PlanFeature[];
  badge?: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 10000,
    annualPrice: 8500,
    annualTotal: 102000,
    description: "For single businesses getting started with compliance management.",
    bestFor: ["Small businesses", "Solo founders", "Early-stage companies"],
    features: [
      { text: "1 Business", included: true },
      { text: "Compliance Dashboard", included: true },
      { text: "Compliance Calendar", included: true },
      { text: "Notifications & Reminders", included: true },
      { text: "Regulatory Updates", included: true },
      { text: "Multi-Business Management", included: false },
      { text: "Advanced Reporting", included: false },
      { text: "Team Collaboration", included: false },
      { text: "Priority Support", included: false },
    ],
  },
  {
    id: "growth",
    name: "Growth",
    monthlyPrice: 20000,
    annualPrice: 18000,
    annualTotal: 216000,
    description: "For growing businesses managing multiple entities.",
    badge: "Most Popular",
    bestFor: ["Growing businesses", "Agencies", "Multi-business operators"],
    features: [
      { text: "Up to 5 Businesses", included: true },
      { text: "Compliance Dashboard", included: true },
      { text: "Compliance Calendar", included: true },
      { text: "Notifications & Reminders", included: true },
      { text: "Regulatory Updates", included: true },
      { text: "Multi-Business Management", included: true },
      { text: "Advanced Reporting", included: true },
      { text: "Team Collaboration", included: false },
      { text: "Priority Support", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthlyPrice: 35000,
    annualPrice: 32000,
    annualTotal: 384000,
    description: "For organizations needing advanced collaboration and support.",
    bestFor: ["Larger organizations", "Compliance teams", "Business groups"],
    features: [
      { text: "Up to 20 Businesses", included: true },
      { text: "Compliance Dashboard", included: true },
      { text: "Compliance Calendar", included: true },
      { text: "Notifications & Reminders", included: true },
      { text: "Regulatory Updates", included: true },
      { text: "Multi-Business Management", included: true },
      { text: "Advanced Reporting", included: true },
      { text: "Team Collaboration", included: true },
      { text: "Priority Support", included: true },
    ],
  },
];

export function getPlanById(id: string): SubscriptionPlan | undefined {
  return SUBSCRIPTION_PLANS.find((p) => p.id === id);
}
