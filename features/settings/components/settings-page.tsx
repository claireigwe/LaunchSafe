"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import { fetchProfileAndPrefs, updateProfile, updateNotificationPrefs } from "../api/settings-api";
import { canManageTeam } from "../api/permissions";
import { canAccess, getCurrentPlanName } from "@/features/billing/api/feature-access";
import { getBusinessData, fetchAllBusinesses } from "@/features/businesses/api/onboarding-api";
import { trackEvent } from "@/features/assessments/api/assessment-api";
import { EmptyBusinessState } from "@/features/businesses/components/empty-business-state";
import { audit } from "@/features/audit/api/audit-api";
import type { NotificationPrefs, ProfileData } from "../types/settings.types";
import styles from "./settings-page.module.css";

type Section = "profile" | "notifications" | "security" | "team" | "account";

const SECTIONS: { key: Section; label: string }[] = [
  { key: "profile", label: "Profile" },
  { key: "notifications", label: "Notification Preferences" },
  { key: "security", label: "Security" },
  { key: "team", label: "Team" },
  { key: "account", label: "Account Management" },
];

export function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [section, setSection] = useState<Section>(() => {
    const tab = searchParams.get("tab");
    if (tab === "team") return "team";
    return "profile";
  });

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
          {section === "notifications" && <NotificationsSection />}
          {section === "security" && <SecuritySection supabase={supabase} />}
          {section === "team" && <TeamSection />}
          {section === "account" && <AccountSection router={router} supabase={supabase} />}
        </div>
      </div>
    </div>
  );
}

function ProfileSection() {
  const supabase = createClient();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [job, setJob] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProfileAndPrefs();
        setProfile(data.profile);
        setName(data.profile.fullName);
        setJob(data.profile.jobTitle);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    if (!name.trim()) { setError("Name is required"); return; }
    try {
      await updateProfile({ fullName: name.trim(), jobTitle: job.trim() });
      if (profile) setProfile({ ...profile, fullName: name.trim(), jobTitle: job.trim() });
      setEditing(false);
      setError("");
      trackEvent("Profile Updated");
      audit.profileUpdated("name");
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    }
  }

  function handleCancel() {
    setName(profile?.fullName || "");
    setJob(profile?.jobTitle || "");
    setEditing(false);
    setError("");
  }

  if (loading) return <Section title="Profile" subtitle="Manage your account information."><p className={styles.emptyText}>Loading profile...</p></Section>;
  if (!profile) return null;

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


