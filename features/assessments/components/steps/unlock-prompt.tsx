"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import styles from "./unlock-prompt.module.css";

interface UnlockPromptProps {
  onSignupComplete: () => void;
}

export function UnlockPrompt({ onSignupComplete }: UnlockPromptProps) {
  const router = useRouter();

  async function handleSignup() {
    router.push("/signup?redirect=/assessment/unlock");
  }

  async function handleLogin() {
    router.push("/login?redirect=/assessment/unlock");
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.iconContainer}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <rect x="10" y="18" width="20" height="16" rx="3" stroke="var(--color-role-light-primary)" strokeWidth="2" />
            <path d="M15 18V14C15 11.2 17.2 9 20 9C22.8 9 25 11.2 25 14V18" stroke="var(--color-role-light-primary)" strokeWidth="2" strokeLinecap="round" />
            <path d="M20 24V26" stroke="var(--color-role-light-primary)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        <h2 className={styles.title}>Create an account to continue</h2>
        <p className={styles.subtitle}>
          Save your assessment results and unlock your full compliance report.
        </p>

        <div className={styles.benefits}>
          <div className={styles.benefit}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8L6.5 11.5L13 5" stroke="var(--color-key-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Save your assessment results</span>
          </div>
          <div className={styles.benefit}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8L6.5 11.5L13 5" stroke="var(--color-key-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Access your report anytime</span>
          </div>
          <div className={styles.benefit}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8L6.5 11.5L13 5" stroke="var(--color-key-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Track compliance over time</span>
          </div>
        </div>

        <div className={styles.actions}>
          <Button variant="primary" size="lg" fullWidth onClick={handleSignup}>
            Create Free Account
          </Button>
          <Button variant="ghost" size="md" fullWidth onClick={handleLogin}>
            I already have an account
          </Button>
        </div>
      </div>
    </div>
  );
}
