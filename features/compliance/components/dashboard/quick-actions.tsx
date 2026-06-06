"use client";

import { useRouter } from "next/navigation";
import { PlusCircle, Upload, Calendar, Building2 } from "lucide-react";
import styles from "./quick-actions.module.css";

interface Props {
  onAddTask?: () => void;
  onUploadDocument?: () => void;
}

const ITEMS: { icon: any; label: string; href?: string; action?: "addTask" | "uploadDoc" }[] = [
  { icon: PlusCircle, label: "Add Compliance Task", action: "addTask" },
  { icon: Upload, label: "Upload Document", action: "uploadDoc" },
  { icon: Calendar, label: "View Calendar", href: "/calendar" },
  { icon: Building2, label: "Update Business Info", href: "/settings" },
];

export function QuickActions({ onAddTask, onUploadDocument }: Props) {
  const router = useRouter();

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Quick Actions</h2>
      </div>
      <div className={styles.grid}>
        {ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            className={styles.action}
            onClick={() => {
              if (item.action === "addTask" && onAddTask) {
                onAddTask();
              } else if (item.action === "uploadDoc" && onUploadDocument) {
                onUploadDocument();
              } else if (item.href) {
                router.push(item.href);
              }
            }}
          >
            <item.icon size={18} className={styles.actionIcon} />
            <span className={styles.actionLabel}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
