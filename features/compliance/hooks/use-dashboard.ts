"use client";

import { useState, useEffect } from "react";
import { trackEvent } from "@/lib/analytics/track";
import { fetchAllBusinesses } from "@/features/businesses/api/onboarding-api";
import { fetchProfileAndPrefs } from "@/features/settings/api/settings-api";
import { getActiveBusinessId } from "@/lib/stores/app-store";
import type { Business } from "@/types/domain/business";

const STATE_LABELS: Record<string, string> = {
  lagos: "Lagos", oyo: "Oyo", "abuja-fct": "Abuja (FCT)", rivers: "Rivers", kano: "Kano",
};

export function useDashboard() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [profileName, setProfileName] = useState<string>("");
  const [businessCount, setBusinessCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackEvent("Dashboard Viewed");

    async function load() {
      const activeId = getActiveBusinessId();
      try {
        const [bizList, profileData] = await Promise.all([
          fetchAllBusinesses(),
          fetchProfileAndPrefs().catch(() => null),
        ]);

        setBusinessCount(bizList.length);

        const target = bizList.find((b) => b.id === activeId) || bizList[0] || null;
        if (target) {
          setBusiness({
            id: target.id,
            userId: "",
            name: target.name,
            description: `${target.type || "Business"} · ${STATE_LABELS[target.state] || target.state || "—"}`,
            industryId: target.industry || "",
            countryId: "nigeria",
            stateId: target.state || null,
            lgaId: null,
            status: "active",
            employeeCount: null,
            website: null,
            createdAt: target.createdAt,
            updatedAt: target.createdAt,
          });
        }

        if (profileData?.profile?.fullName) {
          setProfileName(profileData.profile.fullName);
        }
      } catch {}
      setLoading(false);
    }

    load();
  }, []);

  return {
    data: { business, userProfile: profileName ? { fullName: profileName, jobTitle: "" } : null },
    loading,
    businessCount,
  };
}
