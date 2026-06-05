"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import styles from "./dashboard-redirect.module.css";

interface Props {
  onComplete: () => void;
}

export function DashboardRedirect({ onComplete }: Props) {
  const router = useRouter();

  useEffect(() => {
    onComplete();
  }, [onComplete]);

  return (
    <div className={styles.container}>
      <div className={styles.checkmark}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="24" fill="var(--color-key-success)" />
          <path d="M16 24L21.5 29.5L32 19" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className={styles.title}>Welcome to LaunchSafe</h1>
      <p className={styles.subtitle}>Your compliance workspace is ready.</p>

      <div className={styles.actions}>
        <Button variant="primary" size="lg" fullWidth onClick={() => router.push("/dashboard")}>
          View Compliance Dashboard
        </Button>
        <Button variant="outline" size="md" fullWidth onClick={() => router.push("/compliance")}>
          Add Compliance Tasks
        </Button>
        <Button variant="ghost" size="md" fullWidth onClick={() => router.push("/documents")}>
          Upload Documents
        </Button>
        <Button variant="ghost" size="md" fullWidth onClick={() => router.push("/regulatory-updates")}>
          Review Regulatory Updates
        </Button>
      </div>
    </div>
  );
}
