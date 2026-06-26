"use client";

import { useState, useEffect } from "react";
import { getBillingData, cancelSubscription } from "../api/billing-api";
import { trackEvent } from "@/lib/analytics/track";
import type { SavedSubscription, SavedPayment, SavedAssessmentPurchase, SubscriptionPlan } from "@/types/domain/billing";
import { ContactSalesModal } from "./contact-sales-modal";
import { CurrentSubscription, PlanFeatures } from "./current-subscription";
import { PlanManagement } from "./plan-management";
import { CancelSubscriptionModal } from "./cancel-modal";
import { BillingHistoryTable } from "./billing-history-table";
import { AssessmentPurchasesTable } from "./assessment-purchases-table";
import styles from "./billing-page.module.css";

export function BillingPage() {
  const [sub, setSub] = useState<SavedSubscription | null>(null);
  const [payments, setPayments] = useState<SavedPayment[]>([]);
  const [purchases, setPurchases] = useState<SavedAssessmentPurchase[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [showCancel, setShowCancel] = useState(false);
  const [showContactSales, setShowContactSales] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [data, plansRes] = await Promise.all([
        getBillingData(),
        fetch("/api/billing/plans").then(r => r.json()).catch(() => ({ data: [] as SubscriptionPlan[] })),
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

  async function handleCancel() {
    await cancelSubscription();
    const data = await getBillingData();
    setSub(data.subscription);
    setShowCancel(false);
    trackEvent("Subscription Cancelled");
  }

  const isActive = sub?.status === "active";
  const currentPlan = plans.find((p) => p.slug === sub?.planId);

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

      <CurrentSubscription sub={sub} />
      {sub && currentPlan && <PlanFeatures planName={sub.planName} features={currentPlan.features || []} />}

      <PlanManagement
        plans={plans}
        sub={sub}
        isActive={isActive}
        onSwitchPlan={() => window.location.href = "/business-onboarding?mode=change-plan"}
        onContactSales={() => setShowContactSales(true)}
        onCancelSubscription={() => setShowCancel(true)}
      />

      {showCancel && (
        <CancelSubscriptionModal onClose={() => setShowCancel(false)} onConfirm={handleCancel} />
      )}

      <BillingHistoryTable payments={payments} />
      <AssessmentPurchasesTable purchases={purchases} />

      {showContactSales && <ContactSalesModal onClose={() => setShowContactSales(false)} />}
    </div>
  );
}
