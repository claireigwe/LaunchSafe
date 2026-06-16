import type { RiskReport } from "../types/reporting.types";

/**
 * Generates a human-readable insight string from a computed RiskReport.
 */
export function formatRiskInsights(report: RiskReport): string {
  if (report.score >= 50) {
    return `Risk is elevated because ${report.factors.slice(0, 2).join(" ").toLowerCase()}`;
  }
  if (report.score >= 25) {
    return `Some attention needed. ${report.factors.slice(0, 1).join(" ")}`;
  }
  return "Your compliance profile is in good standing with minimal risk factors.";
}
