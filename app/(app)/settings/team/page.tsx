"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { canManageTeam } from "@/features/settings/api/permissions";

interface Member {
  id: string;
  businessId: string;
  role: string;
  name: string;
  joinedAt: string;
  invitedAt: string;
}

export default function TeamSettingsPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [myRole, setMyRole] = useState("member");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/team/members");
      const json = await res.json();
      if (json.success) {
        setMembers(json.data);
        const me = json.data.find((m: any) => m.role === "owner" || m.role === "admin");
        setMyRole(me?.role || "member");
      }
    } catch {}
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

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Team</h1>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Manage who has access to your business.</p>

      {canInvite && (
        <div style={{ padding: 20, borderRadius: 12, border: "1px solid #eee", marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 12px" }}>Invite Member</h2>
          {error && <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 8 }}>{error}</p>}
          {success && <p style={{ color: "#16a34a", fontSize: 13, marginBottom: 8 }}>{success}</p>}
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input placeholder="Email address" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} style={{ flex: 1, padding: "10px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14 }} />
            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} style={{ padding: "10px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 14 }}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
            <Button variant="primary" size="md" onClick={handleInvite}>Invite</Button>
          </div>
          <p style={{ fontSize: 12, color: "#999", margin: 0 }}>The user must already have a LaunchSafe account to be invited.</p>
        </div>
      )}

      <div style={{ padding: 20, borderRadius: 12, border: "1px solid #eee" }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 16px" }}>Team Members</h2>
        {members.length === 0 ? (
          <p style={{ color: "#666", fontSize: 14 }}>No team members yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {members.map((m) => (
              <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 8, background: "#f9f9f9" }}>
                <div>
                  <span style={{ fontWeight: 500, fontSize: 14 }}>{m.name}</span>
                  <span style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: m.role === "owner" ? "#eef2ff" : m.role === "admin" ? "#fefce8" : "#f5f5f5", color: m.role === "owner" ? "#2563eb" : m.role === "admin" ? "#d97706" : "#666" }}>
                    {m.role}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 12, color: "#999" }}>
                    {m.joinedAt ? `Joined ${new Date(m.joinedAt).toLocaleDateString()}` : "Invited"}
                  </span>
                  {m.role !== "owner" && canInvite && (
                    <button onClick={() => handleRemove(m.id)} style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: 12 }}>Remove</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
