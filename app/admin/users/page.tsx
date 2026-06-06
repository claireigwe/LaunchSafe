"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: profiles } = await supabase.from("user_profiles").select("*").order("created_at", { ascending: false });
      if (profiles) setUsers(profiles);
    }
    load();
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20 }}>Users</h1>
      {users.length === 0 ? <p style={{ color: "#666", fontSize: 14 }}>No users found.</p> : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr style={{ background: "#f5f5f5", textAlign: "left" }}>
            <th style={th}>Email</th><th style={th}>Name</th><th style={th}>Joined</th>
          </tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={td}>{u.email || u.user_id}</td>
                <td style={td}>{u.full_name || "—"}</td>
                <td style={td}>{new Date(u.created_at).toLocaleDateString()}</td>
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
