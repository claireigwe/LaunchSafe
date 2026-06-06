import type { SubscriptionStatus } from "@/types/domain/billing";

const SUB_KEY = "launchsafe-subscription";
const PAYMENTS_KEY = "launchsafe-payments";
const ASSESSMENT_PURCHASES_KEY = "launchsafe-assessment-purchases";

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

async function apiGet<T>(url: string): Promise<T | null> {
  try { const r = await fetch(url); const j = await r.json(); return j.success ? j.data : null; } catch { return null; }
}

async function apiPatch(url: string, body: any): Promise<boolean> {
  try { const r = await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const j = await r.json(); return j.success; } catch { return false; }
}

function loadSub(): SavedSubscription | null {
  try { const r = localStorage.getItem(SUB_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}
function saveSub(s: SavedSubscription) { try { localStorage.setItem(SUB_KEY, JSON.stringify(s)); } catch {} }

function loadPayments(): SavedPayment[] {
  try { const r = localStorage.getItem(PAYMENTS_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}
function savePayments(p: SavedPayment[]) { try { localStorage.setItem(PAYMENTS_KEY, JSON.stringify(p)); } catch {} }

function loadPurchases(): SavedAssessmentPurchase[] {
  try { const r = localStorage.getItem(ASSESSMENT_PURCHASES_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}
function savePurchases(p: SavedAssessmentPurchase[]) { try { localStorage.setItem(ASSESSMENT_PURCHASES_KEY, JSON.stringify(p)); } catch {} }

function genId(): string { return `inv-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`; }

export function getSubscription(): SavedSubscription | null {
  apiGet<{ subscription: SavedSubscription | null }>("/api/billing/data").then((d) => {
    if (d?.subscription) saveSub(d.subscription);
  }).catch(() => {});
  return loadSub();
}

export function saveSubscription(s: SavedSubscription): void {
  saveSub(s);
}

export function getPayments(): SavedPayment[] {
  apiGet<{ payments: SavedPayment[] }>("/api/billing/data").then((d) => {
    if (d?.payments) savePayments(d.payments);
  }).catch(() => {});
  return loadPayments().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getAssessmentPurchases(): SavedAssessmentPurchase[] {
  apiGet<{ purchases: SavedAssessmentPurchase[] }>("/api/billing/data").then((d) => {
    if (d?.purchases) savePurchases(d.purchases);
  }).catch(() => {});
  return loadPurchases().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function addPayment(p: Omit<SavedPayment, "id">): SavedPayment {
  const items = loadPayments();
  const payment: SavedPayment = { id: genId(), ...p };
  items.unshift(payment);
  savePayments(items);
  return payment;
}

export function addAssessmentPurchase(p: SavedAssessmentPurchase): void {
  const items = loadPurchases();
  items.unshift(p);
  savePurchases(items);
}

export async function cancelSubscription(): Promise<void> {
  await apiPatch("/api/billing/subscription", { action: "cancel" });
  const sub = loadSub();
  if (sub) {
    sub.status = "cancelled";
    sub.cancelledAt = new Date().toISOString();
    sub.pendingPlanId = null;
    sub.pendingPlanName = null;
    sub.pendingBillingCycle = null;
    saveSub(sub);
  }
}

export function schedulePlanChange(planId: string, planName: string, billingCycle: "monthly" | "annual"): void {
  const sub = loadSub();
  if (sub) {
    sub.pendingPlanId = planId;
    sub.pendingPlanName = planName;
    sub.pendingBillingCycle = billingCycle;
    saveSub(sub);
  }
}

export function clearPendingChange(): void {
  const sub = loadSub();
  if (sub) {
    sub.pendingPlanId = null;
    sub.pendingPlanName = null;
    sub.pendingBillingCycle = null;
    saveSub(sub);
  }
}

const PLAN_FEATURES: Record<string, string[]> = {
  starter: ["1 Business", "Compliance Dashboard", "Compliance Calendar", "Notifications & Reminders", "Document Management", "Task Management"],
  growth: ["Up to 5 Businesses", "Compliance Dashboard", "Compliance Calendar", "Notifications & Reminders", "Document Management", "Task Management", "Multi-Business Management", "Advanced Reporting"],
  enterprise: ["Up to 20 Businesses", "Compliance Dashboard", "Compliance Calendar", "Notifications & Reminders", "Document Management", "Task Management", "Multi-Business Management", "Advanced Reporting", "Team Collaboration", "Priority Support"],
};

export function getPlanFeatures(planId: string): string[] { return PLAN_FEATURES[planId] || PLAN_FEATURES.starter; }

export function getPlanPrice(planId: string, isAnnual: boolean): number {
  const prices: Record<string, { m: number; a: number }> = { starter: { m: 10000, a: 8500 }, growth: { m: 20000, a: 18000 }, enterprise: { m: 35000, a: 32000 } };
  const p = prices[planId]; return p ? (isAnnual ? p.a : p.m) : 0;
}

export function getPlanAnnualTotal(planId: string): number { return getPlanPrice(planId, true) * 12; }

export function formatCurrency(amount: number): string { return `₦${amount.toLocaleString("en-US")}`; }
