"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils/cn";
import styles from "./processing-screen.module.css";

interface ProcessingStep {
  label: string;
  duration: number;
}

const PROCESSING_STEPS: ProcessingStep[] = [
  { label: "Reviewing business activities", duration: 800 },
  { label: "Analyzing industry requirements", duration: 700 },
  { label: "Identifying regulatory agencies", duration: 600 },
  { label: "Calculating compliance complexity", duration: 500 },
  { label: "Generating assessment summary", duration: 600 },
];

const TOTAL_DURATION = PROCESSING_STEPS.reduce((sum, s) => sum + s.duration, 0);

interface ProcessingScreenProps {
  onComplete: () => void;
}

export function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let timeElapsed = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    PROCESSING_STEPS.forEach((step, index) => {
      const timer = setTimeout(
        () => {
          setCurrentStepIndex(index);
          setCompletedSteps((prev) => {
            const next = new Set(prev);
            next.add(index);
            if (next.size === PROCESSING_STEPS.length) {
              setTimeout(() => {
                onCompleteRef.current();
              }, 400);
            }
            return next;
          });
        },
        timeElapsed
      );
      timers.push(timer);
      timeElapsed += step.duration;
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  const progressPercent = Math.min(
    100,
    Math.round((completedSteps.size / PROCESSING_STEPS.length) * 100)
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.spinnerContainer}>
          <div className={styles.spinner} />
        </div>

        <h2 className={styles.title}>Analyzing your business requirements...</h2>
        <p className={styles.subtitle}>
          We are reviewing your information against our regulatory knowledge base.
        </p>

        <div className={styles.progressTrack}>
          <div
            className={styles.progressBar}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className={styles.stepsList} role="log" aria-label="Processing steps">
          {PROCESSING_STEPS.map((step, index) => (
            <div
              key={index}
              className={cn(
                styles.stepItem,
                completedSteps.has(index) && styles.stepComplete,
                currentStepIndex === index && !completedSteps.has(index) && styles.stepActive
              )}
            >
              <span className={styles.stepIcon}>
                {completedSteps.has(index) ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="7" fill="var(--color-role-light-success)" />
                    <path d="M5 8L7.5 10.5L11 6" stroke="var(--color-role-light-onSuccess)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : currentStepIndex === index ? (
                  <div className={styles.pulseDot} />
                ) : (
                  <div className={styles.dot} />
                )}
              </span>
              <span className={styles.stepLabel}>{step.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
