import type { AssessmentSummary } from "@/types/domain/assessment";
import type { WizardData, BusinessStage } from "../types/wizard.types";
import { getIndustryById } from "./industries";
import { getCountryById, getStateById } from "./countries-data";

const BUSINESS_TYPE_MAP: Record<string, string> = {
  "food-beverage": "Food & Beverage Business",
  "health-pharma": "Healthcare Business",
  "technology-saas": "Technology Business",
  "retail-ecommerce": "Retail Business",
  manufacturing: "Manufacturing Business",
  agriculture: "Agricultural Business",
  education: "Education Business",
  "finance-fintech": "Financial Services Business",
  "real-estate-construction": "Real Estate & Construction Business",
  "professional-services": "Professional Services Firm",
  "transportation-logistics": "Transportation & Logistics Business",
  "energy-mining": "Energy & Mining Business",
  "fashion-apparel": "Fashion & Apparel Business",
};

const STAGE_MULTIPLIER: Record<BusinessStage, number> = {
  idea: 0.6,
  planning: 0.8,
  launching: 1.0,
  existing: 1.2,
};

function getActivityModifier(activities: WizardData["activities"]): number {
  let modifier = 0;
  if (activities.willManufacture) modifier += 3;
  if (activities.willImport) modifier += 2;
  if (activities.willExport) modifier += 2;
  if (activities.willOperateOnline) modifier += 1;
  if (activities.hasPhysicalLocation) modifier += 2;
  return modifier;
}

function getLocationModifier(location: WizardData["location"]): number {
  let modifier = 0;
  if (location.customersVisitLocation) modifier += 2;
  if (location.requiresInspections) modifier += 3;
  if (location.handlesRegulatedGoods) modifier += 3;
  return modifier;
}

function getTeamModifier(team: WizardData["team"]): number {
  let modifier = 0;
  const count = parseInt(team.employeeCount, 10);
  if (!isNaN(count)) {
    if (count > 50) modifier += 4;
    else if (count > 10) modifier += 2;
    else if (count > 0) modifier += 1;
  }
  if (team.hireImmediately) modifier += 1;
  if (team.useContractors) modifier += 1;
  return modifier;
}

function getUniqueCategories(
  industryCategories: string[],
  data: WizardData
): string[] {
  const categories = new Set(industryCategories);

  if (
    data.activities.willImport ||
    data.activities.willExport
  ) {
    categories.add("Import/Export Regulations");
  }

  if (data.activities.willOperateOnline || data.basics.industry === "technology-saas") {
    categories.add("Data Protection");
  }

  if (data.team.hireImmediately || parseInt(data.team.employeeCount, 10) > 0) {
    categories.add("Employment Compliance");
  }

  return Array.from(categories);
}

export function generateAssessmentSummary(data: WizardData): AssessmentSummary {
  const industry = getIndustryById(data.basics.industry);
  const country = getCountryById(data.location.country);
  const stateName = data.location.state
    ? getStateById(data.location.country, data.location.state)
    : undefined;

  if (!industry || !country) {
    return {
      businessType: data.basics.businessType || "Business",
      location: data.location.country
        ? `${stateName ? stateName + ", " : ""}${country?.name || data.location.country}`
        : "Location not specified",
      requirementCount: 0,
      agencyCount: 0,
      complexityScore: 0,
      categories: [],
    };
  }

  const stage = data.basics.businessStage as BusinessStage;
  const stageMult = STAGE_MULTIPLIER[stage] || 1;

  const activityMod = getActivityModifier(data.activities);
  const locationMod = getLocationModifier(data.location);
  const teamMod = getTeamModifier(data.team);

  const totalModifier = activityMod + locationMod + teamMod;
  const requirementCount = Math.round(
    (industry.baseRequirementCount + totalModifier) * stageMult
  );
  const agencyCount = Math.round(
    (industry.baseAgencyCount + Math.floor(totalModifier / 3)) * stageMult
  );

  // Use the same scoring formula as the assessment engine.
  // Engine formula: 20 + requirements.length * 2 + activity bonuses, clamped to [5, 100]
  let complexityScore = 20 + requirementCount * 2;
  if (data.activities.willManufacture) complexityScore += 10;
  if (data.activities.willImport) complexityScore += 8;
  if (data.activities.willExport) complexityScore += 8;
  complexityScore = Math.min(100, Math.max(5, complexityScore));

  const categories = getUniqueCategories(industry.categories, data);

  return {
    businessType: BUSINESS_TYPE_MAP[data.basics.industry] || data.basics.businessType || "Business",
    location: `${stateName ? stateName + ", " : ""}${country.name}`,
    requirementCount: Math.max(1, requirementCount),
    agencyCount: Math.max(1, agencyCount),
    complexityScore,
    categories,
  };
}

export function getComplexityLabel(score: number): "Low" | "Medium" | "High" {
  if (score <= 33) return "Low";
  if (score <= 66) return "Medium";
  return "High";
}

export function getComplexityColor(score: number): string {
  if (score <= 33) return "var(--color-key-success)";
  if (score <= 66) return "var(--color-key-warning)";
  return "var(--color-key-error)";
}
