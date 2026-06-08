"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Check, ChevronRight, ExternalLink, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getSubscription,
  getPayments,
  getAssessmentPurchases,
  cancelSubscription,
  clearPendingChange,
  getPlanFeatures,
  getPlanPrice,
  getPlanAnnualTotal,
  formatCurrency,
  type SavedSubscription,
} from "../api/billing-api";
import { trackEvent } from "@/features/assessments/api/assessment-api";
import styles from "./billing-page.module.css";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "statusActive" },
  trialing: { label: "Trialing", className: "statusTrialing" },
  past_due: { label: "Past Due", className: "statusWarning" },
  cancelled: { label: "Cancelled", className: "statusMuted" },
  expired: { label: "Expired", className: "statusMuted" },
  suspended: { label: "Suspended", className: "statusError" },
};

const PLANS = [
  { id: "starter", name: "Starter", monthly: 10000, annual: 8500, annualTotal: 102000, badge: null },
  { id: "growth", name: "Growth", monthly: 20000, annual: 18000, annualTotal: 216000, badge: "Most Popular" },
  { id: "enterprise", name: "Enterprise", monthly: 35000, annual: 32000, annualTotal: 384000, badge: null },
];

export function BillingPage() {
  const router = useRouter();
  const [sub, setSub] = useState<SavedSubscription | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [showCancel, setShowCancel] = useState(false);

  useEffect(() => {
    setSub(getSubscription());
    setPayments(getPayments());
    setPurchases(getAssessmentPurchases());
    trackEvent("Billing Page Viewed");
  }, []);

  const statusInfo = sub ? STATUS_LABELS[sub.status] || STATUS_LABELS.active : null;
  const isActive = sub?.status === "active";

  function handleCancel() {
    cancelSubscription();
    setSub(getSubscription());
    setShowCancel(false);
    trackEvent("Subscription Cancelled");
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Billing</h1>
          <p className={styles.subtitle}>Manage your subscription and payment history.</p>
        </div>
      </div>

      {/* Section 1: Current Subscription */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <CreditCard size={16} className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>Current Subscription</h2>
        </div>
        {sub ? (
          <>
            <div className={styles.subCardWrap}>
              <div className={styles.subCard}>
                <div className={styles.subRow}>
                  <span className={styles.subLabel}>Plan</span>
                  <span className={styles.subValue}>{sub.planName}</span>
                </div>
                <div className={styles.subRow}>
                  <span className={styles.subLabel}>Billing</span>
                  <span className={styles.subValue}>{sub.billingCycle === "annual" ? "Annual" : "Monthly"}</span>
                </div>
                <div className={styles.subRow}>
                  <span className={styles.subLabel}>Status</span>
                  <span className={`${styles.statusBadge} ${statusInfo ? styles[statusInfo.className] : ""}`}>{statusInfo?.label || sub.status}</span>
                </div>
                <div className={styles.subRow}>
                  <span className={styles.subLabel}>Started</span>
                  <span className={styles.subValue}>{formatDate(sub.startDate)}</span>
                </div>
                {sub.nextRenewal && (
                  <div className={styles.subRow}>
                    <span className={styles.subLabel}>Next Renewal</span>
                    <span className={styles.subValue}>{formatDate(sub.nextRenewal)}</span>
                  </div>
                )}
              </div>
            </div>
            {sub.pendingPlanId && (
              <div className={styles.pendingBanner}>
                <Clock size={16} className={styles.pendingIcon} />
                <div className={styles.pendingBody}>
                  <span className={styles.pendingTitle}>Plan change scheduled</span>
                  <span className={styles.pendingText}>Switching to <strong>{sub.pendingPlanName}</strong> at next renewal ({formatDate(sub.nextRenewal)}).</span>
                </div>
                <button type="button" className={styles.pendingCancel} onClick={() => { clearPendingChange(); setSub(getSubscription()); }}>Cancel</button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.emptyCard}>
            <p className={styles.emptyText}>No active subscription found.</p>
            <Link href="/business-onboarding"><Button variant="primary" size="sm">Choose a Plan</Button></Link>
          </div>
        )}
      </section>

      {/* Section 2: Plan Details */}
      {sub && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <Check size={16} className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Plan Details — {sub.planName}</h2>
          </div>
          <div className={styles.featuresList}>
            {getPlanFeatures(sub.planId).map((f) => (
              <div key={f} className={styles.featureRow}>
                <Check size={14} className={styles.checkIcon} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 3: Plan Management */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <ChevronRight size={16} className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>Plan Management</h2>
        </div>
        <div className={styles.plansGrid}>
          {PLANS.map((plan) => {
            const isCurrent = sub?.planId === plan.id;
            return (
              <div key={plan.id} className={`${styles.planCard} ${isCurrent ? styles.planCurrent : ""}`}>
                {plan.badge && <span className={styles.planBadge}>{plan.badge}</span>}
                <h3 className={styles.planName}>{plan.name}</h3>
                <div className={styles.planPrice}>
                  <span className={styles.priceValue}>{formatCurrency(plan.monthly)}</span>
                  <span className={styles.pricePeriod}>/month</span>
                </div>
                <div className={styles.planAnnual}>
                  {formatCurrency(plan.annual)}/month · {formatCurrency(plan.annualTotal)} billed annually
                </div>
                {isCurrent && <span className={styles.currentBadge}>Current Plan</span>}
                {!isCurrent && isActive && <Button variant="outline" size="sm" fullWidth onClick={() => router.push("/business-onboarding?mode=change-plan")}>Switch Plan</Button>}
              </div>
            );
          })}
        </div>
        {isActive && (
          <div className={styles.dangerZone}>
            <button type="button" className={styles.cancelBtn} onClick={() => setShowCancel(true)}>Cancel Subscription</button>
          </div>
        )}
      </section>

      {/* Cancel confirmation */}
      {showCancel && (
        <div className={styles.overlay} onClick={() => setShowCancel(false)}>
          <div className={styles.confirmModal} onClick={(e) => e.stopPropagation()}>
            <AlertCircle size={24} className={styles.warnIcon} />
            <h3 className={styles.confirmTitle}>Cancel Subscription?</h3>
            <p className={styles.confirmText}>Your subscription will remain active until the end of the current billing period. After that, you will lose access to compliance management features.</p>
            <div className={styles.confirmActions}>
              <Button type="button" variant="ghost" size="md" onClick={() => setShowCancel(false)}>Keep Subscription</Button>
              <Button type="button" variant="destructive" size="md" onClick={handleCancel}>Cancel Anyway</Button>
            </div>
          </div>
        </div>
      )}

      {/* Section 5: Billing History */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <CreditCard size={16} className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>Billing History</h2>
        </div>
        {payments.length > 0 ? (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span className={styles.th}>Date</span>
              <span className={styles.th}>Description</span>
              <span className={styles.th}>Amount</span>
              <span className={styles.th}>Status</span>
              <span className={styles.th}>Reference</span>
            </div>
            {payments.map((p) => (
              <div key={p.id} className={styles.tableRow}>
                <span className={styles.td}>{formatDate(p.createdAt)}</span>
                <span className={styles.td}>{p.description}</span>
                <span className={styles.td}>{formatCurrency(p.amount)}</span>
                <span className={styles.td}><span className={`${styles.payBadge} ${styles[`pay_${p.status}`]}`}>{p.status}</span></span>
                <span className={`${styles.td} ${styles.refCell}`}>{p.reference}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyCard}>
            <p className={styles.emptyText}>No payment history available.</p>
          </div>
        )}
      </section>

      {/* Section: Assessment Purchases */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <CreditCard size={16} className={styles.sectionIcon} />
          <h2 className={styles.sectionTitle}>Assessment Purchases</h2>
        </div>
        {purchases.length > 0 ? (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span className={styles.th}>Date</span>
              <span className={styles.th}>Report</span>
              <span className={styles.th}>Amount</span>
              <span className={styles.th}>Status</span>
            </div>
            {purchases.map((p) => (
              <div key={p.id} className={styles.tableRow}>
                <span className={styles.td}>{formatDate(p.createdAt)}</span>
                <span className={styles.td}>{p.reportName}</span>
                <span className={styles.td}>{formatCurrency(p.amount)}</span>
                <span className={styles.td}><span className={`${styles.payBadge} ${styles[`pay_${p.status}`]}`}>{p.status}</span></span>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyCard}>
            <p className={styles.emptyText}>No report purchases found.</p>
          </div>
        )}
      </section>
    </div>
  );
}
