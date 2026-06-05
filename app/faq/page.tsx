import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { CTASection } from "@/components/shared/cta-section";
import { FAQHero } from "@/features/faq/components/faq-hero";
import { FAQCategory } from "@/features/faq/components/faq-category";
import { faqData } from "@/features/faq/data/faq-data";

export const metadata = {
  title: "Frequently Asked Questions | LaunchSafe",
  description: "Everything you need to know about LaunchSafe, compliance assessments, subscriptions, pricing, and regulatory intelligence.",
};

export default function FAQPage() {
  return (
    <>
      <Header />
      <main>
        <FAQHero />
        
        <section style={{ padding: "64px 24px", maxWidth: "800px", margin: "0 auto" }}>
          {faqData.map((category, index) => (
            <FAQCategory key={index} category={category} />
          ))}
        </section>

        <CTASection 
          title="Still have questions?"
          subtitle="Our team is happy to help you understand how LaunchSafe can support your business."
          primaryActionText="Start Free Assessment"
          primaryActionHref="/assessment"
          secondaryActionText="Contact Support"
          secondaryActionHref="/contact"
        />
      </main>
      <Footer />
    </>
  );
}
