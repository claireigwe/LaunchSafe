"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BusinessInfo } from "./steps/business-info";
import { BusinessStatus } from "./steps/business-status";
import { BusinessOperations } from "./steps/business-operations";
import { SubscriptionSelect } from "./steps/subscription-select";
import { PaymentProcessing } from "./steps/payment-processing";
import { clearUserIntent, saveUserIntent } from "../api/onboarding-api";
import type { OnboardingStep, OnboardingData } from "../types/onboarding.types";
import { createEmptyOnboardingData, ONBOARDING_STEPS } from "../types/onboarding.types";
import styles from "./business-onboarding-wizard.module.css";

export function BusinessOnboardingWizard() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState<OnboardingStep>(1);
  const [data, setData] = useState<OnboardingData>(createEmptyOnboardingData());
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        saveUserIntent("existing_business");
        router.push("/signup?redirect=/business-onboarding");
      }
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  function updateStepData<K extends keyof OnboardingData>(section: K, values: Partial<OnboardingData[K]>) {
    setData((prev) => ({ ...prev, [section]: { ...prev[section], ...values } }));
  }

  function goNext() {
    if (step < 6) setStep((step + 1) as OnboardingStep);
  }

  function goBack() {
    if (step > 1) setStep((step - 1) as OnboardingStep);
  }

  function handleComplete() {
    clearUserIntent();
  }

  function renderStep() {
    switch (step) {
      case 1:
        return <BusinessInfo data={data.info} onUpdate={(v) => updateStepData("info", v)} onNext={goNext} />;
      case 2:
        return <BusinessStatus data={data.status} onUpdate={(v) => updateStepData("status", v)} onNext={goNext} onBack={goBack} />;
      case 3:
        return <BusinessOperations data={data.operations} onUpdate={(v) => updateStepData("operations", v)} onNext={goNext} onBack={goBack} />;
      case 4:
        return (
          <SubscriptionSelect
            selected={selectedPlan}
            onSelect={setSelectedPlan}
            isAnnual={isAnnual}
            onToggleBilling={() => setIsAnnual((p) => !p)}
            onNext={goNext}
            onBack={goBack}
          />
        );
      case 5:
        return (
          <PaymentProcessing
            planId={selectedPlan}
            isAnnual={isAnnual}
            onboardingData={data}
            onComplete={goNext}
            onBack={goBack}
          />
        );
      case 6:
        return (
          <div style={{ textAlign: "center", padding: "60px 24px" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--color-role-light-successContainer)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M6 14L11 19L22 8" stroke="var(--color-role-light-onSuccessContainer)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <h2 style={{ fontFamily: "var(--font-headline-headline-small-fontFamily)", fontSize: 22, fontWeight: 600, color: "var(--color-role-light-onSurface)", margin: "0 0 8px" }}>Payment Initiated</h2>
            <p style={{ fontFamily: "var(--font-body-body-large-fontFamily)", fontSize: 15, color: "var(--color-role-light-onSurfaceVariant)", margin: "0 0 24px", lineHeight: 1.5 }}>
              You'll be redirected to Paystack to complete your payment. After payment, your business will be created and you'll be taken to your dashboard.
            </p>
            <button
              type="button"
              onClick={handleComplete}
              style={{ background: "var(--color-role-light-primary)", color: "#fff", border: "none", borderRadius: 10, padding: "14px 32px", fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
            >
              Go to Dashboard
            </button>
          </div>
        );
    }
  }

  const showProgress = step >= 1 && step <= 4;
  const stepIndex = showProgress ? step - 1 : -1;

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {showProgress && (
          <div className={styles.progressBar}>
            {ONBOARDING_STEPS.map((s, i) => (
              <div key={s.key} className={`${styles.progressDot} ${i <= stepIndex ? styles.active : ""}`}>
                <div className={styles.dot} />
                <span className={styles.dotLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        )}
        <div className={styles.stepContent}>{renderStep()}</div>
      </div>
    </div>
  );
}
