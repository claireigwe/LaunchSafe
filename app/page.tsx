import type { Metadata } from "next";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { HeroSection } from "@/features/landing/components/hero-section";
import { FeatureSection } from "@/features/landing/components/feature-section";
import { HowItWorksSection } from "@/features/landing/components/how-it-works";
import { AutopilotSection } from "@/features/landing/components/autopilot-section";
import { ProductComparisonSection } from "@/features/landing/components/product-comparison";
import { FAQSection } from "@/features/landing/components/faq-section";
import { CTASection } from "@/components/shared/cta-section";

export const metadata: Metadata = {
  title: "LaunchSafe — Compliance Intelligence for African Businesses",
  description:
    "Discover your compliance requirements before launching. Understand costs, permits, licenses, and risks in minutes.",
};

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <FeatureSection />
        <HowItWorksSection />
        <AutopilotSection />
        <ProductComparisonSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
