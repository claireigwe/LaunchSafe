"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { loadProfile, saveProfile, loadNotificationPrefs, saveNotificationPrefs } from "../api/settings-api";
import { getBusinessData, clearUserIntent } from "@/features/businesses/api/onboarding-api";
import { getSubscription } from "@/features/billing/api/billing-api";
import { INDUSTRIES } from "@/features/assessments/data/industries";
import { trackEvent } from "@/features/assessments/api/assessment-api";
import type { NotificationPrefs } from "../types/settings.types";
import styles from "./settings-page.module.css";

type Section = "profile" | "business" | "notifications" | "security" | "account";

const SECTIONS: { key: Section; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "business", label: "Business Settings" },
  { key: "notifications", label: "Notification Preferences" },
  { key: "security", label: "Security" },
  { key: "account", label: "Account Management" },
];

export function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [section, setSection] = useState<Section>("profile");

  useEffect(() => {
    trackEvent("Settings Viewed");
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
      </div>
      <div className={styles.layout}>
        <nav className={styles.sidebar} aria-label="Settings sections">
          {SECTIONS.map((s) => (
            <button key={s.key} type="button" className={cn(styles.sidebarBtn, section === s.key && styles.sidebarActive)} onClick={() => setSection(s.key)}>
              {s.label}
            </button>
          ))}
        </nav>
        <div className={styles.content}>
          {section === "profile" && <ProfileSection />}
          {section === "business" && <BusinessSection router={router} />}
          {section === "notifications" && <NotificationsSection />}
          {section === "security" && <SecuritySection supabase={supabase} />}
          {section === "account" && <AccountSection router={router} supabase={supabase} />}
        </div>
      </div>
    </div>
  );
}

