import type { Metadata } from "next";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { PurchaseScreen } from "@/features/assessments/components/purchase-screen";

export const metadata: Metadata = {
  title: "Unlock Your Compliance Report | LaunchSafe",
  description:
    "Complete your payment to unlock your full compliance report.",
};

export default function UnlockPage() {
  return (
    <>
      <Header />
      <main>
        <PurchaseScreen />
      </main>
      <Footer />
    </>
  );
}
