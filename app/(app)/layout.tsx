import { getRequiredUser } from "@/lib/auth/get-session";

/**
 * Authenticated app shell layout.
 * Wraps all protected routes with the sidebar navigation.
 * getRequiredUser() will redirect to /login if no session exists.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth check — redirects to /login if unauthenticated.
  await getRequiredUser();

  return (
    <div id="app-shell">
      {/* Sidebar and nav will be implemented in component-builder phase */}
      <nav id="app-sidebar" aria-label="Main navigation" />
      <main id="app-content">{children}</main>
    </div>
  );
}
