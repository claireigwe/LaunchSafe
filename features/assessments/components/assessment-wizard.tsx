"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WizardProgress } from "./wizard-progress";
import { BusinessBasics } from "./steps/business-basics";
import { BusinessActivities } from "./steps/business-activities";
import { LocationOperations } from "./steps/location-operations";
import { TeamStaffing } from "./steps/team-staffing";
import { IndustrySubIndustry } from "./steps/industry-subindustry";
import { IndustryQuestions } from "./steps/industry-questions";
import { ProcessingScreen } from "./steps/processing-screen";
import { SummaryScreen } from "./steps/summary-screen";
import { UnlockPrompt } from "./steps/unlock-prompt";
import { useAssessmentWizard } from "../hooks/use-assessment-wizard";
import { createClient } from "@/lib/supabase/client";
import { generateAssessmentSummary } from "../data/summary-generator";
import {
  trackEvent,
  createAssessment,
  saveSummaryToLocalStorage,
  loadSummaryFromLocalStorage,
  saveAssessmentIdToLocalStorage,
  loadAssessmentIdFromLocalStorage,
  savePendingUnlockIntent,
  initiateAssessmentPayment,
} from "../api/assessment-api";
import type { AssessmentSummary } from "@/types/domain/assessment";
import styles from "./assessment-wizard.module.css";

export function AssessmentWizard() {
  const router = useRouter();
  const supabase = createClient();
  const {
    data,
    currentStep,
    completedSteps,
    updateStepData,
    goNext,
    goBack,
    goToStep,
    markStepComplete,
  } = useAssessmentWizard();

  const [summary, setSummary] = useState<AssessmentSummary | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [showUnlockPrompt, setShowUnlockPrompt] = useState(false);
  const [session, setSession] = useState<any>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (typeof currentStep === "number") {
      markStepComplete(currentStep);
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentStep === "summary" && !summary) {
      (async () => {
        const savedSummary = await loadSummaryFromLocalStorage();
        const pending = typeof window !== "undefined"
          ? localStorage.getItem("launchsafe-pending-unlock")
          : null;
        if (savedSummary && pending) {
          setSummary(savedSummary);
        }
        const savedId = loadAssessmentIdFromLocalStorage();
        if (savedId && pending) {
          setAssessmentId(savedId);
        }
        if (!pending) {
          goToStep(1);
        }
      })();
    }
  }, [currentStep, summary]);

  const handleAssessmentComplete = useCallback(async () => {
    trackEvent("Assessment Completed");

    try {
      const assessment = await createAssessment(data);
      setAssessmentId(assessment.id);
      saveAssessmentIdToLocalStorage(assessment.id);

      // Use the server-returned summary (real DB count, matches post-payment)
      if (assessment.summaryJson) {
        setSummary(assessment.summaryJson);
        await saveSummaryToLocalStorage(assessment.summaryJson);
      }

      trackEvent("Assessment Saved", { assessmentId: assessment.id });
    } catch (err) {
      console.error("[Assessment] Failed to save assessment:", err);
      // Fallback to local estimate if server is unavailable
      const fallbackSummary = generateAssessmentSummary(data);
      setSummary(fallbackSummary);
      await saveSummaryToLocalStorage(fallbackSummary);
    }

    goToStep("processing");
  }, [data, goToStep]);

  const handleUnlockReport = useCallback(async () => {
    trackEvent("Unlock Report Clicked");

    const id = assessmentId || loadAssessmentIdFromLocalStorage();
    const savedSummary = summary || await loadSummaryFromLocalStorage();

    if (savedSummary) {
      savePendingUnlockIntent({ summary: savedSummary, assessmentId: id });
    }

    router.push("/assessment/unlock");
  }, [assessmentId, summary, router]);

  const handleSignupComplete = useCallback(() => {
    setShowUnlockPrompt(false);
    handleUnlockReport();
  }, [handleUnlockReport]);

  const handleEditAnswers = useCallback(() => {
    goToStep(1);
  }, [goToStep]);

  const handleMaybeLater = useCallback(() => {
    trackEvent("Assessment Skipped Payment");
    router.push("/");
  }, [router]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BusinessBasics
            data={data.basics}
            onUpdate={(values) => updateStepData("basics", values)}
            onNext={() => {
              trackEvent("Assessment Step Completed", { step: 1 });
              goNext();
            }}
          />
        );
      case 2:
        return (
          <IndustrySubIndustry
            data={data.basics}
            onUpdate={(values) => updateStepData("basics", values)}
            onNext={() => {
              trackEvent("Assessment Step Completed", { step: 2 });
              goNext();
            }}
            onBack={goBack}
          />
        );
      case 3:
        return (
          <BusinessActivities
            data={data.activities}
            onUpdate={(values) => updateStepData("activities", values)}
            onNext={() => {
              trackEvent("Assessment Step Completed", { step: 3 });
              goNext();
            }}
            onBack={goBack}
          />
        );
      case 4:
        return (
          <LocationOperations
            data={data.location}
            onUpdate={(values) => updateStepData("location", values)}
            onNext={() => {
              trackEvent("Assessment Step Completed", { step: 4 });
              goNext();
            }}
            onBack={goBack}
          />
        );
      case 5:
        return (
          <TeamStaffing
            data={data.team}
            onUpdate={(values) => updateStepData("team", values)}
            onNext={() => {
              trackEvent("Assessment Step Completed", { step: 5 });
              goNext();
            }}
            onBack={goBack}
          />
        );
      case 6:
        return (
          <IndustryQuestions
            industry={data.basics.industry}
            data={data.industryQuestions}
            onUpdate={(values) => updateStepData("industryQuestions", values)}
            onSubmit={handleAssessmentComplete}
            onBack={goBack}
          />
        );
      case "summary":
        return summary ? (
          <SummaryScreen
            summary={summary}
            onUnlock={handleUnlockReport}
            onLater={handleMaybeLater}
            onEdit={handleEditAnswers}
          />
        ) : null;
      default:
        return null;
    }
  };

  const showProgress = typeof currentStep === "number";

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {showProgress && (
          <WizardProgress
            currentStep={currentStep as number}
            completedSteps={completedSteps}
          />
        )}

        <div className={styles.stepContent}>
          {currentStep === "processing" ? (
            <ProcessingScreen
              onComplete={() => {
                goToStep("summary");
              }}
            />
          ) : (
            renderStep()
          )}
        </div>
      </div>

      {showUnlockPrompt && (
        <UnlockPrompt onSignupComplete={handleSignupComplete} />
      )}
    </div>
  );
}
