"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Agency { id: string; name: string; acronym: string | null; website: string | null; countries?: { name: string } | null; }

export default function AdminAgenciesPage() {
  const [items, setItems] = useState<Agency[]>([]);
  const [name, setName] = useState("");
  const [acronym, setAcronym] = useState("");
  const [website, setWebsite] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() { const r = await fetch("/api/admin/agencies"); const j = await r.json(); if (j.success) setItems(j.data); }
  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!name) return; setLoading(true);
    const method = editingId ? "PATCH" : "POST";
    const body = editingId ? { id: editingId, name, acronym, website } : { name, acronym, website, countryId: "00000000-0000-0000-0000-000000000000" };
    await fetch("/api/admin/agencies", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setName(""); setAcronym(""); setWebsite(""); setEditingId(null); setLoading(false); load();
  }

  function handleEdit(item: Agency) { setEditingId(item.id); setName(item.name); setAcronym(item.acronym || ""); setWebsite(item.website || ""); }
  async function handleDelete(id: string) { await fetch("/api/admin/agencies", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); load(); }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20 }}>Agencies</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={inp} />
        <input placeholder="Acronym" value={acronym} onChange={(e) => setAcronym(e.target.value)} style={{ ...inp, width: 100 }} />
        <input placeholder="Website" value={website} onChange={(e) => setWebsite(e.target.value)} style={{ ...inp, flex: 1 }} />
        <Button variant="primary" size="sm" onClick={handleSave} isLoading={loading}>{editingId ? "Update" : "Add"}</Button>
        {editingId && <Button variant="ghost" size="sm" onClick={() => { setEditingId(null); setName(""); setAcronym(""); setWebsite(""); }}>Cancel</Button>}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr style={{ background: "#f5f5f5", textAlign: "left" }}>
          <th style={th}>Name</th><th style={th}>Acronym</th><th style={th}>Website</th><th style={th}>Actions</th>
        </tr></thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={td}>{item.name}</td>
              <td style={td}>{item.acronym}</td>
              <td style={td}>{item.website}</td>
              <td style={td}>
                <button onClick={() => handleEdit(item)} style={btnStyle}>Edit</button>
                <button onClick={() => handleDelete(item.id)} style={{ ...btnStyle, color: "#dc2626" }}>Delete</button>
              </td>
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
