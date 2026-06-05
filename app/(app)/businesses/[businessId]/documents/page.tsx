import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documents",
};

export default function BusinessDocumentsPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  return (
    <div id="business-documents-page">
      <h1>Documents</h1>
    </div>
  );
}
