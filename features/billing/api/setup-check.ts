import { getBusinessData } from "@/features/businesses/api/onboarding-api";
import { getAccess } from "./feature-access";

export function isInSetupMode(): boolean {
  try {
    const biz = getBusinessData() as any;
    if (biz?.info?.businessName) return false;

    const access = getAccess();
    if (access?.planId) return false;

    const hasAssessment = localStorage.getItem("launchsafe-assessment-summary");
    if (hasAssessment) return false;

    return true;
  } catch {
    return true;
  }
}
