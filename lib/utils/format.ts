/**
 * Formats a number as Nigerian Naira currency.
 * Example: formatCurrency(50000) → "₦50,000.00"
 */
export function formatCurrency(
  amount: number,
  currency: string = "NGN"
): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a Date or ISO string as a human-readable date.
 * Example: formatDate("2024-03-15") → "15 Mar 2024"
 */
export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Returns a relative time string.
 * Example: formatRelativeTime(pastDate) → "3 days ago"
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const target = new Date(date);
  const diffMs = target.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffDays) < 1) {
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    return rtf.format(diffHours, "hour");
  }
  if (Math.abs(diffDays) < 30) {
    return rtf.format(diffDays, "day");
  }
  const diffMonths = Math.round(diffDays / 30);
  return rtf.format(diffMonths, "month");
}

/**
 * Truncates a string to a max length with an ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength - 3)}...`;
}
