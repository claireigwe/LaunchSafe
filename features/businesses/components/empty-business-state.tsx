import React from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Building2 } from "lucide-react";

export function EmptyBusinessState() {
  const router = useRouter();

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 20px",
      textAlign: "center",
      backgroundColor: "var(--color-role-light-surface)",
      borderRadius: "var(--radius-xl)",
      border: "1px dashed var(--color-role-light-outlineVariant)",
      margin: "40px auto",
      maxWidth: "600px",
      minHeight: "400px"
    }}>
      <div style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "var(--color-role-light-surfaceContainerHigh)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24
      }}>
        <Building2 size={32} color="var(--color-role-light-onSurfaceVariant)" />
      </div>
      
      <h2 style={{
        fontSize: "var(--font-size-heading-small)",
        fontWeight: "var(--font-weight-heading-small)",
        color: "var(--color-role-light-onSurface)",
        marginBottom: 12
      }}>
        No Businesses Found
      </h2>
      
      <p style={{
        fontSize: "var(--font-size-body-large)",
        color: "var(--color-role-light-onSurfaceVariant)",
        marginBottom: 32,
        maxWidth: 400
      }}>
        You need to add a business before you can manage compliance tasks, generate documents, and track your obligations.
      </p>
      
      <button 
        onClick={() => router.push("/business-onboarding?mode=add-business")} 
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          backgroundColor: "var(--color-role-light-primary)",
          color: "var(--color-role-light-onPrimary)",
          padding: "12px 24px",
          borderRadius: "var(--radius-full)",
          fontWeight: 500,
          border: "none",
          cursor: "pointer",
          fontSize: 16
        }}
      >
        <PlusCircle size={20} />
        Add Your First Business
      </button>
    </div>
  );
}
