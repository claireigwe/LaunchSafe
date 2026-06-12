"use client";

import { useState, useEffect } from "react";
import { refreshAccess } from "../api/feature-access";
import { useAppStore, fetchPreferredBusiness } from "@/lib/stores/app-store";

export function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const setActiveBusinessId = useAppStore((s) => s.setActiveBusinessId);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    refreshAccess().then(() => setReady(true)).catch(() => setReady(true));
    const activeId = useAppStore.getState().activeBusinessId;
    if (!activeId) {
      fetchPreferredBusiness().then((id) => {
        if (id) setActiveBusinessId(id);
      });
    }
  }, []);

  if (!ready) {
    return <div style={{ padding: "100px 24px", textAlign: "center", color: "var(--color-role-light-onSurfaceVariant)" }}>Loading...</div>;
  }

  return <>{children}</>;
}
