"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/features/assessments/api/assessment-api";
import { audit } from "@/features/audit/api/audit-api";
import { Section } from "./shared";
import styles from "../settings-page.module.css";

interface Props {
  supabase: any;
}

export function SecuritySection({ supabase }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function validatePassword(password: string): string | null {
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character.";
    return null;
  }

  async function handleChangePassword() {
    setError("");
    setSuccess("");
    if (!currentPassword) { setError("Enter your current password."); return; }
    const pwError = validatePassword(newPassword);
    if (pwError) { setError(pwError); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) { setError("Could not verify your identity. Try signing in again."); setLoading(false); return; }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (signInError) { setError("Current password is incorrect."); setLoading(false); return; }

    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (updateError) { setError(updateError.message); return; }
    setSuccess("Password updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    trackEvent("Password Changed");
    audit.passwordChanged();
  }

  return (
    <Section title="Security" subtitle="Manage your account security.">
      <div className={styles.subSection}>
        <h3 className={styles.subTitle}>Change Password</h3>
        {error && <p className={styles.error} role="alert">{error}</p>}
        {success && <p className={styles.success} role="status">{success}</p>}
        <div className={styles.field}>
          <label className={styles.label}>Current Password</label>
          <input type="password" className={styles.input} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>New Password</label>
          <input type="password" className={styles.input} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" minLength={6} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Confirm New Password</label>
          <input type="password" className={styles.input} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" minLength={6} />
        </div>
        <div className={styles.actions} style={{ marginTop: 24 }}>
          <Button variant="primary" size="md" onClick={handleChangePassword} isLoading={loading}>Update Password</Button>
        </div>
      </div>

      <div className={styles.subSection}>
        <h3 className={styles.subTitle}>Two-Factor Authentication</h3>
        <p className={styles.comingSoon}>Two-factor authentication is coming soon. This feature will add an extra layer of security to your account.</p>
      </div>
    </Section>
  );
}
