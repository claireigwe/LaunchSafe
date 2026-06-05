import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { CTASection } from "@/components/shared/cta-section";
import { AboutHero } from "@/features/about/components/about-hero";
import { TheProblem } from "@/features/about/components/the-problem";
import { WhyWeExist } from "@/features/about/components/why-we-exist";
import { AboutProducts } from "@/features/about/components/about-products";
import { OurApproach } from "@/features/about/components/our-approach";
import { RegulatoryIntelligence } from "@/features/about/components/regulatory-intelligence";
import { WhatMakesUsDifferent } from "@/features/about/components/what-makes-us-different";
import { WhoWeServe } from "@/features/about/components/who-we-serve";

export const metadata = {
  title: "About Us | LaunchSafe",
  description: "Learn more about LaunchSafe's mission and team.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <AboutHero />
        <TheProblem />
        <WhyWeExist />
        <AboutProducts />
        <OurApproach />
        <WhatMakesUsDifferent />
        <RegulatoryIntelligence />
        <WhoWeServe />
        <CTASection 
          title="Ready to take control of your compliance?"
          subtitle="Join founders and businesses using LaunchSafe to operate with confidence."
          primaryActionText="Start Free Assessment"
          primaryActionHref="/assessment"
        />
      </main>
      <Footer />
    </>
  );
}
