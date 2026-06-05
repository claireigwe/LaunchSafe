"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ComplianceTask } from "@/types/domain/compliance";
import styles from "./compliance-tasks.module.css";

type FilterValue = "all" | "pending" | "in_progress" | "completed";

interface Props {
  tasks: ComplianceTask[];
}

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

export function ComplianceTasks({ tasks }: Props) {
  const [filter, setFilter] = useState<FilterValue>("all");

  const filtered = tasks.filter((t) => {
    if (filter === "all") return true;
    if (filter === "pending") return t.status === "not_started" || t.status === "due_soon";
    if (filter === "in_progress") return t.status === "in_progress" || t.status === "awaiting_submission";
    if (filter === "completed") return t.status === "completed" || t.status === "approved";
    return true;
  });

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <ClipboardList size={16} className={styles.icon} />
          <h2 className={styles.title}>Compliance Tasks</h2>
        </div>
        <Link href="/compliance/new" tabIndex={-1}>
          <Button variant="primary" size="sm">
            <Plus size={14} />
            New Task
          </Button>
        </Link>
      </div>

      <div className={styles.filters} role="tablist" aria-label="Filter tasks">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            role="tab"
            aria-selected={filter === f.value}
            className={`${styles.filterBtn} ${filter === f.value ? styles.filterActive : ""}`}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <ul className={styles.list}>
          {filtered.map((t) => (
            <li key={t.id} className={styles.item}>
              <Link href={`/compliance/${t.id}`} className={styles.link}>
                <div className={styles.itemLeft}>
                  <span className={`${styles.statusDot} ${styles[`s_${t.status}`]}`} />
                  <span className={styles.itemName}>{t.requirementName}</span>
                </div>
                <span className={styles.itemAgency}>{t.agencyName}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            {tasks.length === 0
              ? "You do not have any compliance tasks yet."
              : "No tasks match the selected filter."}
          </p>
          {tasks.length === 0 && (
            <Link href="/compliance/new" tabIndex={-1}>
              <Button variant="primary" size="sm">Create First Task</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
