"use client";

import { useEffect } from "react";
import { refreshAccess } from "../api/feature-access";
import { useAppStore, fetchPreferredBusiness } from "@/lib/stores/app-store";

export function SubscriptionGuard({ children }: { children: React.ReactNode }) {
  const setActiveBusinessId = useAppStore((s) => s.setActiveBusinessId);

  useEffect(() => {
    refreshAccess();
    const activeId = useAppStore.getState().activeBusinessId;
    if (!activeId) {
      fetchPreferredBusiness().then((id) => {
        if (id) setActiveBusinessId(id);
      });
    }
  }, []);

  return <>{children}</>;
}
