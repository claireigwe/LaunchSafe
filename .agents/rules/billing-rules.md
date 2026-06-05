---
trigger: always_on
---

# billing-rules.md

## Purpose

This document defines all billing, payments, subscriptions, assessment purchases, plan access, payment verification, and revenue-related rules for LaunchSafe.

All billing implementations must comply with this document.

If implementation conflicts with billing-rules.md, billing-rules.md takes precedence for all payment-related functionality.

---

# Billing Philosophy

LaunchSafe operates a hybrid revenue model.

Revenue is generated through:

1. One-Time Assessment Purchases
2. Recurring Compliance Autopilot Subscriptions

Billing should be:

* Simple
* Transparent
* Predictable
* Auditable

Users should always understand:

* What they are paying for
* Why they are paying
* What they will receive

---

# Revenue Streams

## Revenue Stream 1

### Pre-Launch Compliance Explorer

One-time purchase.

Purpose:

Help founders understand compliance requirements before investing in a business.

Users purchase:

* Full Compliance Report
* Compliance Roadmap
* Cost Analysis
* Requirement Breakdown
* Risk Analysis

---

## Revenue Stream 2

### Compliance Autopilot

Recurring subscription.

Purpose:

Help operating businesses manage compliance continuously.

Users subscribe to:

* Dashboard
* Compliance tracking
* Notifications
* Calendar
* Document generation
* Evidence management
* Regulatory monitoring

---

# Payment Provider Rules

## Primary Provider

Paystack

Reasons:

* Nigerian market fit
* Subscription support
* Reliable webhooks
* Strong API ecosystem

---

## Future Providers

Future providers may include:

* Flutterwave
* Stripe
* Local banking integrations

The architecture must support provider replacement without major redesign.

---

# Payment Verification Rules

## Server-Side Verification Required

All payment verification must occur on the server.

Verification must never depend on:

* Redirect URLs
* Success pages
* Query parameters
* Browser state
* Local storage
* Client-side callbacks

---

## Verification Flow

```text id="9uh3mv"
Payment Attempt

↓

Paystack

↓

Webhook/Event

↓

Server Verification

↓

Update Payment Record

↓

Unlock Access
```

---

# Assessment Purchase Rules

## Assessment Summary

Available without payment.

Users may view:

* Business type
* Location
* Requirement count
* Agency count
* Complexity score
* Compliance categories

---

## Locked Content

Users must not access:

* Requirement details
* Agency obligations
* Cost breakdowns
* Timelines
* Permit details
* Licensing details
* Risk analysis
* Launch roadmap

before successful payment verification.

---

## Full Compliance Report

Access requires:

* Payment record exists
* Payment status is Paid
* Verification completed server-side

---

## Assessment Purchase Statuses

Supported values:

```text id="mjlwmq"
Pending
Paid
Failed
Refunded
Cancelled
```

---

# Subscription Rules

## Supported Plans

### Free

Purpose:

Product discovery.

---

### Pro

Purpose:

Solo founders and small businesses.

---

### Business

Purpose:

Growing SMEs.

---

### Enterprise

Purpose:

Larger organizations.

---

# Subscription Activation Rules

Subscriptions become active only after:

* Successful payment
* Server-side verification
* Subscription record update
* Billing event creation

---

# Subscription Status Rules

Supported values:

```text id="agkv3i"
Trial
Active
Expired
Cancelled
Suspended
```

---

## Trial

Limited access.

---

## Active

Full access according to plan.

---

## Expired

Subscription ended.

Data remains preserved.

---

## Cancelled

User intentionally cancelled.

Access continues until subscription end date.

---

## Suspended

Administrative restriction.

---

# Feature Gating Rules

## Free Plan

Access:

* Assessment summaries
* Limited assessments
* Limited reports
* Basic dashboard

Restricted:

* Document generation
* Compliance calendar
* Advanced notifications
* Team collaboration

---

## Pro Plan

Access:

* Compliance dashboard
* Compliance calendar
* Compliance score
* Notifications
* Document generation
* Evidence management

---

## Business Plan

Access:

* Multiple businesses
* Team collaboration
* Advanced reporting

---

## Enterprise Plan

Access:

* Enterprise administration
* Advanced analytics
* Dedicated onboarding
* Priority support

---

# Payment Records Rules

Every payment must store:

* User
* Amount
* Currency
* Provider
* Payment type
* Reference
* Status
* Timestamp

---

## Payment Types

Supported values:

```text id="gcz9s0"
Assessment
Subscription
```

---

## Payment Statuses

Supported values:

```text id="18sv0x"
Pending
Paid
Failed
Refunded
```

---

# Billing Event Rules

Every billing lifecycle event must be recorded.

Examples:

* Assessment purchased
* Subscription created
* Subscription renewed
* Subscription cancelled
* Payment verified
* Payment failed
* Payment refunded

---

# Refund Rules

Refunds should:

* Create audit records
* Preserve billing history
* Update payment status

Refund history must never be deleted.

---

# Subscription Expiry Rules

When a subscription expires:

Users retain:

* Businesses
* Assessments
* Documents
* Evidence
* Compliance history

Users lose:

* Premium feature access
* Premium notifications
* Advanced reporting

Data should never be deleted automatically.

---

# Notification Rules

Users should receive notifications for:

## Payments

* Successful payment
* Failed payment
* Refunded payment

---

## Subscriptions

* Upcoming renewal
* Successful renewal
* Expiration warning
* Subscription expired

---

## Assessment Purchases

* Assessment unlocked
* Report available

---

# Audit Rules

All billing actions must be logged.

Examples:

* Payment initiation
* Payment verification
* Assessment unlock
* Subscription activation
* Subscription renewal
* Refund processing

Audit records must be immutable.

---

# Security Rules

LaunchSafe must never store:

* Card numbers
* CVV values
* Expiry dates

Store only:

* References
* Provider identifiers
* Subscription identifiers
* Status information

---

# Business Rules

Assessment purchases do not create subscriptions.

Subscriptions do not automatically include assessment purchases unless explicitly configured.

Assessment revenue and subscription revenue should be tracked independently.

---

# Reporting Rules

The platform should track:

Assessment Metrics

* Assessment summaries generated
* Assessment purchases
* Assessment conversion rate

Subscription Metrics

* Subscription conversions
* Renewal rate
* Churn rate

Revenue Metrics

* Assessment revenue
* Subscription revenue
* Total revenue

---

# Non-Negotiables

Never:

* Trust client-side payment success
* Unlock reports before payment verification
* Activate subscriptions before payment verification
* Store card information
* Delete billing history
* Modify audit logs

Revenue protection and payment integrity take priority over convenience.
