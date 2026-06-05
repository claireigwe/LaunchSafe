import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Overview",
};

/** Business detail page scaffold. */
export default function BusinessDetailPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  return (
    <div id="business-detail-page">
      <h1>Business Overview</h1>
    </div>
  );
}
