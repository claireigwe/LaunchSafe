"use client";

import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Lightbulb, X, Check } from "lucide-react";
import type { SuggestedTask, ComplianceTaskItem } from "../../types/tasks.types";
import { generateTaskSuggestions } from "../../data/task-suggestions";
import { fetchAITaskSuggestions } from "../../api/ai-suggestions";
import { canAccess } from "@/features/billing/api/feature-access";
import { getBusinessData, fetchAllBusinesses } from "@/features/businesses/api/onboarding-api";
import { addSuggestedTask } from "../../api/tasks-api";
import { getActiveBusinessId, useAppStore } from "@/lib/stores/app-store";
import { trackEvent } from "@/features/assessments/api/assessment-api";
import styles from "./suggested-tasks-widget.module.css";

function getDismissedKey(businessId: string | null): string {
  return `launchsafe-dismissed-suggestions-${businessId || "default"}`;
}

function loadDismissed(businessId: string | null): Set<string> {
  try {
    const raw = localStorage.getItem(getDismissedKey(businessId));
    return new Set<string>(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveDismissed(ids: Set<string>, businessId: string | null): void {
  try {
    localStorage.setItem(getDismissedKey(businessId), JSON.stringify([...ids]));
  } catch {}
}

interface SuggestedTasksWidgetProps {
  onTaskAdded?: () => void;
}

export function SuggestedTasksWidget({ onTaskAdded }: SuggestedTasksWidgetProps) {
  const queryClient = useQueryClient();
  const activeBusinessId = useAppStore((s) => s.activeBusinessId);
  const [suggestions, setSuggestions] = useState<SuggestedTask[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    setDismissed(loadDismissed(activeBusinessId));
  }, [activeBusinessId]);

  useEffect(() => {
    async function loadSuggestions() {
      let saved: any = null;

      if (activeBusinessId) {
        const allBiz = await fetchAllBusinesses();
        const biz = allBiz.find(b => b.id === activeBusinessId);
        if (biz && biz.fullData) {
          saved = biz.fullData;
        }
      }

      if (!saved) {
        saved = getBusinessData();
      }

      const profile = saved ? {
        industry: saved.info?.industry || "",
        subIndustry: saved.info?.subIndustry || "",
        state: saved.info?.state || "",
        isRegistered: saved.status?.isRegistered ?? null,
        hasCAC: saved.status?.hasCAC ?? null,
        employeeCount: saved.operations?.employeeCount || "",
        hasPhysicalLocation: saved.operations?.hasPhysicalLocation ?? null,
        hasOnlineOperations: saved.operations?.hasOnlineOperations ?? null,
        hasCustomerLocation: saved.operations?.hasCustomerLocation ?? null,
      } : null;
      const ruleBased = generateTaskSuggestions(profile);
      let aiBased: typeof ruleBased = [];
      if (canAccess("ai_compliance")) {
        aiBased = await fetchAITaskSuggestions(profile);
      }
      const all = [...ruleBased, ...aiBased];
      const existingTasks = queryClient.getQueryData<ComplianceTaskItem[]>(["tasks", activeBusinessId]) || [];
      const existingTitles = new Set(existingTasks.map((t) => t.title));
      const filtered = all.filter((s) => !existingTitles.has(s.title));
      setSuggestions(filtered);
    }
    loadSuggestions();
  }, [activeBusinessId]);

  const visible = suggestions.filter((s) => !dismissed.has(s.id));

  if (visible.length === 0) return null;

  async function handleAccept(s: SuggestedTask) {
    trackEvent("Suggested Task Accepted", { title: s.title });
    const activeBusinessId = getActiveBusinessId();
    try {
      await addSuggestedTask({ title: s.title, description: s.description, priority: s.priority, explanation: s.explanation });
      await queryClient.invalidateQueries({ queryKey: ["tasks", activeBusinessId] });
      onTaskAdded?.();
      const next = new Set(dismissed);
      next.add(s.id);
      setDismissed(next);
      saveDismissed(next, activeBusinessId);
    } catch {
      trackEvent("Suggested Task Accept Failed", { title: s.title });
    }
  }

  function handleDismiss(id: string) {
    trackEvent("Suggested Task Dismissed", { id });
    const next = new Set(dismissed);
    next.add(id);
    setDismissed(next);
    saveDismissed(next, activeBusinessId);
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Lightbulb size={16} className={styles.icon} />
        <h2 className={styles.title}>Suggested Compliance Tasks</h2>
      </div>
      <p className={styles.info}>Based on your business profile, consider adding these compliance tasks. If you've already completed any, you can upload evidence in the task details.</p>
      <div className={styles.list}>
        {visible.map((s) => (
          <div key={s.id} className={styles.item}>
            <div className={styles.itemBody}>
              <div className={styles.itemTitleRow}>
                <span className={styles.itemTitle}>{s.title}</span>
                {s.id.startsWith("sug-ai-") && <span className={styles.aiBadge}>AI</span>}
                <span className={`${styles.priorityBadge} ${styles[`pr_${s.priority}`]}`}>{s.priority}</span>
              </div>
              <p className={styles.itemReason}>{s.reason}</p>
            </div>
            <div className={styles.itemActions}>
              <button type="button" className={styles.actionBtn} onClick={() => handleAccept(s)} aria-label="Accept suggestion">
                <Check size={14} />
              </button>
              <button type="button" className={styles.actionBtn} onClick={() => handleDismiss(s.id)} aria-label="Dismiss suggestion">
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
