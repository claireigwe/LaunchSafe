"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, X, Loader2 } from "lucide-react";

interface Props {
  context?: string;
  placeholder?: string;
}

export function AIAssistant({ context, placeholder = "Ask about compliance requirements..." }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
        aria-label="Open AI assistant"
      >
        <Sparkles size={20} />
      </button>

      {open && (
        <div
          style={{
            position: "fixed", bottom: 84, right: 24,
            width: 380, maxWidth: "calc(100vw - 48px)",
            background: "white", borderRadius: 16,
            boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
            border: "1px solid #e5e7eb",
            zIndex: 80, display: "flex", flexDirection: "column",
            maxHeight: "60vh", overflow: "hidden",
          }}
        >
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 16px", borderBottom: "1px solid #e5e7eb",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Sparkles size={16} style={{ color: "#2563eb" }} />
              <span style={{ fontWeight: 600, fontSize: 14 }}>AI Compliance Assistant</span>
            </div>
            <button type="button" onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#999", padding: 4 }}>
              <X size={16} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
            <p style={{ fontSize: 12, color: "#999", margin: "0 0 12px", lineHeight: 1.4 }}>
              Ask about compliance requirements, regulations, or get help understanding obligations. AI responses should be verified with official sources.
            </p>

            {error && (
              <div style={{ padding: "10px 12px", borderRadius: 8, background: "#fef2f2", color: "#dc2626", fontSize: 13, marginBottom: 12 }}>{error}</div>
            )}

            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, color: "#666", fontSize: 13 }}>
                <Loader2 size={14} className="spin" />
                Getting answer...
              </div>
            )}

            {response && (
              <div style={{
                padding: "12px 14px", borderRadius: 10,
                background: "#f0f5ff", border: "1px solid #dbeafe",
                fontSize: 13, lineHeight: 1.6, color: "#1e293b",
                whiteSpace: "pre-wrap", marginBottom: 12,
              }}>
                {response}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} style={{ padding: "12px 16px", borderTop: "1px solid #e5e7eb", display: "flex", gap: 8 }}>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              disabled={loading}
              style={{
                flex: 1, padding: "10px 12px", borderRadius: 8,
                border: "1.5px solid #ddd", fontSize: 13,
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              style={{
                width: 36, height: 36, borderRadius: 8,
                background: loading ? "#ddd" : "#2563eb",
                color: "white", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {loading ? <Loader2 size={14} className="spin" /> : <Send size={14} />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
