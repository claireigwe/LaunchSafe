const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Returns the number of days between now and the given date.
 * Positive means the date is in the future, negative means in the past.
 */
export function daysUntil(dateStr: string): number {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 0;
  return Math.ceil((d.getTime() - Date.now()) / MS_PER_DAY);
}

/**
 * Returns a human-readable relative time string.
 * Examples: "Just now", "3m ago", "2h ago", "5d ago"
 */
export function formatRelativeTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return d.toLocaleDateString("en-NG", { day: "numeric", month: "short" });
}

export function formatDate(dateStr: string | null | undefined, options?: Intl.DateTimeFormatOptions): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-NG", options || { day: "numeric", month: "short" });
}
