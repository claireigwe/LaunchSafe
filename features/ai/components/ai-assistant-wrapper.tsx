"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getSubscription } from "@/features/billing/api/billing-api";
const AIAssistantComponent = dynamic(
  () => import("./ai-assistant").then((mod) => ({ default: mod.AIAssistant })),
  { ssr: false }
);

export function AIAssistantWrapper() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const sub = getSubscription();
    if (sub && sub.planId === "enterprise") {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return <AIAssistantComponent />;
}
