"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import { canManageTeam } from "../../api/permissions";
import { canAccess, getCurrentPlanName } from "@/features/billing/api/feature-access";
import { getBusinessData, fetchAllBusinesses } from "@/features/businesses/api/onboarding-api";
import { EmptyBusinessState } from "@/features/businesses/components/empty-business-state";
import { audit } from "@/features/audit/api/audit-api";
import { Section } from "./shared";
import styles from "../settings-page.module.css";

interface Member {
  id: string;
  businessId: string;
  role: string;
  name: string;
  joinedAt: string;
  invitedAt: string;
}

export function TeamSection() {
  const [members, setMembers] = useState<Member[]>([]);
  const [myRole, setMyRole] = useState("member");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [noBusiness, setNoBusiness] = useState(false);

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
