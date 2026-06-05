import { Metadata } from "next";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { TermsContent } from "@/features/terms/components/terms-content";

export const metadata: Metadata = {
  title: "Terms of Service | LaunchSafe",
  description: "Read our Terms of Service.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main>
        <TermsContent />
      </main>
      <Footer />
    </>
  );
}
