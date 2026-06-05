import { Metadata } from "next";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { PrivacyContent } from "@/features/privacy/components/privacy-content";

export const metadata: Metadata = {
  title: "Privacy Policy | LaunchSafe",
  description: "Learn how LaunchSafe protects your personal and business information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main>
        <PrivacyContent />
      </main>
      <Footer />
    </>
  );
}
