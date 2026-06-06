"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const router = useRouter();
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState("");

  async function handleSeed() {
    setSeeding(true);
    setSeedResult("");
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const json = await res.json();
      setSeedResult(json.success ? "Database seeded successfully." : `Error: ${json.error?.message}`);
    } catch {
      setSeedResult("Seed failed");
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>Admin Dashboard</h1>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>Manage regulatory data and platform settings.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 32 }}>
        <Card label="Industries" desc="Manage business industries" onClick={() => router.push("/admin/industries")} />
        <Card label="Agencies" desc="Manage regulatory agencies" onClick={() => router.push("/admin/agencies")} />
        <Card label="Requirements" desc="Manage compliance requirements" onClick={() => router.push("/admin/requirements")} />
        <Card label="Regulatory Updates" desc="Publish regulatory updates" onClick={() => router.push("/admin/updates")} />
      </div>

      <div style={{ padding: 20, border: "1px solid #eee", borderRadius: 12, background: "#fafafa" }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 4px" }}>Seed Database</h2>
        <p style={{ fontSize: 13, color: "#666", margin: "0 0 12px" }}>Import hardcoded data (industries, plans, updates) into the database.</p>
        <Button variant="outline" size="sm" onClick={handleSeed} isLoading={seeding}>Run Seed</Button>
        {seedResult && <p style={{ fontSize: 13, marginTop: 8, color: seedResult.includes("Error") ? "#dc2626" : "#16a34a" }}>{seedResult}</p>}
      </div>
    </div>
  );
}

function Card({ label, desc, onClick }: { label: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ padding: 20, borderRadius: 12, border: "1px solid #eee", background: "white", cursor: "pointer", textAlign: "left", fontFamily: "inherit" }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, margin: "0 0 4px" }}>{label}</h3>
      <p style={{ fontSize: 13, color: "#666", margin: 0 }}>{desc}</p>
    </button>
  );
}
