import type { SubscriptionStatus } from "@/types/domain/billing";

export interface SavedSubscription {
  planId: string;
  planName: string;
  billingCycle: "monthly" | "annual";
  status: SubscriptionStatus;
  startDate: string;
  nextRenewal: string;
  cancelledAt: string | null;
  pendingPlanId: string | null;
  pendingPlanName: string | null;
  pendingBillingCycle: "monthly" | "annual" | null;
  paystackSubscriptionCode?: string | null;
}

export interface SavedPayment {
  id: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed" | "refunded";
  paymentType: "subscription" | "assessment";
  reference: string;
  description: string;
  createdAt: string;
}

export interface SavedAssessmentPurchase {
  id: string;
  reportName: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  createdAt: string;
}

let cachedBillingData: {
  subscription: SavedSubscription | null;
  payments: SavedPayment[];
  purchases: SavedAssessmentPurchase[];
} | null = null;

async function apiGet<T>(url: string): Promise<T | null> {
  try { const r = await fetch(url); const j = await r.json(); return j.success ? j.data : null; } catch { return null; }
}

async function apiPatch(url: string, body: any): Promise<boolean> {
  try { const r = await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const j = await r.json(); return j.success; } catch { return false; }
}

export async function getBillingData(): Promise<{
  subscription: SavedSubscription | null;
  payments: SavedPayment[];
  purchases: SavedAssessmentPurchase[];
}> {
  if (cachedBillingData) return cachedBillingData;
  const data = await apiGet<{
    subscription: SavedSubscription | null;
    payments: SavedPayment[];
    purchases: SavedAssessmentPurchase[];
  }>("/api/billing/data");
  cachedBillingData = data ?? { subscription: null, payments: [], purchases: [] };
  return cachedBillingData;
}

export async function getSubscription(): Promise<SavedSubscription | null> {
  const { subscription } = await getBillingData();
  return subscription;
}

export async function getPayments(): Promise<SavedPayment[]> {
  const { payments } = await getBillingData();
  return [...payments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAssessmentPurchases(): Promise<SavedAssessmentPurchase[]> {
  const { purchases } = await getBillingData();
  return [...purchases].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function cancelSubscription(): Promise<void> {
  await apiPatch("/api/billing/subscription", { action: "cancel" });
  cachedBillingData = null;
}

export async function schedulePlanChange(planId: string, planName: string, billingCycle: "monthly" | "annual"): Promise<void> {
  await apiPatch("/api/billing/subscription", { action: "schedule_change", planId, planName, billingCycle });
}

export async function clearPendingChange(): Promise<void> {
  await apiPatch("/api/billing/subscription", { action: "clear_pending" });
}

const PLAN_FEATURES: Record<string, string[]> = {
  starter: ["1 Business", "Compliance Dashboard", "Compliance Calendar", "Notifications & Reminders", "Document Management", "Task Management"],
  growth: ["Up to 5 Businesses", "Compliance Dashboard", "Compliance Calendar", "Notifications & Reminders", "Document Management", "Task Management", "Multi-Business Management", "Advanced Reporting"],
  enterprise: ["Up to 20 Businesses", "Compliance Dashboard", "Compliance Calendar", "Notifications & Reminders", "Document Management", "Task Management", "Multi-Business Management", "Advanced Reporting", "Team Collaboration", "Priority Support", "AI Compliance Assistant"],
};

export function getPlanFeatures(planId: string): string[] { return PLAN_FEATURES[planId] || PLAN_FEATURES.starter; }

export function getPlanPrice(planId: string, isAnnual: boolean): number {
  const prices: Record<string, { m: number; a: number }> = { starter: { m: 10000, a: 8500 }, growth: { m: 20000, a: 18000 } };
  const p = prices[planId]; return p ? (isAnnual ? p.a : p.m) : 0;
}

export function getPlanAnnualTotal(planId: string): number { return getPlanPrice(planId, true) * 12; }

export function formatCurrency(amount: number): string { return `₦${amount.toLocaleString("en-US")}`; }
