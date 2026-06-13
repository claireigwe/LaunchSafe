import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Settings, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { canAccess, getCurrentPlanName, getCurrentPlanId, getPlanLimit } from "@/features/billing/api/feature-access";
import type { Business } from "@/types/domain/business";
import styles from "./business-overview.module.css";

interface Props {
  business: Business | null;
  businessCount?: number;
}

export function BusinessOverview({ business, businessCount = 1 }: Props) {
  const router = useRouter();
  const planId = getCurrentPlanId();
  const planName = getCurrentPlanName();
  const canAdd = canAccess("multi_business");
  const planLoaded = planId !== null;
  const limit = getPlanLimit("businesses");
  const atLimit = planLoaded && limit > 0 && businessCount >= limit;

  if (!business) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <Building2 size={16} className={styles.icon} />
          <h2 className={styles.title}>Business</h2>
        </div>
        <div className={styles.empty}>
          <p className={styles.emptyText}>No business profile set up yet.</p>
          <Link href="/business-onboarding" tabIndex={-1}>
            <Button variant="primary" size="sm">Add Business</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Building2 size={16} className={styles.icon} />
        <h2 className={styles.title}>Business Overview</h2>
        <Link href="/business" className={styles.settingsLink} aria-label="Business settings">
          <Settings size={16} />
        </Link>
      </div>
      <div className={styles.body}>
        <h3 className={styles.businessName}>{business.name}</h3>
        <p className={styles.businessMeta}>{business.description || "No description"}</p>
        {planLoaded && !canAdd && (
          <div className={styles.limitNotice}>
            <span>{businessCount} business{businessCount > 1 ? "es" : ""} on your {planName || "current"} plan.</span>
            <button type="button" className={styles.upgradeLink} onClick={() => router.push("/business-onboarding?mode=change-plan")}>
              <ArrowUp size={12} /> Upgrade
            </button>
          </div>
        )}
        {planLoaded && atLimit && (
          <div className={styles.limitNotice}>
            <span>You have reached the limit of {limit} business{limit > 1 ? "es" : ""} on your {planName} plan.</span>
            <button type="button" className={styles.upgradeLink} onClick={() => router.push("/business-onboarding?mode=change-plan")}>
              <ArrowUp size={12} /> Upgrade
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
