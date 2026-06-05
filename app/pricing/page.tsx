import { Metadata } from "next";
import { Footer } from "@/components/shared/footer/footer";
import { Header } from "@/components/shared/header/header";
import { PricingHero } from "@/features/pricing/components/pricing-hero";
import { TwoWays } from "@/features/pricing/components/two-ways";
import { AutopilotPlans } from "@/features/pricing/components/autopilot-plans";
import { AssessmentFlow } from "@/features/pricing/components/assessment-flow";
import { WhichOption } from "@/features/pricing/components/which-option";
import { PricingTrust } from "@/features/pricing/components/pricing-trust";
import { PricingFaq } from "@/features/pricing/components/pricing-faq";
import { PricingCta } from "@/features/pricing/components/pricing-cta";

export const metadata: Metadata = {
  title: "Pricing | LaunchSafe",
  description: "Simple pricing for smarter compliance decisions. Explore pre-launch assessment and ongoing compliance autopilot plans.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow">
        <PricingHero />
        <TwoWays />
        <WhichOption />
        <AssessmentFlow />
        <AutopilotPlans />
        <PricingTrust />
        <PricingFaq />
        <PricingCta />
      </main>
      <Footer />
    </div>
  );
}
