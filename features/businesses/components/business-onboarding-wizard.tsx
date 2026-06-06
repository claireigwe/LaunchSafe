"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BusinessInfo } from "./steps/business-info";
import { BusinessStatus } from "./steps/business-status";
import { BusinessOperations } from "./steps/business-operations";
import { ProcessingProfile } from "./steps/processing-profile";
import { SubscriptionSelect } from "./steps/subscription-select";
import { PaymentProcessing } from "./steps/payment-processing";
import { DashboardRedirect } from "./steps/dashboard-redirect";
import { clearUserIntent, saveUserIntent, addBusiness, getBusinessCount } from "../api/onboarding-api";
import { schedulePlanChange } from "@/features/billing/api/billing-api";
import { getPlanLimit } from "@/features/billing/api/feature-access";
import type { OnboardingStep, OnboardingData } from "../types/onboarding.types";
import { createEmptyOnboardingData, ONBOARDING_STEPS } from "../types/onboarding.types";
import styles from "./business-onboarding-wizard.module.css";

export function BusinessOnboardingWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [step, setStep] = useState<OnboardingStep>(() => {
    return searchParams.get("mode") === "change-plan" ? 5 : 1;
  });
  const [data, setData] = useState<OnboardingData>(createEmptyOnboardingData());
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isAnnual, setIsAnnual] = useState(true);
  const [session, setSession] = useState<any>(null);
  const mode = searchParams.get("mode");
  const isChangePlan = mode === "change-plan";
  const isAddBusiness = mode === "add-business";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        saveUserIntent("existing_business");
        router.push("/signup?redirect=/business-onboarding");
        return;
      }
      if (isAddBusiness) {
        const count = getBusinessCount();
        const limit = getPlanLimit("businesses");
        if (count >= limit) {
          router.push("/business");
        }
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
    if (step < 7) setStep((step + 1) as OnboardingStep);
  }

  function goBack() {
    if (step > 1) setStep((step - 1) as OnboardingStep);
  }

  const handlePlanChange = useCallback(() => {
    if (selectedPlan) {
      const plans: Record<string, string> = { starter: "Starter", growth: "Growth", enterprise: "Enterprise" };
      schedulePlanChange(selectedPlan, plans[selectedPlan] || selectedPlan, isAnnual ? "annual" : "monthly");
      clearUserIntent();
      router.push("/settings/billing");
    }
  }, [selectedPlan, isAnnual, router]);

  const handleComplete = useCallback(() => {
    clearUserIntent();
  }, []);

  function renderStep() {
    switch (step) {
      case 1:
        return <BusinessInfo data={data.info} onUpdate={(v) => updateStepData("info", v)} onNext={goNext} />;
      case 2:
        return <BusinessStatus data={data.status} onUpdate={(v) => updateStepData("status", v)} onNext={goNext} onBack={goBack} />;
      case 3:
        return <BusinessOperations data={data.operations} onUpdate={(v) => updateStepData("operations", v)} onNext={goNext} onBack={goBack} />;
      case 4:
        return <ProcessingProfile onComplete={isAddBusiness ? async () => { await addBusiness(data as any); clearUserIntent(); router.push("/business"); } : goNext} />;
      case 5:
        return (
          <SubscriptionSelect
            selected={selectedPlan}
            onSelect={setSelectedPlan}
            isAnnual={isAnnual}
            onToggleBilling={() => setIsAnnual((p) => !p)}
            onNext={isChangePlan ? handlePlanChange : goNext}
            onBack={isChangePlan ? () => router.push("/settings/billing") : goBack}
          />
        );
      case 6:
        return <PaymentProcessing planId={selectedPlan} isAnnual={isAnnual} onboardingData={data} isChangePlan={isChangePlan} onComplete={goNext} onBack={goBack} />;
      case 7:
        return <DashboardRedirect onComplete={handleComplete} />;
    }
  }

  const showProgress = step >= 1 && step <= 3;
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
