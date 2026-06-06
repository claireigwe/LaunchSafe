"use client";

import { useState, useEffect } from "react";
import { trackEvent } from "@/features/assessments/api/assessment-api";
import { getBusinessData } from "@/features/businesses/api/onboarding-api";
import { loadTasks, reconcileTaskStatuses } from "@/features/compliance/api/tasks-api";
import { getIndustriesSync } from "@/features/assessments/api/industries-api";
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
    setData((prev) => ({
      ...prev,
      tasks: all as any,
      upcomingDeadlines: all
        .filter((t) => t.status !== "completed" && t.dueDate)
        .sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""))
        .slice(0, 5) as any,
      overdueItems: all.filter((t) => t.status === "overdue") as any,
    }));
    setLoading(false);
  }, []);

  return { data, loading, tasks };
}

function buildDashboardData(): DashboardData {
  const saved = getBusinessData() as Record<string, any> | null;
  const info = saved?.info;
  const operations = saved?.operations;

  let business: Business | null = null;
  if (info?.businessName) {
    const industryObj = getIndustriesSync().find((i) => i.slug === info.industry);
    business = {
      id: "onboarded",
      userId: "",
      name: info.businessName,
      description: info.description || `${industryObj?.name || info.businessType || "Business"} · ${getStateLabel(info.state)}`,
      industryId: info.industry || "",
      countryId: "nigeria",
      stateId: info.state || null,
      lgaId: null,
      status: "active",
      launchDate: null,
      employeeCount: parseCount(operations?.employeeCount),
      website: info.website || null,
      createdAt: saved?._savedAt || new Date().toISOString(),
      updatedAt: saved?._savedAt || new Date().toISOString(),
    };
  }

  return {
    score: null,
    upcomingDeadlines: [],
    overdueItems: [],
    tasks: [],
    regulatoryUpdates: [],
    business,
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
