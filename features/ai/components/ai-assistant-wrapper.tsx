"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getSubscription } from "@/features/billing/api/billing-api";
import { getActiveBusinessId } from "@/lib/stores/app-store";
const AIAssistantComponent = dynamic(
  () => import("./ai-assistant").then((mod) => ({ default: mod.AIAssistant })),
  { ssr: false }
);

export function AIAssistantWrapper() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const sub = getSubscription();
    const bizId = getActiveBusinessId();
    if (sub && sub.planId === "enterprise" && bizId) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return <AIAssistantComponent />;
}
