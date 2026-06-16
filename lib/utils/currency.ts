/**
 * Formats an amount in kobo (smallest currency unit) to Naira display string.
 * Example: formatKobo(50000) → "₦50,000"
 */
export function formatKobo(amount: number): string {
  return `₦${Math.round(amount / 100).toLocaleString("en-US")}`;
}
