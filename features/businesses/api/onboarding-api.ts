const INTENT_KEY = "launchsafe-intent";
const BUSINESS_DATA_KEY = "launchsafe-business-data";
const ALL_BUSINESSES_KEY = "launchsafe-all-businesses";

/* ----- API helpers ----- */
async function apiGet<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    const json = await res.json();
    return json.success ? json.data : null;
  } catch { return null; }
}

async function apiPost<T>(url: string, body: any): Promise<T | null> {
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json();
    return json.success ? json.data : null;
  } catch { return null; }
}

async function apiPatch<T>(url: string, body: any): Promise<T | null> {
  try {
    const res = await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json();
    return json.success ? json.data : null;
  } catch { return null; }
}

async function apiDelete(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "DELETE" });
    return res.ok;
  } catch { return false; }
}

/* ----- Single business (backward compat) ----- */
export function saveBusinessData(data: Record<string, unknown>): void {
  try { localStorage.setItem(BUSINESS_DATA_KEY, JSON.stringify(data)); } catch {}
}

export function getBusinessData(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(BUSINESS_DATA_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

/* ----- Multi-business support ----- */
export interface StoredBusiness {
  id: string;
  name: string;
  industry: string;
  type: string;
  state: string;
  createdAt: string;
}

export function getAllBusinesses(): StoredBusiness[] {
  try {
    const raw = localStorage.getItem(ALL_BUSINESSES_KEY);
    if (raw) return JSON.parse(raw);
    const single: any = getBusinessData();
    if (single?.info?.businessName) {
      const biz: StoredBusiness = {
        id: `biz-migrated`,
        name: single.info.businessName,
        industry: single.info.industry || "",
        type: single.info.businessType || "",
        state: single.info.state || "",
        createdAt: single._savedAt || new Date().toISOString(),
      };
      try { localStorage.setItem(ALL_BUSINESSES_KEY, JSON.stringify([biz])); } catch {}
      return [biz];
    }
    return [];
  } catch { return []; }
}

export async function addBusiness(data: Record<string, unknown>): Promise<StoredBusiness | null> {
  const all = getAllBusinesses();
  const info: any = data.info || {};
  const name = info.businessName || "Unnamed Business";

  if (all.some((b) => b.name === name)) return null;

  const biz: StoredBusiness = {
    id: `biz-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    name,
    industry: info.industry || "",
    type: info.businessType || "",
    state: info.state || "",
    createdAt: new Date().toISOString(),
  };

  all.push(biz);
  try { localStorage.setItem(ALL_BUSINESSES_KEY, JSON.stringify(all)); } catch {}
  saveBusinessData(data);

  await apiPost("/api/businesses", {
    name: biz.name,
    description: JSON.stringify({ industry: biz.industry, type: biz.type, state: biz.state, fullData: data }),
  });

  return biz;
}

export async function removeBusiness(id: string): Promise<void> {
  const all = getAllBusinesses().filter((b) => b.id !== id);
  try { localStorage.setItem(ALL_BUSINESSES_KEY, JSON.stringify(all)); } catch {}
  await apiDelete(`/api/businesses/${id}`);
}

export function getBusinessCount(): number {
  return getAllBusinesses().length;
}

/* ----- User intent ----- */
export type UserIntent = "existing_business" | "assessment" | null;

export function saveUserIntent(intent: UserIntent): void {
  try { localStorage.setItem(INTENT_KEY, JSON.stringify(intent)); } catch {} }

export function getUserIntent(): UserIntent {
  try { const raw = localStorage.getItem(INTENT_KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
}

export function clearUserIntent(): void {
  try { localStorage.removeItem(INTENT_KEY); } catch {} }

/* ----- Payment ----- */
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
