"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Update { id: string; title: string; summary: string; source: string; impact_level: string; is_published: boolean; }

export default function AdminUpdatesPage() {
  const [items, setItems] = useState<Update[]>([]);
  const [title, setTitle] = useState(""); const [summary, setSummary] = useState(""); const [source, setSource] = useState("");
  const [impact, setImpact] = useState("medium"); const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() { const r = await fetch("/api/admin/updates"); const j = await r.json(); if (j.success) setItems(j.data); }
  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!title || !summary || !source) return; setLoading(true);
    const method = editingId ? "PATCH" : "POST";
    const body = editingId ? { id: editingId, title, summary, source, impactLevel: impact, isPublished: true }
      : { title, summary, source, impactLevel: impact, effectiveDate: new Date().toISOString(), sourceUrl: null };
    await fetch("/api/admin/updates", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setTitle(""); setSummary(""); setSource(""); setImpact("medium"); setEditingId(null); setLoading(false); load();
  }

  function handleEdit(item: Update) { setEditingId(item.id); setTitle(item.title); setSummary(item.summary); setSource(item.source); setImpact(item.impact_level); }
  async function handleDelete(id: string) { await fetch("/api/admin/updates", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) }); load(); }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20 }}>Regulatory Updates</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} style={{ ...inp, flex: 2 }} />
          <input placeholder="Source" value={source} onChange={(e) => setSource(e.target.value)} style={{ ...inp, flex: 1 }} />
          <select value={impact} onChange={(e) => setImpact(e.target.value)} style={inp}>
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
          </select>
        </div>
        <textarea placeholder="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} style={{ ...inp, resize: "vertical" }} />
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="primary" size="sm" onClick={handleSave} isLoading={loading}>{editingId ? "Update" : "Publish"}</Button>
          {editingId && <Button variant="ghost" size="sm" onClick={() => { setEditingId(null); setTitle(""); setSummary(""); setSource(""); setImpact("medium"); }}>Cancel</Button>}
        </div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr style={{ background: "#f5f5f5", textAlign: "left" }}>
          <th style={th}>Title</th><th style={th}>Source</th><th style={th}>Impact</th><th style={th}>Actions</th>
        </tr></thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={td}>{item.title}</td><td style={td}>{item.source}</td>
              <td style={td}><span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: item.impact_level === "high" ? "#fef2f2" : item.impact_level === "medium" ? "#fefce8" : "#f5f5f5", color: item.impact_level === "high" ? "#dc2626" : item.impact_level === "medium" ? "#d97706" : "#666" }}>{item.impact_level}</span></td>
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

const inp: React.CSSProperties = { padding: "8px 12px", borderRadius: 8, border: "1.5px solid #ddd", fontSize: 13 };
const th: React.CSSProperties = { padding: "10px 12px", fontSize: 12, fontWeight: 600, textTransform: "uppercase", color: "#666" };
const td: React.CSSProperties = { padding: "10px 12px", fontSize: 13 };
const btnStyle: React.CSSProperties = { background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#2563eb", padding: "4px 8px" };
