"use client";

import { useState, useEffect } from "react";
import { trackEvent } from "@/features/assessments/api/assessment-api";
import { fetchAllBusinesses } from "@/features/businesses/api/onboarding-api";
import { fetchProfileAndPrefs } from "@/features/settings/api/settings-api";
import { loadTasks, reconcileTaskStatuses } from "@/features/compliance/api/tasks-api";
import { getIndustriesSync } from "@/features/assessments/api/industries-api";
import { getActiveBusinessId } from "@/lib/stores/app-store";
import type { DashboardData } from "../types/dashboard.types";
import type { Business } from "@/types/domain/business";
import type { ComplianceTaskItem } from "@/features/compliance/types/tasks.types";

export function useDashboard() {
  const [data, setData] = useState<DashboardData>(() => buildDashboardData());
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<ComplianceTaskItem[]>([]);

  useEffect(() => {
    trackEvent("Dashboard Viewed");
    reconcileTaskStatuses();
    const all = loadTasks();
    setTasks(all);

    async function loadDashBusiness() {
      const activeId = getActiveBusinessId();
      try {
        const bizList = await fetchAllBusinesses();
        let target = bizList.find((b) => b.id === activeId);
        if (!target && bizList.length > 0) target = bizList[0];
        
        let business: Business | null = null;
        if (target) {
          const industryObj = getIndustriesSync().find((i) => i.slug === target!.industry);
          business = {
            id: target.id,
            userId: "",
            name: target.name,
            description: `${industryObj?.name || target.type || "Business"} · ${getStateLabel(target.state)}`,
            industryId: target.industry || "",
            countryId: "nigeria",
            stateId: target.state || null,
            lgaId: null,
            status: "active",
            launchDate: null,
            employeeCount: null,
            website: null,
            createdAt: target.createdAt,
            updatedAt: target.createdAt,
          };
        }

        const profileData = await fetchProfileAndPrefs().catch(() => null);

        setData((prev) => ({
          ...prev,
          tasks: all as any,
          upcomingDeadlines: all
            .filter((t) => t.status !== "completed" && t.dueDate)
            .sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""))
            .slice(0, 5) as any,
          overdueItems: all.filter((t) => t.status === "overdue") as any,
          business,
          userProfile: profileData?.profile || null,
        }));
      } catch (e) {
        // Fallback
      }
      setLoading(false);
    }

    loadDashBusiness();
  }, []);

  return { data, loading, tasks };
}

function buildDashboardData(): DashboardData {
  return {
    score: null,
    upcomingDeadlines: [],
    overdueItems: [],
    tasks: [],
    regulatoryUpdates: [],
    business: null,
    recentActivity: [],
    notifications: [],
  };
}

function getStateLabel(stateId: string): string {
  const m: Record<string, string> = { lagos: "Lagos", oyo: "Oyo", "abuja-fct": "Abuja (FCT)", rivers: "Rivers", kano: "Kano" };
  return m[stateId] || stateId;
}

function parseCount(val: string | undefined): number | null {
  if (!val) return null;
  if (val === "1") return 1;
  if (val === "2-10") return 5;
  if (val === "11-50") return 25;
  if (val === "51-200") return 100;
  if (val === "201+") return 250;
  return null;
}
