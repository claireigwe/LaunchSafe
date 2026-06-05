const INTENT_KEY = "launchsafe-intent";
const BUSINESS_DATA_KEY = "launchsafe-business-data";

export function saveBusinessData(data: Record<string, unknown>): void {
  try {
    localStorage.setItem(BUSINESS_DATA_KEY, JSON.stringify(data));
  } catch {}
}

export function getBusinessData(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(BUSINESS_DATA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export type UserIntent = "existing_business" | "assessment" | null;

export function saveUserIntent(intent: UserIntent): void {
  try {
    localStorage.setItem(INTENT_KEY, JSON.stringify(intent));
  } catch {
  }
}

export function getUserIntent(): UserIntent {
  try {
    const raw = localStorage.getItem(INTENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearUserIntent(): void {
  try {
    localStorage.removeItem(INTENT_KEY);
  } catch {
  }
}

export async function initiateSubscriptionPayment(planId: string, billingCycle: "monthly" | "annual"): Promise<{ authorizationUrl: string }> {
  const res = await fetch("/api/billing/subscriptions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ planId, billingCycle }),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error.message);
  return json.data;
}