function NotificationsSection() {
  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchProfileAndPrefs();
        setPrefs(data.prefs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function toggle(key: keyof NotificationPrefs) {
    if (!prefs) return;
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    try {
      await updateNotificationPrefs(next);
      trackEvent("Notification Preference Updated", { key, value: next[key] });
    } catch (err) {
      console.error(err);
      setPrefs(prefs);
    }
  }

  if (loading || !prefs) return <Section title="Notification Preferences" subtitle="Control which notifications you receive."><p className={styles.emptyText}>Loading preferences...</p></Section>;

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

function TeamSection() {
  const [members, setMembers] = useState<Member[]>([]);
  const [myRole, setMyRole] = useState("member");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [noBusiness, setNoBusiness] = useState(false);

  interface Member {
    id: string;
    businessId: string;
    role: string;
    name: string;
    joinedAt: string;
    invitedAt: string;
  }

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/team/members");
      const json = await res.json();
      
      const parseData = (data: any) => {
        if (!data) return { members: [], myRole: "member" };
        if (Array.isArray(data)) {
          const me = data.find((m: any) => m.role === "owner" || m.role === "admin");
          return { members: data, myRole: me?.role || "member" };
        }
        return { members: data.members || [], myRole: data.myRole || "member" };
      };

      if (json.success) {
        const { members: initialMembers, myRole: initialRole } = parseData(json.data);
        if (initialMembers.length > 0 || initialRole !== "member") {
          setMembers(initialMembers);
          setMyRole(initialRole);
        } else {
          const all = await fetchAllBusinesses();
          if (all.length === 0) {
            setNoBusiness(true);
          } else {
            const biz = getBusinessData() as any;
            if (biz?.info?.businessName) {
              await fetch("/api/businesses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: biz.info.businessName }),
              });
              const retry = await fetch("/api/team/members");
              const retryJson = await retry.json();
              if (retryJson.success) {
                const { members: retryMembers, myRole: retryRole } = parseData(retryJson.data);
                setMembers(retryMembers);
                setMyRole(retryRole);
              }
            }
          }
        }
      }
    } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleInvite() {
    setError(""); setSuccess("");
    if (!inviteEmail) { setError("Enter an email address"); return; }
    try {
      const res = await fetch("/api/team/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccess(`Invited ${inviteEmail} successfully.`);
        setInviteEmail("");
        audit.teamInvited(inviteEmail);
        load();
      } else {
        setError(json.error?.message || "Invite failed");
      }
    } catch { setError("Invite failed"); }
  }

  async function handleRemove(memberId: string) {
    await fetch("/api/team/members", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId }),
    });
    load();
  }

  const canInvite = canManageTeam(myRole as any);
  const hasTeamAccess = canAccess("team_collaboration");
  const currentPlan = getCurrentPlanName();

  if (loading) {
    return (
      <Section title="Team" subtitle="Manage who has access to your business.">
        <p className={styles.emptyText}>Loading team information...</p>
      </Section>
    );
  }

  if (noBusiness) {
    return <EmptyBusinessState />;
  }

  if (!hasTeamAccess) {
    return (
      <Section title="Team" subtitle="Manage who has access to your business.">
        <div className={styles.emptyCard}>
          <p className={styles.emptyText}>
            Team collaboration is available on the <strong>Enterprise</strong> plan.{currentPlan ? <> You are currently on the <strong>{currentPlan}</strong> plan.</> : ''}
          </p>
          <Button variant="primary" size="md" onClick={() => window.location.href = "/settings/billing"}>
            Upgrade to Enterprise
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <Section title="Team" subtitle="Manage who has access to your business.">
      {canInvite && (
        <div className={styles.inviteCard}>
          <h3 className={styles.subTitle}>Invite Member</h3>
          {error && <p className={styles.error} role="alert">{error}</p>}
          {success && <p className={styles.success} role="status">{success}</p>}
          <div className={styles.inviteRow}>
            <input className={styles.input} placeholder="Email address" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
            <Select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} options={["member", "admin"]} />
            <Button variant="primary" size="md" onClick={handleInvite}>Invite</Button>
          </div>
          <p className={styles.hint}>The user must already have a LaunchSafe account to be invited.</p>
        </div>
      )}

      <div className={styles.membersCard}>
        <h3 className={styles.subTitle}>Team Members</h3>
        {members.length === 0 ? (
          <p className={styles.emptyText}>No team members yet.</p>
        ) : (
          <div className={styles.membersList}>
            {members.map((m) => (
              <div key={m.id} className={styles.memberRow}>
                <div>
                  <span className={styles.memberName}>{m.name}</span>
                  <span className={cn(styles.roleBadge, m.role === "owner" ? styles.roleOwner : m.role === "admin" ? styles.roleAdmin : styles.roleMember)}>
                    {m.role}
                  </span>
                </div>
                <div className={styles.memberActions}>
                  <span className={styles.memberDate}>
                    {m.joinedAt ? `Joined ${new Date(m.joinedAt).toLocaleDateString()}` : "Invited"}
                  </span>
                  {m.role !== "owner" && canInvite && (
                    <button className={styles.removeBtn} onClick={() => handleRemove(m.id)}>Remove</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
}

function AccountSection({ router, supabase }: { router: any; supabase: any }) {
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

