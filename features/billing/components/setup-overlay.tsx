"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { isInSetupMode } from "../api/setup-check";

export function SetupOverlay({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  if (!isInSetupMode()) return <>{children}</>;

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "linear-gradient(135deg, var(--color-role-light-primary), var(--color-palette-primary-30))",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: 12,
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          fontFamily: "var(--font-label-label-medium-fontFamily)",
          fontSize: 14,
        }}
      >
        <span>🔍 Preview mode — Complete your setup to access all features</span>
        <button
          type="button"
          onClick={() => router.push("/onboarding")}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 8,
            padding: "8px 16px",
            color: "#fff",
            cursor: "pointer",
            fontFamily: "var(--font-label-label-medium-fontFamily)",
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Complete Setup <ArrowRight size={14} />
        </button>
      </div>

      <div
        style={{ position: "relative", cursor: "pointer" }}
        onClick={() => router.push("/onboarding")}
      >
        {children}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
}
