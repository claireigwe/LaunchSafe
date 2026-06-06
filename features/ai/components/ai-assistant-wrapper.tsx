"use client";

import dynamic from "next/dynamic";

const AIAssistantComponent = dynamic(
  () => import("./ai-assistant").then((mod) => ({ default: mod.AIAssistant })),
  { ssr: false }
);

export function AIAssistantWrapper() {
  return <AIAssistantComponent />;
}
