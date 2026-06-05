/**
 * Billing Feature Module
 *
 * This module owns:
 * - Assessment purchase initiation (client-side only)
 * - Subscription initiation (client-side only)
 * - Billing UI (plan display, payment status)
 *
 * Payment verification, subscription activation, and report unlocking
 * are ALWAYS handled server-side. This module never grants access.
 */

export * from "@/types/domain/billing";
