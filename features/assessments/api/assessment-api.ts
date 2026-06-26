import type { ApiResponse } from "@/types/api.types";
import type { Assessment, AssessmentSummary } from "@/types/domain/assessment";
import type { WizardData, WizardStep } from "../types/wizard.types";
const STORAGE_KEY = "launchsafe-assessment-data";
const STEP_KEY = "launchsafe-assessment-step";
const SUMMARY_KEY = "launchsafe-assessment-summary";
const ASSESSMENT_ID_KEY = "launchsafe-assessment-id";

export function saveAssessmentToLocalStorage(data: WizardData, step: WizardStep): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(STEP_KEY, String(step));
  } catch {
  }
}

export function loadAssessmentFromLocalStorage(): {
  data: WizardData | null;
  step: WizardStep;
} {
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

    return { data: null, step: 1 };
  } catch {
    return { data: null, step: 1 };
  }
}

export function saveSummaryToLocalStorage(summary: AssessmentSummary): void {
  try {
    localStorage.setItem(SUMMARY_KEY, JSON.stringify(summary));
  } catch {
  }
}

export function loadSummaryFromLocalStorage(): AssessmentSummary | null {
  try {
    const raw = localStorage.getItem(SUMMARY_KEY);
    return raw ? JSON.parse(raw) : null;
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
  const res = await fetch("/api/assessments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data }),
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

export { trackEvent } from "@/lib/analytics/track";

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
