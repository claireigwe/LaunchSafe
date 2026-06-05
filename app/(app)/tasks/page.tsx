import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Compliance Tasks | LaunchSafe",
};

export default function TasksPage() {
  return (
    <div>
      <h1>Compliance Tasks</h1>
      <p>Manage your compliance obligations.</p>
      <Link href="/dashboard" passHref><Button variant="primary">Back to Dashboard</Button></Link>
    </div>
  );
}
