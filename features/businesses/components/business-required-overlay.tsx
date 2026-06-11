"use client";

import { useRouter } from "next/navigation";
import { Building2, ArrowRight } from "lucide-react";

interface Props {
  hasBusiness: boolean | null;
  children: React.ReactNode;
}

export function BusinessRequiredOverlay({ hasBusiness, children }: Props) {
  const router = useRouter();

  if (hasBusiness !== false) return <>{children}</>;

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
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Building2 size={16} />
          Add a business to start managing compliance tasks, documents, and tracking obligations.
        </span>
        <button
          type="button"
          onClick={() => router.push("/business-onboarding?mode=add-business")}
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
          Add Business <ArrowRight size={14} />
        </button>
      </div>

      <div style={{ position: "relative" }}>
        {children}
      </div>
    </div>
  );
}
