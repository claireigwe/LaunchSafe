"use client";

import { useState, useCallback, useEffect } from "react";
import type { WizardData, WizardStep } from "../types/wizard.types";
import { createEmptyWizardData } from "../types/wizard.types";
import {
  saveAssessmentToLocalStorage,
  loadAssessmentFromLocalStorage,
  clearAssessmentFromLocalStorage,
  trackEvent,
} from "../api/assessment-api";

interface UseAssessmentWizardReturn {
  data: WizardData;
  currentStep: WizardStep;
  completedSteps: Set<number>;
  isSaving: boolean;
  setData: (data: WizardData) => void;
  updateStepData: <K extends keyof WizardData>(
    section: K,
    values: Partial<WizardData[K]>
  ) => void;
  goToStep: (step: WizardStep) => void;
  goNext: () => void;
  goBack: () => void;
  markStepComplete: (step: number) => void;
  setIsSaving: (v: boolean) => void;
  reset: () => void;
}

export function useAssessmentWizard(): UseAssessmentWizardReturn {
  const [data, setDataState] = useState<WizardData>(createEmptyWizardData());
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      const saved = loadAssessmentFromLocalStorage();
      if (saved.data) {
        setDataState(saved.data);
        setCurrentStep(saved.step);
      }
      setInitialized(true);
    }
  }, [initialized]);

  useEffect(() => {
    if (initialized) {
      saveAssessmentToLocalStorage(data, currentStep);
    }
  }, [data, currentStep, initialized]);

  const setData = useCallback((newData: WizardData) => {
    setDataState(newData);
  }, []);

  const updateStepData = useCallback(
    <K extends keyof WizardData>(section: K, values: Partial<WizardData[K]>) => {
      setDataState((prev) => ({
        ...prev,
        [section]: { ...prev[section], ...values },
      }));
    },
    []
  );

  const goToStep = useCallback(
    (step: WizardStep) => {
      setCurrentStep(step);
      if (typeof step === "number") {
        trackEvent("Assessment Step Completed", { step });
      }
    },
    []
  );

  const goNext = useCallback(() => {
    if (typeof currentStep === "number" && currentStep < 5) {
      setCurrentStep((currentStep + 1) as WizardStep);
    }
  }, [currentStep]);

  const goBack = useCallback(() => {
    if (typeof currentStep === "number" && currentStep > 1) {
      setCurrentStep((currentStep - 1) as WizardStep);
    }
  }, [currentStep]);

  const markStepComplete = useCallback((step: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(step);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setDataState(createEmptyWizardData());
    setCurrentStep(1);
    setCompletedSteps(new Set());
    clearAssessmentFromLocalStorage();
  }, []);

  return {
    data,
    currentStep,
    completedSteps,
    isSaving,
    setData,
    updateStepData,
    goToStep,
    goNext,
    goBack,
    markStepComplete,
    setIsSaving,
    reset,
  };
}
