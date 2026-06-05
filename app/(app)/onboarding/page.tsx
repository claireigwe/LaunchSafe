import type { Metadata } from "next";
import { OnboardingSelection } from "@/features/onboarding/components/onboarding-selection/onboarding-selection";

export const metadata: Metadata = {
  title: "Get Started | LaunchSafe",
};

export default function OnboardingPage() {
  return <OnboardingSelection />;
}
