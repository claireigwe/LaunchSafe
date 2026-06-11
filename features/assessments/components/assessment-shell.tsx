"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { AppSidebar } from "@/features/compliance/components/app-sidebar";
import { PaymentCallbackHandler } from "./payment-callback-handler";

export function AssessmentShell() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    createClient().auth.getSession().then(({ data: { session } }) => {
      setAuthed(!!session);
    });
  }, []);

  if (authed === null) {
    return <div style={{ padding: "100px 24px", textAlign: "center", color: "var(--color-role-light-onSurfaceVariant)" }}>Loading...</div>;
  }

  if (authed) {
    return (
      <div className="app-shell">
        <AppSidebar />
        <main className="app-content">
          <PaymentCallbackHandler />
        </main>
      </div>
    );
  }

  return (
    <>
      <Header />
      <main>
        <PaymentCallbackHandler />
      </main>
      <Footer />
    </>
  );
}
