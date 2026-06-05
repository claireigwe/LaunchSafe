export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface BusinessInfoData {
  businessName: string;
  industry: string;
  businessType: string;
  state: string;
  website: string;
  description: string;
}

export interface BusinessStatusData {
  isRegistered: boolean | null;
  hasCAC: boolean | null;
  cacNumber: string;
}

export interface BusinessOperationsData {
  employeeCount: string;
  hasPhysicalLocation: boolean | null;
  hasOnlineOperations: boolean | null;
  hasCustomerLocation: boolean | null;
}

export interface OnboardingData {
  info: BusinessInfoData;
  status: BusinessStatusData;
  operations: BusinessOperationsData;
}

export const ONBOARDING_STEPS = [
  { key: 1, label: "Business Information" },
  { key: 2, label: "Registration Status" },
  { key: 3, label: "Business Operations" },
];

export function createEmptyOnboardingData(): OnboardingData {
  return {
    info: { businessName: "", industry: "", businessType: "", state: "", website: "", description: "" },
    status: { isRegistered: null, hasCAC: null, cacNumber: "" },
    operations: { employeeCount: "", hasPhysicalLocation: null, hasOnlineOperations: null, hasCustomerLocation: null },
  };
}
