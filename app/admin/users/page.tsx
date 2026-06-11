"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface UserRow {
  id: string;
  userId: string;
  email: string | null;
  fullName: string | null;
  createdAt: string;
  currentPlan: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [grantingId, setGrantingId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data: profiles } = await supabase
          .from("user_profiles")
          .select("id, user_id, email, full_name, created_at")
          .order("created_at", { ascending: false });

        const { data: subs } = await supabase
          .from("subscriptions")
          .select("user_id, subscription_plans!inner(slug)")
          .in("status", ["active", "trial"]);

        const planMap: Record<string, string> = {};
        (subs || []).forEach((s: any) => {
          planMap[s.user_id] = s.subscription_plans?.slug || null;
        });

        setUsers((profiles || []).map((p: any) => ({
          id: p.id,
          userId: p.user_id,
          email: p.email,
          fullName: p.full_name,
          createdAt: p.created_at,
          currentPlan: planMap[p.user_id] || null,
        })));
      } catch {}
      setLoading(false);
    }
    load();
  }, []);

  async function handleGrantEnterprise(userId: string) {
    if (!password) return;
    setMessage("");
    try {
      const res = await fetch("/api/admin/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });
      const json = await res.json();
      if (json.success) {
        setMessage("Enterprise access granted successfully.");
        setGrantingId(null);
        setPassword("");
        const supabase = createClient();
        const { data: profiles } = await supabase
          .from("user_profiles")
          .select("id, user_id, email, full_name, created_at")
          .order("created_at", { ascending: false });
        const { data: subs } = await supabase
          .from("subscriptions")
          .select("user_id, subscription_plans!inner(slug)")
          .in("status", ["active", "trial"]);
        const planMap: Record<string, string> = {};
        (subs || []).forEach((s: any) => { planMap[s.user_id] = s.subscription_plans?.slug || null; });
        setUsers((profiles || []).map((p: any) => ({
          id: p.id,
          userId: p.user_id,
          email: p.email,
          fullName: p.full_name,
          createdAt: p.created_at,
          currentPlan: planMap[p.user_id] || null,
        })));
      } else {
        setMessage(json.error?.message || "Failed to grant enterprise access.");
      }
    } catch {
      setMessage("Network error.");
    }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Users</h1>
      </div>

      {message && (
        <div style={{
          padding: "10px 16px", borderRadius: 8, marginBottom: 16, fontSize: 14,
          background: message.includes("successfully") ? "#d1fae5" : "#fee2e2",
          color: message.includes("successfully") ? "#065f46" : "#991b1b",
        }}>
          {message}
        </div>
      )}

      {loading ? <p style={{ color: "#666", fontSize: 14 }}>Loading users...</p> : users.length === 0 ? (
        <p style={{ color: "#666", fontSize: 14 }}>No users found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
              <th style={th}>Email</th>
              <th style={th}>Name</th>
              <th style={th}>Plan</th>
              <th style={th}>Joined</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={td}>{u.email || u.userId}</td>
                <td style={td}>{u.fullName || "—"}</td>
                <td style={td}>
                  <span style={{
                    padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 600,
                    background: u.currentPlan === "enterprise" ? "#dbeafe" : "#f3f4f6",
                    color: u.currentPlan === "enterprise" ? "#1e40af" : "#6b7280",
                    textTransform: "capitalize",
                  }}>
                    {u.currentPlan || "none"}
                  </span>
                </td>
                <td style={td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={td}>
                  {grantingId === u.userId ? (
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <input
                        type="password"
                        placeholder="Admin password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                        style={{
                          padding: "6px 10px", borderRadius: 6, border: "1px solid #d1d5db",
                          fontSize: 13, width: 140, outline: "none",
                        }}
                      />
                      <button
                        onClick={() => handleGrantEnterprise(u.userId)}
                        disabled={!password}
                        style={{
                          padding: "6px 12px", borderRadius: 6, border: "none",
                          background: password ? "#2563eb" : "#d1d5db",
                          color: "#fff", fontSize: 12, fontWeight: 600,
                          cursor: password ? "pointer" : "not-allowed",
                        }}
                      >Grant</button>
                      <button
                        onClick={() => { setGrantingId(null); setPassword(""); }}
                        style={{ padding: "6px 8px", borderRadius: 6, border: "none", background: "none", cursor: "pointer", fontSize: 12, color: "#666" }}
                      >Cancel</button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setGrantingId(u.userId)}
                      style={{
                        padding: "6px 12px", borderRadius: 6, border: "1px solid #d1d5db",
                        background: "none", fontSize: 12, fontWeight: 500, cursor: "pointer", color: "#374151",
                      }}
                    >
                      {u.currentPlan === "enterprise" ? "Re-grant Enterprise" : "Grant Enterprise"}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th: React.CSSProperties = { padding: "10px 12px", fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "#666" };
const td: React.CSSProperties = { padding: "10px 12px", fontSize: 13 };
