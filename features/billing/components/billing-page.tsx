"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Check, ChevronRight, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getBillingData,
  cancelSubscription,
  formatCurrency,
} from "../api/billing-api";
import type { SavedSubscription, SavedPayment, SavedAssessmentPurchase } from "@/types/domain/billing";
import { trackEvent } from "@/lib/analytics/track";
import { initiateSubscriptionPayment } from "@/features/businesses/api/onboarding-api";
import { ContactSalesModal } from "./contact-sales-modal";
import styles from "./billing-page.module.css";

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "statusActive" },
  trialing: { label: "Trialing", className: "statusTrialing" },
  past_due: { label: "Past Due", className: "statusWarning" },
  cancelled: { label: "Cancelled", className: "statusMuted" },
  expired: { label: "Expired", className: "statusMuted" },
  suspended: { label: "Suspended", className: "statusError" },
};

export function BillingPage() {
  const router = useRouter();
  const [sub, setSub] = useState<SavedSubscription | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);
  const [showCancel, setShowCancel] = useState(false);
  const [showContactSales, setShowContactSales] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [data, plansRes] = await Promise.all([
        getBillingData(),
        fetch("/api/billing/plans").then(r => r.json()).catch(() => ({ data: [] })),
      ]);
      setSub(data.subscription);
      setPayments(data.payments);
      setPurchases(data.purchases);
      setPlans(plansRes.data || []);
      setLoading(false);
    }
    load().catch(() => setLoading(false));
    trackEvent("Billing Page Viewed");
  }, []);

  const statusInfo = sub ? STATUS_LABELS[sub.status] || STATUS_LABELS.active : null;
  const isActive = sub?.status === "active";

  async function handleCancel() {
    await cancelSubscription();
    const data = await getBillingData();
    setSub(data.subscription);
    setShowCancel(false);
    trackEvent("Subscription Cancelled");
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div className="sk" style={{ width: 120, height: 28, marginBottom: 8 }} />
          <div className="sk" style={{ width: 280, height: 16 }} />
        </div>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className="sk" style={{ width: 160, height: 18 }} />
          </div>
          <div className="sk" style={{ width: "100%", height: 200, marginTop: 16 }} />
        </section>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className="sk" style={{ width: 140, height: 18 }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginTop: 16 }}>
            {[1,2,3].map((i) => <div key={i} className="sk" style={{ height: 180 }} />)}
          </div>
        </section>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className="sk" style={{ width: 120, height: 18 }} />
          </div>
          <div className="sk" style={{ width: "100%", height: 120, marginTop: 16 }} />
        </section>
      </div>
    );
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
            {(plans.find((p: any) => p.slug === sub?.planId)?.features || []).map((f: string) => (
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
          {[
            { slug: "starter", name: "Starter", badge: null, isEnterprise: false },
            { slug: "growth", name: "Growth", badge: "Most Popular", isEnterprise: false },
            { slug: "enterprise", name: "Enterprise", badge: null, isEnterprise: true },
          ].map((meta) => {
            const plan = plans.find((p: any) => p.slug === meta.slug);
            // DB stores prices in kobo; divide by 100 for display
            const monthlyAmount = (plan?.priceMonthly || 0) / 100;
            const annualTotalAmount = (plan?.priceYearly || 0) / 100;
            const annualMonthlyAmount = annualTotalAmount / 12;
            const isCurrent = sub?.planId === meta.slug;
            return (
              <div key={meta.slug} className={`${styles.planCard} ${isCurrent ? styles.planCurrent : ""}`}>
                {meta.badge && <span className={styles.planBadge}>{meta.badge}</span>}
                <h3 className={styles.planName}>{plan?.name || meta.name}</h3>
                {!meta.isEnterprise ? (
                  <>
                    <div className={styles.planPrice}>
                      <span className={styles.priceValue}>{formatCurrency(monthlyAmount)}</span>
                      <span className={styles.pricePeriod}>/month</span>
                    </div>
                    <div className={styles.planAnnual}>
                      {formatCurrency(annualMonthlyAmount)}/month · {formatCurrency(annualTotalAmount)} billed annually
                    </div>
                  </>
                ) : (
                  <div className={styles.planPrice}>
                    <span className={styles.priceValue} style={{ fontSize: 18 }}>Contact Sales</span>
                  </div>
                )}
                {isCurrent && <span className={styles.currentBadge}>Current Plan</span>}
                {isCurrent && meta.slug === "enterprise" && !sub?.paystackSubscriptionCode && (
                  <Button variant="primary" size="sm" fullWidth onClick={async () => {
                    try {
                      const { authorizationUrl } = await initiateSubscriptionPayment("enterprise", "monthly");
                      window.location.href = authorizationUrl;
                    } catch {
                      alert("Failed to initiate payment. Please try again.");
                    }
                  }}>
                    Set up Payment
                  </Button>
                )}
                {!isCurrent && isActive && !meta.isEnterprise && <Button variant="outline" size="sm" fullWidth onClick={() => router.push("/business-onboarding?mode=change-plan")}>Switch Plan</Button>}
                {!isCurrent && isActive && meta.isEnterprise && <Button variant="outline" size="sm" fullWidth onClick={() => setShowContactSales(true)}>Contact Sales</Button>}
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
        {payments.filter((p) => p.paymentType === "subscription").length > 0 ? (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span className={styles.th}>Date</span>
              <span className={styles.th}>Description</span>
              <span className={styles.th}>Amount</span>
              <span className={styles.th}>Status</span>
              <span className={styles.th}>Reference</span>
            </div>
            {payments.filter((p) => p.paymentType === "subscription").map((p) => (
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

      {showContactSales && <ContactSalesModal onClose={() => setShowContactSales(false)} />}
    </div>
  );
}
