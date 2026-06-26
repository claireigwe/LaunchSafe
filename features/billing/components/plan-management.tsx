"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "../api/billing-api";
import type { SavedSubscription, SubscriptionPlan } from "@/types/domain/billing";
import pageStyles from "./billing-page.module.css";
import styles from "./plan-management.module.css";

const PLAN_META = [
  { slug: "starter", name: "Starter", badge: null as string | null, isEnterprise: false },
  { slug: "growth", name: "Growth", badge: "Most Popular", isEnterprise: false },
  { slug: "enterprise", name: "Enterprise", badge: null, isEnterprise: true },
];

interface Props {
  plans: SubscriptionPlan[];
  sub: SavedSubscription | null;
  isActive: boolean;
  onSwitchPlan: () => void;
  onContactSales: () => void;
  onCancelSubscription: () => void;
}

export function PlanManagement({ plans, sub, isActive, onSwitchPlan, onContactSales, onCancelSubscription }: Props) {
  return (
    <section className={pageStyles.section}>
      <div className={pageStyles.sectionHeader}>
        <ChevronRight size={16} className={pageStyles.sectionIcon} />
        <h2 className={pageStyles.sectionTitle}>Plan Management</h2>
      </div>
      <div className={styles.plansGrid}>
        {PLAN_META.map((meta) => {
          const plan = plans.find((p) => p.slug === meta.slug);
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
              {!isCurrent && isActive && !meta.isEnterprise && (
                <Button variant="outline" size="sm" fullWidth onClick={onSwitchPlan}>Switch Plan</Button>
              )}
              {!isCurrent && isActive && meta.isEnterprise && (
                <Button variant="outline" size="sm" fullWidth onClick={onContactSales}>Contact Sales</Button>
              )}
            </div>
          );
        })}
      </div>
      {isActive && sub && (
        <div className={styles.dangerZone}>
          <button type="button" className={styles.cancelBtn} onClick={onCancelSubscription}>Cancel Subscription</button>
        </div>
      )}
    </section>
  );
}
