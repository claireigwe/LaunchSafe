export type BusinessStage = "idea" | "planning" | "launching" | "existing";

export interface BusinessBasicsData {
  businessName: string;
  businessType: string;
  industry: string;
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

export type WizardStep = 1 | 2 | 3 | 4 | 5 | "processing" | "summary";

export const WIZARD_STEPS: { key: WizardStep; label: string }[] = [
  { key: 1, label: "Business Basics" },
  { key: 2, label: "Business Activities" },
  { key: 3, label: "Location & Operations" },
  { key: 4, label: "Team & Staffing" },
  { key: 5, label: "Industry Details" },
];

export function createEmptyWizardData(): WizardData {
  return {
    basics: {
      businessName: "",
      businessType: "",
      industry: "",
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
