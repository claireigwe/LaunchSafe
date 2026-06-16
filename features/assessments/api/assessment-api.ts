import type { ApiResponse } from "@/types/api.types";
import type { Assessment, AssessmentSummary } from "@/types/domain/assessment";
import type { WizardData, WizardStep } from "../types/wizard.types";
import { apiGet, apiPost } from "@/lib/api/base";

const STORAGE_KEY = "launchsafe-assessment-data";
const STEP_KEY = "launchsafe-assessment-step";
const SUMMARY_KEY = "launchsafe-assessment-summary";
const ASSESSMENT_ID_KEY = "launchsafe-assessment-id";

export async function saveAssessmentToLocalStorage(data: WizardData, step: WizardStep): Promise<void> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(STEP_KEY, String(step));
  } catch {
  }

  const assessmentId = loadAssessmentIdFromLocalStorage();
  const result = await apiPost<{ id: string }>("/api/assessments/wizard", { assessmentId, wizardData: data, wizardStep: step });
  if (result?.id && !assessmentId) {
    saveAssessmentIdToLocalStorage(result.id);
  }
}

export async function loadAssessmentFromLocalStorage(): Promise<{
  data: WizardData | null;
  step: WizardStep;
}> {
  try {
    const dataRaw = localStorage.getItem(STORAGE_KEY);
    const stepRaw = localStorage.getItem(STEP_KEY);

    if (dataRaw) {
      const parsedStep = parseInt(stepRaw || "", 10);
      return {
        data: JSON.parse(dataRaw),
        step: isNaN(parsedStep) ? (stepRaw as WizardStep) || 1 : (parsedStep as WizardStep),
      };
    }

    const server = await apiGet<{ assessmentId: string; wizardData: any; wizardStep: string }>("/api/assessments/wizard");
    if (server?.wizardData && server?.wizardStep) {
      saveAssessmentIdToLocalStorage(server.assessmentId);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(server.wizardData)); localStorage.setItem(STEP_KEY, server.wizardStep); } catch {}
      return {
        data: server.wizardData as WizardData,
        step: (parseInt(server.wizardStep, 10) || server.wizardStep) as WizardStep,
      };
    }

    return { data: null, step: 1 };
  } catch {
    return { data: null, step: 1 };
  }
}

export async function saveSummaryToLocalStorage(summary: AssessmentSummary): Promise<void> {
  try {
    localStorage.setItem(SUMMARY_KEY, JSON.stringify(summary));
  } catch {
  }

  const assessmentId = loadAssessmentIdFromLocalStorage();
  const result = await apiPost<{ id: string }>("/api/assessments/wizard", { assessmentId, summary });
  if (result?.id && !assessmentId) {
    saveAssessmentIdToLocalStorage(result.id);
  }
}

export async function loadSummaryFromLocalStorage(): Promise<AssessmentSummary | null> {
  try {
    const raw = localStorage.getItem(SUMMARY_KEY);
    if (raw) return JSON.parse(raw);
    const server = await apiGet<{ assessmentId: string; summary: any }>("/api/assessments/wizard");
    if (server?.summary) {
      try { localStorage.setItem(SUMMARY_KEY, JSON.stringify(server.summary)); } catch {}
      return server.summary as AssessmentSummary;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveAssessmentIdToLocalStorage(id: string): void {
  try {
    localStorage.setItem(ASSESSMENT_ID_KEY, id);
  } catch {
  }
}

export function loadAssessmentIdFromLocalStorage(): string | null {
  try {
    return localStorage.getItem(ASSESSMENT_ID_KEY);
  } catch {
    return null;
  }
}

const PENDING_UNLOCK_KEY = "launchsafe-pending-unlock";

export function savePendingUnlockIntent(data: {
  summary: AssessmentSummary;
  assessmentId: string | null;
}): void {
  try {
    localStorage.setItem(PENDING_UNLOCK_KEY, JSON.stringify(data));
  } catch {
  }
}

export function getPendingUnlockIntent(): {
  summary: AssessmentSummary | null;
  assessmentId: string | null;
} {
  try {
    const raw = localStorage.getItem(PENDING_UNLOCK_KEY);
    if (!raw) return { summary: null, assessmentId: null };
    const parsed = JSON.parse(raw);
    return {
      summary: parsed.summary || null,
      assessmentId: parsed.assessmentId || null,
    };
  } catch {
    return { summary: null, assessmentId: null };
  }
}

export function clearPendingUnlockIntent(): void {
  try {
    localStorage.removeItem(PENDING_UNLOCK_KEY);
  } catch {
  }
}

export function clearAssessmentFromLocalStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STEP_KEY);
    localStorage.removeItem(SUMMARY_KEY);
    localStorage.removeItem(ASSESSMENT_ID_KEY);
    clearPendingUnlockIntent();
  } catch {
  }
}

export async function createAssessment(
  data: WizardData
): Promise<Assessment> {
  const assessmentId = loadAssessmentIdFromLocalStorage();
  const res = await fetch("/api/assessments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data, assessmentId }),
  });

  const json: ApiResponse<Assessment> = await res.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }

  if (json.data?.id) saveAssessmentIdToLocalStorage(json.data.id);
  return json.data;
}

export async function initiateAssessmentPayment(
  assessmentId: string,
  email?: string | null
): Promise<{ authorizationUrl: string }> {
  const res = await fetch("/api/billing/assessments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      assessmentId,
      email,
      callbackUrl: `${window.location.origin}/assessment/success?assessmentId=${assessmentId}`,
    }),
  });

  const json: ApiResponse<{ authorizationUrl: string }> = await res.json();

  if (!json.success) {
    throw new Error(json.error.message);
  }

  return json.data;
}

export function trackEvent(event: string, data?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof (window as any).gtag !== "undefined") {
      (window as any).gtag("event", event, data);
    }
    console.log("[Analytics]", event, data);
  } catch {
  }
}

export async function deleteAssessment(assessmentId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/assessments/${assessmentId}`, {
      method: "DELETE",
    });
    const json: ApiResponse<null> = await res.json();
    return json.success;
  } catch {
    return false;
  }
}
