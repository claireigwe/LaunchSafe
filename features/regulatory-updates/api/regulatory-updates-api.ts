import { getBusinessData } from "@/features/businesses/api/onboarding-api";
import type { RegulatoryUpdate } from "@/types/domain/regulatory";

async function fetchUpdates(): Promise<RegulatoryUpdate[]> {
  try {
    const res = await fetch("/api/regulatory/updates");
    const json = await res.json();
    return json.success ? (json.data || []) : [];
  } catch {
    return [];
  }
}

export async function getRegulatoryUpdates(): Promise<RegulatoryUpdate[]> {
  const saved = getBusinessData() as any;
  const industry = saved?.info?.industry || "";

  const all = await fetchUpdates();

  return all
    .filter((u) => u.isPublished)
    .filter((u) => {
      if (!u.affectedIndustries || u.affectedIndustries.length === 0) return true;
      if (!industry) return true;
      return u.affectedIndustries.includes(industry);
    })
    .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
}


