export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type PaymentType = "assessment" | "subscription";
export type SubscriptionStatus =
  | "trial"
  | "active"
  | "expired"
  | "cancelled"
  | "suspended";

/** The slug identifier for a subscription plan tier. */
export type SubscriptionPlanSlug = "free" | "pro" | "business" | "enterprise";

export type AssessmentPurchaseStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "cancelled";

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  provider: "paystack";
  paymentType: PaymentType;
  reference: string;
  providerReference: string | null;
  status: PaymentStatus;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface AssessmentPurchase {
  id: string;
  userId: string;
  assessmentId: string;
  paymentId: string | null;
  status: AssessmentPurchaseStatus;
  unlockedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Client-side subscription representation returned by /api/billing/data */
export interface SavedSubscription {
  planId: string | null;
  planName: string;
  billingCycle: "monthly" | "annual";
  status: SubscriptionStatus;
  startDate: string;
  nextRenewal: string;
  cancelledAt: string | null;
  paystackSubscriptionCode?: string | null;
}

/** Client-side payment representation returned by /api/billing/data */
export interface SavedPayment {
  id: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed" | "refunded";
  paymentType: "subscription" | "assessment";
  reference: string;
  description: string;
  createdAt: string;
}

/** Client-side assessment purchase representation returned by /api/billing/data */
export interface SavedAssessmentPurchase {
  id: string;
  reportName: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: SubscriptionPlanSlug;
  priceMonthly: number;
  priceYearly: number;
  currency: string;
  features: string[];
  businessLimit: number;
  assessmentLimit: number;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  paystackSubscriptionCode: string | null;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BillingEvent {
  id: string;
  userId: string;
  subscriptionId: string | null;
  paymentId: string | null;
  eventType: string;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface InitiateAssessmentPurchaseInput {
  assessmentId: string;
  callbackUrl: string;
}

export interface InitiateSubscriptionInput {
  planId: string;
  billingCycle: "monthly" | "yearly";
  callbackUrl: string;
}
