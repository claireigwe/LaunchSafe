export function trackEvent(event: string, data?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    if (typeof (window as any).gtag !== "undefined") {
      (window as any).gtag("event", event, data);
    }
  } catch {}
}
