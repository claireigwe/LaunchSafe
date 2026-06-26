import type { SavedSubscription, SavedPayment, SavedAssessmentPurchase } from "@/types/domain/billing";
import { apiGet, apiPatch } from "@/lib/api/base";

export async function getBillingData(): Promise<{
  subscription: SavedSubscription | null;
  payments: SavedPayment[];
  purchases: SavedAssessmentPurchase[];
}> {
  const data = await apiGet<{
    subscription: SavedSubscription | null;
    payments: SavedPayment[];
    purchases: SavedAssessmentPurchase[];
  }>("/api/billing/data");
  return data ?? { subscription: null, payments: [], purchases: [] };
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
}

export function formatCurrency(amount: number): string { return `₦${amount.toLocaleString("en-US")}`; }
