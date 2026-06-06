import { REGULATORY_UPDATES } from "../data/regulatory-updates-data";
import { getBusinessData } from "@/features/businesses/api/onboarding-api";
import type { RegulatoryUpdate } from "@/types/domain/regulatory";

export function getRegulatoryUpdates(): RegulatoryUpdate[] {
  const saved = getBusinessData() as any;
  const industry = saved?.info?.industry || "";

  return REGULATORY_UPDATES
    .filter((u) => u.isPublished)
    .filter((u) => {
      if (u.affectedIndustries.length === 0) return true;
      if (!industry) return true;
      return u.affectedIndustries.includes(industry);
    })
    .sort((a, b) => new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime());
}

export function getRegulatoryUpdate(id: string): RegulatoryUpdate | undefined {
  return REGULATORY_UPDATES.find((u) => u.id === id);
}
