"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Req { id: string; name: string; description: string; requirement_type: string; frequency: string; agencies?: { name: string; acronym: string } | null; industries?: { name: string } | null; }

export default function AdminRequirementsPage() {
  const [items, setItems] = useState<Req[]>([]);
  const [name, setName] = useState(""); const [desc, setDesc] = useState(""); const [loading, setLoading] = useState(false);

  async function load() { const r = await fetch("/api/admin/requirements"); const j = await r.json(); if (j.success) setItems(j.data); }
  useEffect(() => { load(); }, []);

  async function handleAdd() {
    if (!name) return; setLoading(true);
    await fetch("/api/admin/requirements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description: desc, agencyId: "00000000-0000-0000-0000-000000000000", industryId: "00000000-0000-0000-0000-000000000000" }) });
    setName(""); setDesc(""); setLoading(false); load();
  }

  async function handleDelete(id: string) {
    await fetch("/api/admin/requirements", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); load();
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20 }}>Requirements</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={inp} />
        <input placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} style={{ ...inp, flex: 1 }} />
        <Button variant="primary" size="sm" onClick={handleAdd} isLoading={loading}>Add</Button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr style={{ background: "#f5f5f5", textAlign: "left" }}>
          <th style={th}>Name</th><th style={th}>Type</th><th style={th}>Frequency</th><th style={th}>Agency</th><th style={th}>Industry</th><th style={th}>Actions</th>
        </tr></thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={td}>{item.name}</td>
              <td style={td}>{item.requirement_type}</td>
              <td style={td}>{item.frequency}</td>
              <td style={td}>{item.agencies?.name || "—"}</td>
              <td style={td}>{item.industries?.name || "—"}</td>
              <td style={td}><button onClick={() => handleDelete(item.id)} style={{ ...btnStyle, color: "#dc2626" }}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const inp: React.CSSProperties = { padding: "8px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 13, minWidth: 150 };
const th: React.CSSProperties = { padding: "10px 12px", fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "#666" };
const td: React.CSSProperties = { padding: "10px 12px", fontSize: 13 };
const btnStyle: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#2563eb", padding: "4px 8px" };