function ProfileSection() {
  const [profile, setProfile] = useState(loadProfile());
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(profile.fullName);
  const [job, setJob] = useState(profile.jobTitle);
  const [error, setError] = useState("");

  function handleSave() {
    if (!name.trim()) { setError("Name is required"); return; }
    const updated = saveProfile({ fullName: name.trim(), jobTitle: job.trim() });
    setProfile(updated);
    setEditing(false);
    setError("");
    trackEvent("Profile Updated");
  }

  function handleCancel() {
    setName(profile.fullName);
    setJob(profile.jobTitle);
    setEditing(false);
    setError("");
  }

  return (
    <Section title="Profile" subtitle="Manage your account information.">
      <div className={styles.field}>
        <label className={styles.label}>Email</label>
        <input className={styles.input} value={profile.email} disabled />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Full Name</label>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <input className={styles.input} value={editing ? name : profile.fullName} onChange={(e) => setName(e.target.value)} disabled={!editing} placeholder="Your full name" />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Job Title <span className={styles.opt}>(optional)</span></label>
        <input className={styles.input} value={editing ? job : profile.jobTitle} onChange={(e) => setJob(e.target.value)} disabled={!editing} placeholder="e.g. Founder, CEO" />
      </div>
      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Account created</span>
        <span className={styles.metaValue}>{new Date(profile.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</span>
      </div>
      <div className={styles.metaRow}>
        <span className={styles.metaLabel}>Last login</span>
        <span className={styles.metaValue}>{new Date(profile.lastLogin).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</span>
      </div>
      <div className={styles.actions}>
        {editing ? (
          <>
            <Button variant="ghost" size="md" onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" size="md" onClick={handleSave}>Save Changes</Button>
          </>
        ) : (
          <Button variant="primary" size="md" onClick={() => setEditing(true)}>Edit Profile</Button>
        )}
      </div>
    </Section>
  );
}

function BusinessSection({ router }: { router: any }) {
  const saved = getBusinessData() as any;
  const info = saved?.info;
  const operations = saved?.operations;

  if (!info?.businessName) {
    return (
      <Section title="Business Settings" subtitle="Manage your business information.">
        <div className={styles.emptyCard}>
          <p className={styles.emptyText}>Business information has not been configured yet.</p>
          <Button variant="primary" size="md" onClick={() => { clearUserIntent(); router.push("/business-onboarding"); }}>Complete Business Profile</Button>
        </div>
      </Section>
    );
  }

  return (
    <Section title="Business Settings" subtitle="View your business information.">
      <div className={styles.field}>
        <label className={styles.label}>Business Name</label>
        <input className={styles.input} value={info.businessName} disabled />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Industry</label>
        <input className={styles.input} value={getIndustryName(info.industry)} disabled />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Business Type</label>
        <input className={styles.input} value={info.businessType || "—"} disabled />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>State</label>
        <input className={styles.input} value={getStateLabel(info.state)} disabled />
      </div>
      {info.website && <div className={styles.field}><label className={styles.label}>Website</label><input className={styles.input} value={info.website} disabled /></div>}
      {info.description && <div className={styles.field}><label className={styles.label}>Description</label><textarea className={styles.textarea} value={info.description} disabled rows={2} /></div>}
      {operations?.employeeCount && (
        <div className={styles.field}><label className={styles.label}>Employees</label><input className={styles.input} value={operations.employeeCount} disabled /></div>
      )}
    </Section>
  );
}

function NotificationsSection() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(loadNotificationPrefs());

  function toggle(key: keyof NotificationPrefs) {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    saveNotificationPrefs(next);
    trackEvent("Notification Preference Updated", { key, value: next[key] });
  }

  return (
    <Section title="Notification Preferences" subtitle="Control which notifications you receive.">
      <ToggleRow label="Task Notifications" description="When tasks are created, completed, or overdue" value={prefs.taskNotifications} onChange={() => toggle("taskNotifications")} />
      <ToggleRow label="Deadline Reminders" description="Upcoming and missed deadline alerts" value={prefs.deadlineReminders} onChange={() => toggle("deadlineReminders")} />
      <ToggleRow label="Document Notifications" description="Document uploads and updates" value={prefs.documentNotifications} onChange={() => toggle("documentNotifications")} />
      <ToggleRow label="Billing Notifications" description="Payment confirmations and subscription alerts" value={prefs.billingNotifications} onChange={() => toggle("billingNotifications")} />
      <ToggleRow label="System Announcements" description="Platform updates and new features" value={prefs.systemAnnouncements} onChange={() => toggle("systemAnnouncements")} />
      <p className={styles.deliveryNote}>Notifications are delivered in-app only. Email and push notification delivery coming soon.</p>
    </Section>
  );
}

function SecuritySection({ supabase }: { supabase: any }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleChangePassword() {
    setError("");
    setSuccess("");
    if (newPassword.length < 6) { setError("New password must be at least 6 characters"); return; }
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (updateError) { setError(updateError.message); return; }
    setSuccess("Password updated successfully.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    trackEvent("Password Changed");
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
        <Button variant="primary" size="md" onClick={handleChangePassword} isLoading={loading}>Update Password</Button>
      </div>

      <div className={styles.subSection}>
        <h3 className={styles.subTitle}>Two-Factor Authentication</h3>
        <p className={styles.comingSoon}>Two-factor authentication is coming soon. This feature will add an extra layer of security to your account.</p>
      </div>
    </Section>
  );
}

function AccountSection({ router, supabase }: { router: any; supabase: any }) {
  const sub = getSubscription();
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  function handleDeleteRequest() {
    // V1: log intent — actual deletion requires backend
    if (deleteConfirm !== "DELETE") return;
    trackEvent("Account Deleted");
    supabase.auth.signOut();
    localStorage.clear();
    router.push("/");
  }

  return (
    <Section title="Account Management" subtitle="Manage your account and subscription.">
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

/* Shared sub-components */

function Section({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className={styles.sectionTitle}>{title}</h2>
      <p className={styles.sectionSubtitle}>{subtitle}</p>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}

function ToggleRow({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: () => void }) {
  return (
    <div className={styles.toggleRow}>
      <div className={styles.toggleInfo}>
        <span className={styles.toggleLabel}>{label}</span>
        <span className={styles.toggleDesc}>{description}</span>
      </div>
      <button type="button" className={cn(styles.toggle, value && styles.toggleOn)} onClick={onChange} role="switch" aria-checked={value} aria-label={label}>
        <div className={styles.toggleThumb} />
      </button>
    </div>
  );
}

function getIndustryName(id: string): string {
  return INDUSTRIES.find((i) => i.id === id)?.name || id;
}

function getStateLabel(id: string): string {
  const states: Record<string, string> = { lagos: "Lagos", oyo: "Oyo", "abuja-fct": "Abuja (FCT)", rivers: "Rivers", kano: "Kano" };
  return states[id] || id;
}
