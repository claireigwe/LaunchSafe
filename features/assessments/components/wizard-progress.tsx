import { cn } from "@/lib/utils/cn";
import styles from "./wizard-progress.module.css";
import { WIZARD_STEPS } from "../types/wizard.types";

interface WizardProgressProps {
  currentStep: number;
  completedSteps: Set<number>;
}

export function WizardProgress({ currentStep, completedSteps }: WizardProgressProps) {
  const totalSteps = WIZARD_STEPS.length;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className={styles.container} role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100} aria-label="Assessment progress">
      <div className={styles.stepsRow}>
        {WIZARD_STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = completedSteps.has(stepNumber);
          const isCurrent = currentStep === stepNumber;
          const isClickable = completedSteps.has(stepNumber) || stepNumber < currentStep;

          return (
            <div key={step.key} className={styles.stepItem}>
              <div
                className={cn(
                  styles.stepCircle,
                  isCompleted && styles.completed,
                  isCurrent && styles.current,
                  !isCompleted && !isCurrent && styles.pending
                )}
                tabIndex={isClickable ? 0 : -1}
                role={isClickable ? "button" : undefined}
                aria-label={`Step ${stepNumber}: ${step.label}${isCompleted ? " (completed)" : ""}${isCurrent ? " (current)" : ""}`}
              >
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8L6.5 11.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span>{stepNumber}</span>
                )}
              </div>
              <span
                className={cn(
                  styles.stepLabel,
                  isCurrent && styles.labelCurrent,
                  isCompleted && styles.labelCompleted
                )}
              >
                {step.label}
              </span>
              {index < WIZARD_STEPS.length - 1 && (
                <div
                  className={cn(
                    styles.connector,
                    isCompleted && styles.connectorActive
                  )}
                  aria-hidden="true"
                />
              )}
            </div>
          );
        })}
      </div>
      <div className={styles.progressTrack}>
        <div
          className={styles.progressBar}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className={styles.progressText}>{progressPercent}% complete</p>
    </div>
  );
}
