import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compliance",
};

export default function BusinessCompliancePage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  return (
    <div id="business-compliance-page">
      <h1>Compliance</h1>
    </div>
  );
}
