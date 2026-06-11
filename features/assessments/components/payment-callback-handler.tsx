"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AssessmentWizard } from "./assessment-wizard";
import { FullReportScreen } from "./full-report-screen";

export function PaymentCallbackHandler() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<"wizard" | "verify">("wizard");

  useEffect(() => {
    const paid = searchParams.get("paid");
    const assessmentId = searchParams.get("assessmentId");
    const trxref = searchParams.get("trxref") || searchParams.get("reference");
    if ((paid || assessmentId) && trxref) {
      setView("verify");
    }
  }, [searchParams]);

  if (view === "verify") {
    return <FullReportScreen />;
  }

  return <AssessmentWizard />;
}
