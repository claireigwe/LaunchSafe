import { INDUSTRIES } from "../data/industries";

export interface IndustryOption {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

const STATIC_INDUSTRIES: IndustryOption[] = INDUSTRIES.map((i) => ({
  id: i.id,
  name: i.name,
  slug: i.id,
  description: i.description,
}));

export function getIndustries(): IndustryOption[] {
  return STATIC_INDUSTRIES;
}

/** @deprecated Use getIndustries() instead — both are synchronous now. */
export function getIndustriesSync(): IndustryOption[] {
  return getIndustries();
}
