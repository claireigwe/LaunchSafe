"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics/track";
import { Section } from "./shared";
import styles from "../settings-page.module.css";

interface Props {
  router: any;
  supabase: any;
}

export function AccountSection({ router, supabase }: Props) {
  const [error, setError] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [sub, setSub] = useState<{ planName: string; status: string } | null>(null);

  useEffect(() => {
    fetch("/api/billing/data").then(r => r.json()).then(d => {
      if (d.success && d.data?.subscription) setSub(d.data.subscription);
    }).catch(() => {});
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function handleDeleteRequest() {
    if (deleteConfirm !== "DELETE") return;
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const json = await res.json();
      if (!json.success) { setError(json.error?.message || "Deletion failed"); return; }
      trackEvent("Account Deleted");
      localStorage.clear();
      await supabase.auth.signOut();
      router.push("/");
    } catch {
      setError("Account deletion failed. Please try again.");
    }
  }

  return (
    <Section title="Account Management" subtitle="Manage your account and subscription.">
      {error && <p className={styles.error} role="alert">{error}</p>}
      {sub && (
        <div className={styles.subCard}>
          <div className={styles.subRow}>
            <span className={styles.subLabel}>Current Plan</span>
            <span className={styles.subValue}>{sub.planName}</span>
          </div>
          <div className={styles.subRow}>
            <span className={styles.subLabel}>Status</span>
            <span className={styles.subValue} style={{ textTransform: "capitalize" }}>{sub.status}</span>
          </div>
          <Button variant="outline" size="sm" fullWidth onClick={() => router.push("/settings/billing")}>Manage Billing</Button>
        </div>
      )}

      <div className={styles.dangerZone}>
        <h3 className={styles.subTitle}>Sign Out</h3>
        <p className={styles.dangerText}>Sign out of your account on this device.</p>
        <Button variant="outline" size="md" onClick={handleSignOut}>Sign Out</Button>
      </div>

      <div className={styles.dangerZone}>
        <h3 className={styles.subTitle} style={{ color: "var(--color-role-light-error)" }}>Delete Account</h3>
        <p className={styles.dangerText}>Permanently delete your account and all associated data. This action cannot be undone.</p>
        {showDelete ? (
          <div>
            <p className={styles.warningText}>This will permanently remove access to your businesses, documents, compliance records, and reports.</p>
            <div className={styles.field}>
              <label className={styles.label}>Type <strong>DELETE</strong> to confirm</label>
              <input className={styles.input} value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder="DELETE" />
            </div>
            <div className={styles.actions} style={{ marginTop: 12 }}>
              <Button variant="ghost" size="sm" onClick={() => { setShowDelete(false); setDeleteConfirm(""); }}>Cancel</Button>
              <Button variant="destructive" size="sm" disabled={deleteConfirm !== "DELETE"} onClick={handleDeleteRequest}>Delete My Account</Button>
            </div>
          </div>
        ) : (
          <Button variant="destructive" size="sm" onClick={() => setShowDelete(true)}>Delete Account</Button>
        )}
      </div>
    </Section>
  );
}
