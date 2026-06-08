import React from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyBusinessState() {
  const router = useRouter();

  return (
    <div style={{
      textAlign: "center",
      padding: "80px 24px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 12,
      maxWidth: 600,
      margin: "0 auto",
    }}>
      <Building2 size={48} color="var(--color-role-light-outlineVariant)" />
      <h2 style={{
        fontFamily: "var(--font-headline-headline-small-fontFamily)",
        fontSize: 22,
        fontWeight: 600,
        color: "var(--color-role-light-onSurface)",
        margin: 0,
      }}>
        No Businesses Found
      </h2>
      <p style={{
        fontFamily: "var(--font-body-body-medium-fontFamily)",
        fontSize: 15,
        color: "var(--color-role-light-onSurfaceVariant)",
        margin: 0,
      }}>
        You need to add a business before you can manage compliance tasks, generate documents, and track your obligations.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <Button variant="primary" size="md" onClick={() => router.push("/business-onboarding?mode=add-business")}>
          Add Your First Business
        </Button>
      </div>
    </div>
  );
}
