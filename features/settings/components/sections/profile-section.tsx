"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { fetchProfileAndPrefs, updateProfile } from "../../api/settings-api";
import { trackEvent } from "@/features/assessments/api/assessment-api";
import { audit } from "@/features/audit/api/audit-api";
import { Section } from "./shared";
import type { ProfileData } from "../../types/settings.types";
import styles from "../settings-page.module.css";

export function ProfileSection() {
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
