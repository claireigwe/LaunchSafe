import type { SavedSubscription, SavedPayment, SavedAssessmentPurchase } from "@/types/domain/billing";
import { apiGet, apiPatch } from "@/lib/api/base";

let cachedBillingData: {
  subscription: SavedSubscription | null;
  payments: SavedPayment[];
  purchases: SavedAssessmentPurchase[];
} | null = null;

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
