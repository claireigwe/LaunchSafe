"use client";

import { useState, useRef } from "react";
import { Sparkles, X, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  context?: string;
  placeholder?: string;
}

export function AIAssistant({ context, placeholder = "e.g. What are the compliance requirements for registering a food business in Lagos?" }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit() {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.trim(), context }),
      });
      const json = await res.json();
      if (json.success) {
        setResponse(json.data.content);
      } else {
        setError(json.error?.message || "Request failed");
      }
    } catch {
      setError("Failed to get response");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setOpen(false);
    setResponse(null);
    setError("");
    setQuery("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="ai-trigger"
        style={{
          position: "fixed", bottom: 24, right: 24,
          width: 48, height: 48, borderRadius: 24,
          background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
          color: "white", border: "none",
          cursor: "pointer", display: "flex",
          alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
          zIndex: 80,
        }}
        aria-label="Open compliance inquiry"
      >
        <Sparkles size={20} />
      </button>

      {open && (
        <div
          style={{
            position: "fixed", bottom: 84, right: 24,
            width: 420, maxWidth: "calc(100vw - 48px)",
            background: "white", borderRadius: 16,
            boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
            border: "1px solid #e5e7eb",
            zIndex: 80, display: "flex", flexDirection: "column",
            maxHeight: "70vh",
          }}
        >
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px", borderBottom: "1px solid #e5e7eb",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={16} style={{ color: "#2563eb" }} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>Compliance Inquiry</span>
            </div>
            <button type="button" onClick={handleClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", padding: 4 }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12, flex: 1, overflowY: "auto" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "10px 12px", borderRadius: 8, background: "#fefce8", border: "1px solid #fde68a" }}>
              <AlertTriangle size={14} style={{ color: "#d97706", flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 11, color: "#92400e", margin: 0, lineHeight: 1.4 }}>
                AI responses are for informational purposes only. Always verify compliance requirements with the relevant regulatory agency before taking action.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Your Question</label>
              <textarea
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                disabled={loading}
                rows={3}
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8,
                  border: "1.5px solid #ddd", fontSize: 13,
                  outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box",
                }}
              />
            </div>

            <Button variant="primary" size="md" onClick={handleSubmit} isLoading={loading} fullWidth>
              {loading ? "Getting answer..." : "Get Answer"}
            </Button>

            {error && (
              <div style={{ padding: "10px 12px", borderRadius: 8, background: "#fef2f2", color: "#dc2626", fontSize: 13 }}>{error}</div>
            )}

            {response && (
              <div style={{ padding: 0 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "#374151", display: "block", marginBottom: 8 }}>Answer</label>
                <div style={{
                  padding: "12px 14px", borderRadius: 10,
                  background: "#f0f5ff", border: "1px solid #dbeafe",
                  fontSize: 13, lineHeight: 1.6, color: "#1e293b",
                  whiteSpace: "pre-wrap",
                }}>
                  {response}
                  <p style={{ fontSize: 11, color: "#6b7280", margin: "16px 0 0", padding: "8px 0 0", borderTop: "1px solid #dbeafe" }}>
                    Verify this information with the relevant regulatory agency before acting.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
