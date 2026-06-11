const INTENT_KEY = "launchsafe-intent";
const BUSINESS_DATA_KEY = "launchsafe-business-data";
const ALL_BIZ_KEY = "launchsafe-all-businesses";

import { audit } from "@/features/audit/api/audit-api";

/* ----- API helpers ----- */
async function apiGet<T>(url: string): Promise<T | null> {
  try {
    const cacheBuster = url.includes("?") ? `&t=${Date.now()}` : `?t=${Date.now()}`;
    const res = await fetch(url + cacheBuster, { cache: "no-store" });
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

/* ----- Per-business data storage ----- */
function businessDataKey(id: string): string {
  return `launchsafe-business-data-${id}`;
}

export function saveBusinessDataForBusiness(id: string, data: Record<string, unknown>): void {
  try { localStorage.setItem(businessDataKey(id), JSON.stringify(data)); } catch {}
}

export function getBusinessDataById(id: string): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(businessDataKey(id));
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
  fullData?: any;
}

export function loadCachedBusinesses(): StoredBusiness[] {
  try {
    const raw = localStorage.getItem(ALL_BIZ_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function cacheBusinesses(list: StoredBusiness[]): void {
  try { localStorage.setItem(ALL_BIZ_KEY, JSON.stringify(list)); } catch {}
}

export async function fetchAllBusinesses(): Promise<StoredBusiness[]> {
  try {
    const data: any[] | null = await apiGet("/api/businesses");
    if (data) {
      const mapped = data.map((b) => {
        let type = "";
        let state = "";
        let industry = "";
        let fullData: any = null;
        try {
          if (b.description) {
            const parsed = JSON.parse(b.description);
            type = parsed.type || "";
            state = parsed.state || "";
            industry = parsed.industry || "";
            fullData = parsed.fullData || null;
          }
        } catch {}
        return {
          id: b.id,
          name: b.name,
          industry: industry,
          type: type,
          state: state,
          createdAt: b.createdAt,
          fullData: fullData,
        };
      });
      cacheBusinesses(mapped);
      return mapped;
    }
    return loadCachedBusinesses();
  } catch {
    return loadCachedBusinesses();
  }
}

export async function addBusiness(data: Record<string, unknown>): Promise<StoredBusiness> {
  const info: any = data.info || {};
  const name = info.businessName || "Unnamed Business";

  const ops: any = data.operations || {};
  const st: any = data.status || {};
  const res = await fetch("/api/businesses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      description: JSON.stringify({ industry: info.industry || "", type: info.businessType || "", state: info.state || "", fullData: data }),
      industrySlug: info.industry || "",
      stateSlug: info.state || "",
      website: info.website || null,
      employeeCount: ops.employeeCount || null,
      details: {
        businessType: info.businessType || "",
        isRegistered: st.isRegistered ?? null,
        hasCAC: st.hasCAC ?? null,
        cacNumber: st.cacNumber || null,
        hasPhysicalLocation: ops.hasPhysicalLocation ?? null,
        hasOnlineOperations: ops.hasOnlineOperations ?? null,
      },
    }),
  });
  const json = await res.json();

  if (!json.success) {
    const err = new Error(json.error?.message || "Failed to create business") as any;
    err.code = json.error?.code;
    err.status = res.status;
    throw err;
  }

  const result = json.data;
  const biz: StoredBusiness = {
    id: result.id,
    name: result.name,
    industry: info.industry || "",
    type: info.businessType || "",
    state: info.state || "",
    createdAt: new Date().toISOString(),
  };

  saveBusinessDataForBusiness(biz.id, data);
  audit.businessCreated(biz.id, biz.name);
  return biz;
}

export async function removeBusiness(id: string): Promise<void> {
  try { localStorage.removeItem(`launchsafe-business-data-${id}`); } catch {}
  try {
    const activeId = localStorage.getItem("launchsafe-active-business");
    if (activeId === id) localStorage.removeItem("launchsafe-active-business");
  } catch {}
  await apiDelete(`/api/businesses/${id}`);
}

export async function getBusinessCount(): Promise<number> {
  const all = await fetchAllBusinesses();
  return all.length;
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
