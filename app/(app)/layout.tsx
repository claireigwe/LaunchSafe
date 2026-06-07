import { getRequiredUser } from "@/lib/auth/get-session";
import { AppSidebar } from "@/features/compliance/components/app-sidebar";
import { AIAssistantWrapper } from "@/features/ai/components/ai-assistant-wrapper";
import { SubscriptionGuard } from "@/features/billing/components/subscription-guard";
import "./app-layout.css";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await getRequiredUser();

  return (
    <SubscriptionGuard>
      <div className="app-shell">
        <AppSidebar />
        <main className="app-content">{children}</main>
        <AIAssistantWrapper />
      </div>
    </SubscriptionGuard>
  );
}
