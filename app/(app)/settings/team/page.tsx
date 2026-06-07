"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TeamSettingsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/settings?tab=team");
  }, [router]);

  return null;
}
