import type { Metadata } from "next";

export const metadata: Metadata = { title: "Compliance Task" };

export default function ComplianceTaskPage({ params }: { params: Promise<{ taskId: string }> }) {
  return <div id="compliance-task-page"><h1>Compliance Task</h1></div>;
}
