"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export default function AdminIndustriesPage() {
  const [items, setItems] = useState<Industry[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/industries");
    const json = await res.json();
    if (json.success) setItems(json.data);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!name || !slug) return;
    setLoading(true);
    const url = editingId ? "/api/admin/industries" : "/api/admin/industries";
    const method = editingId ? "PATCH" : "POST";
    const body = editingId ? { id: editingId, name, slug, description: desc } : { name, slug, description: desc };
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setName(""); setSlug(""); setDesc(""); setEditingId(null); setLoading(false);
    load();
  }

  function handleEdit(item: Industry) {
    setEditingId(item.id); setName(item.name); setSlug(item.slug); setDesc(item.description || "");
  }

  async function handleDelete(id: string) {
    await fetch("/api/admin/industries", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 20 }}>Industries</h1>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={inp} />
        <input placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} style={inp} />
        <input placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} style={{ ...inp, flex: 1 }} />
        <Button variant="primary" size="sm" onClick={handleSave} isLoading={loading}>{editingId ? "Update" : "Add"}</Button>
        {editingId && <Button variant="ghost" size="sm" onClick={() => { setEditingId(null); setName(""); setSlug(""); setDesc(""); }}>Cancel</Button>}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead><tr style={{ background: "#f5f5f5", textAlign: "left" }}>
          <th style={th}>Name</th><th style={th}>Slug</th><th style={th}>Description</th><th style={th}>Actions</th>
        </tr></thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={td}>{item.name}</td>
              <td style={td}><code>{item.slug}</code></td>
              <td style={td}>{item.description}</td>
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
