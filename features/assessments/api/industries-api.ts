import { INDUSTRIES } from "../data/industries";

export interface IndustryOption {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

let cached: IndustryOption[] | null = null;

export async function getIndustries(): Promise<IndustryOption[]> {
  if (cached) return cached;
  try {
    const res = await fetch("/api/industries");
    const json = await res.json();
    if (json.success && json.data.length > 0) {
      cached = json.data;
      return json.data;
    }
  } catch {}
  return INDUSTRIES.map((i) => ({ id: i.id, name: i.name, slug: i.id, description: i.description }));
}

export function getIndustriesSync(): IndustryOption[] {
  if (cached) return cached;
  return INDUSTRIES.map((i) => ({ id: i.id, name: i.name, slug: i.id, description: i.description }));
}
