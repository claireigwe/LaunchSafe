"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { initiateSubscriptionPayment, saveBusinessData } from "../../api/onboarding-api";
import { logActivity } from "@/features/activity/api/activity-api";
import { audit } from "@/features/audit/api/audit-api";
import styles from "./payment-processing.module.css";

import { getPlanById } from "../../data/subscription-plans";
import type { OnboardingData } from "../../types/onboarding.types";

interface Props {
  planId: string | null;
  isAnnual: boolean;
  onboardingData: OnboardingData;
  isChangePlan?: boolean;
  onComplete: () => void;
  onBack: () => void;
}

export function PaymentProcessing({ planId, isAnnual, onboardingData, isChangePlan, onComplete, onBack }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const plan = planId ? getPlanById(planId) : null;
  const displayAmount = plan ? (isAnnual ? `₦${plan.annualTotal.toLocaleString()}` : `₦${plan.monthlyPrice.toLocaleString()}`) : "—";
  const billingCycle = isAnnual ? "annual" : "monthly";

  async function handlePay() {
    if (!planId) return;
    setLoading(true);
    setError("");
    try {
      if (!isChangePlan) {
        // Save business data — will be created after subscription payment
        localStorage.setItem("launchsafe-pending-business", JSON.stringify(onboardingData));
        saveBusinessData({ ...onboardingData, _savedAt: new Date().toISOString() });
      }
      logActivity("subscription_activated", "Subscription Activated", `${plan!.name} Plan - ${billingCycle === "annual" ? "Annual" : "Monthly"}`);
      audit.subscriptionActivated(`${plan!.name} (${billingCycle})`);
      const { authorizationUrl } = await initiateSubscriptionPayment(planId, billingCycle);
      window.location.href = authorizationUrl;
    } catch {
      setError("Payment initiation failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.lockIcon}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="8" y="14" width="16" height="13" rx="2" stroke="var(--color-role-light-primary)" strokeWidth="2" />
            <path d="M12 14V10C12 7.8 13.8 6 16 6C18.2 6 20 7.8 20 10V14" stroke="var(--color-role-light-primary)" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <h2 className={styles.title}>Secure Payment</h2>
        <p className={styles.subtitle}>Your payment is processed securely through Paystack.</p>
      </div>

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span>Plan</span>
          <span className={styles.summaryValue}>{plan ? `${plan.name} Plan` : "Not selected"}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Billing</span>
          <span className={styles.summaryValue}>{isAnnual ? "Annual" : "Monthly"}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>Amount due now</span>
          <span className={styles.summaryValue}>{displayAmount}</span>
        </div>
        {isAnnual && plan && (
          <div className={styles.summaryRow}>
            <span>Rate after renewal</span>
            <span className={styles.summaryValue}>₦{plan.annualTotal.toLocaleString()}/year</span>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="ghost" size="md" onClick={onBack} disabled={loading}>Back</Button>
        <Button type="button" variant="primary" size="lg" fullWidth onClick={handlePay} isLoading={loading}>Proceed to Payment</Button>
      </div>

      <div className={styles.secure}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L12 3.5V6.5C12 9.8 9.8 12.9 7 13.5C4.2 12.9 2 9.8 2 6.5V3.5L7 1Z" stroke="var(--color-key-success)" strokeWidth="1.2" fill="none" /><path d="M5 7L6.5 8.5L9 5.5" stroke="var(--color-key-success)" strokeWidth="1.2" /></svg>
        <span>Paystack Secure Checkout</span>
      </div>
    </div>
  );
}
