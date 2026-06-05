import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { BusinessOnboardingWizard } from "@/features/businesses/components/business-onboarding-wizard";

export const metadata: Metadata = {
  title: "Add Your Business | LaunchSafe",
  description: "Set up your business compliance workspace.",
};

export default function BusinessOnboardingPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={<div style={{ padding: "100px 24px", textAlign: "center" }}>Loading...</div>}>
          <BusinessOnboardingWizard />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
