export type BusinessStage = "idea" | "planning" | "launching" | "existing";

export interface BusinessBasicsData {
  businessName: string;
  businessType: string;
  industry: string;
  subIndustry: string;
  businessStage: BusinessStage | "";
}

export interface BusinessActivitiesData {
  productsServices: string;
  willManufacture: boolean | null;
  willImport: boolean | null;
  willExport: boolean | null;
  willOperateOnline: boolean | null;
  hasPhysicalLocation: boolean | null;
}

export interface LocationOperationsData {
  country: string;
  state: string;
  lga: string;
  city: string;
  customersVisitLocation: boolean | null;
  requiresInspections: boolean | null;
  handlesRegulatedGoods: boolean | null;
}

export interface TeamStaffingData {
  employeeCount: string;
  hireImmediately: boolean | null;
  useContractors: boolean | null;
}

export interface IndustryQuestionsData {
  industryAnswers: Record<string, boolean | null>;
}

export interface WizardData {
  basics: BusinessBasicsData;
  activities: BusinessActivitiesData;
  location: LocationOperationsData;
  team: TeamStaffingData;
  industryQuestions: IndustryQuestionsData;
}

export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6 | "processing" | "summary";

export const WIZARD_STEPS: { key: WizardStep; label: string }[] = [
  { key: 1, label: "Business Basics" },
  { key: 2, label: "Industry & Sub-Industry" },
  { key: 3, label: "Business Activities" },
  { key: 4, label: "Location & Operations" },
  { key: 5, label: "Team & Staffing" },
  { key: 6, label: "Industry Details" },
];

export function createEmptyWizardData(): WizardData {
  return {
    basics: {
      businessName: "",
      businessType: "",
      industry: "",
      subIndustry: "",
      businessStage: "",
    },
    activities: {
      productsServices: "",
      willManufacture: null,
      willImport: null,
      willExport: null,
      willOperateOnline: null,
      hasPhysicalLocation: null,
    },
    location: {
      country: "",
      state: "",
      lga: "",
      city: "",
      customersVisitLocation: null,
      requiresInspections: null,
      handlesRegulatedGoods: null,
    },
    team: {
      employeeCount: "",
      hireImmediately: null,
      useContractors: null,
    },
    industryQuestions: {
      industryAnswers: {},
    },
  };
}
