import { Button } from "@/components/ui/button";
import styles from "./dashboard-page.module.css";

interface Props {
  sub: {
    planName: string;
    status: string;
    nextRenewal: string | null;
  };
}

export function SubscriptionStatus({ sub }: Props) {
  return (
    <div className={styles.card} style={{ padding: 24 }}>
      <h3 style={{ fontFamily: "var(--font-title-title-large-fontFamily)", fontSize: 18, fontWeight: 600, color: "var(--color-role-light-onSurface)", margin: "0 0 20px" }}>Subscription</h3>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontFamily: "var(--font-body-body-large-fontFamily)", fontSize: 15, color: "var(--color-role-light-onSurfaceVariant)" }}>Plan</span>
        <span style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, color: "var(--color-role-light-onSurface)" }}>{sub.planName}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span style={{ fontFamily: "var(--font-body-body-large-fontFamily)", fontSize: 15, color: "var(--color-role-light-onSurfaceVariant)" }}>Status</span>
        <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, fontWeight: 600, padding: "4px 12px", borderRadius: 8, background: "var(--color-role-light-successContainer)", color: "var(--color-role-light-onSuccessContainer)" }}>{sub.status}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <span style={{ fontFamily: "var(--font-body-body-large-fontFamily)", fontSize: 15, color: "var(--color-role-light-onSurfaceVariant)" }}>Next Renewal</span>
        <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 14, fontWeight: 500, color: "var(--color-role-light-onSurface)" }}>{sub.nextRenewal ? new Date(sub.nextRenewal).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span>
      </div>
      <Button variant="outline" fullWidth style={{ borderRadius: 12 }}>Manage Billing</Button>
    </div>
  );
}
