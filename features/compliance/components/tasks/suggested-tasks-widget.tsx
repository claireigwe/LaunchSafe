"use client";

import { useState, useEffect } from "react";
import { Lightbulb, X, Check } from "lucide-react";
import type { SuggestedTask } from "../../types/tasks.types";
import { generateTaskSuggestions } from "../../data/task-suggestions";
import { getBusinessData } from "@/features/businesses/api/onboarding-api";
import { addSuggestedTask, loadTasks } from "../../api/tasks-api";
import { trackEvent } from "@/features/assessments/api/assessment-api";
import styles from "./suggested-tasks-widget.module.css";

const DISMISSED_KEY = "launchsafe-dismissed-suggestions";

function loadDismissed(): Set<string> {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    return new Set<string>(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveDismissed(ids: Set<string>): void {
  try {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...ids]));
  } catch {}
}

export function SuggestedTasksWidget() {
  const [suggestions, setSuggestions] = useState<SuggestedTask[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(loadDismissed);

  useEffect(() => {
    const saved = getBusinessData() as any;
    const profile = saved ? {
      industry: saved.info?.industry || "",
      isRegistered: saved.status?.isRegistered ?? null,
      hasCAC: saved.status?.hasCAC ?? null,
      employeeCount: saved.operations?.employeeCount || "",
      hasPhysicalLocation: saved.operations?.hasPhysicalLocation ?? null,
      hasOnlineOperations: saved.operations?.hasOnlineOperations ?? null,
      hasCustomerLocation: saved.operations?.hasCustomerLocation ?? null,
    } : null;
    const all = generateTaskSuggestions(profile);
    const existingTitles = new Set(loadTasks().map((t) => t.title));
    const filtered = all.filter((s) => !existingTitles.has(s.title));
    setSuggestions(filtered);
  }, []);

  const visible = suggestions.filter((s) => !dismissed.has(s.id)).slice(0, 5);

  if (visible.length === 0) return null;

  function handleAccept(s: SuggestedTask) {
    trackEvent("Suggested Task Accepted", { title: s.title });
    addSuggestedTask({ title: s.title, description: s.description, priority: s.priority, explanation: s.explanation });
    const next = new Set(dismissed);
    next.add(s.id);
    setDismissed(next);
    saveDismissed(next);
  }

  function handleDismiss(id: string) {
    trackEvent("Suggested Task Dismissed", { id });
    const next = new Set(dismissed);
    next.add(id);
    setDismissed(next);
    saveDismissed(next);
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Lightbulb size={16} className={styles.icon} />
        <h2 className={styles.title}>Suggested Compliance Tasks</h2>
      </div>
      <p className={styles.info}>Based on your business profile, consider adding these compliance tasks.</p>
      <div className={styles.list}>
        {visible.map((s) => (
          <div key={s.id} className={styles.item}>
            <div className={styles.itemBody}>
              <div className={styles.itemTitleRow}>
                <span className={styles.itemTitle}>{s.title}</span>
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
