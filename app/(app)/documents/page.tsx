import type { Metadata } from "next";
import { DocumentLibrary } from "@/features/documents/components/document-library";

export const metadata: Metadata = {
  title: "Documents | LaunchSafe",
};

export default function DocumentsPage() {
  return <DocumentLibrary />;
}
