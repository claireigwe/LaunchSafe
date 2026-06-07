import { getBusinessData } from "@/features/businesses/api/onboarding-api";
import { getSubscription } from "./billing-api";

export function isInSetupMode(): boolean {
  try {
    const biz = getBusinessData() as any;
    if (biz?.info?.businessName) return false;

    const sub = getSubscription();
    if (sub?.status === "active") return false;

    const hasAssessment = localStorage.getItem("launchsafe-assessment-summary");
    if (hasAssessment) return false;

    return true;
  } catch {
    return true;
  }
}
