import { Metadata } from "next";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { ContactContent } from "@/features/contact/components/contact-content";

export const metadata: Metadata = {
  title: "Contact Support | LaunchSafe",
  description: "Get assistance with your compliance assessments, subscriptions, and platform questions.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <ContactContent />
      </main>
      <Footer />
    </>
  );
}
