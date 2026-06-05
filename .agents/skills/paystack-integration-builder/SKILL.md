# skill: paystack-integration-builder

## Purpose

This skill is responsible for building, maintaining, securing, and improving all Paystack integrations within LaunchSafe.

Paystack is the primary payment provider for LaunchSafe.

This skill governs:

* Assessment purchases
* Subscription payments
* Payment verification
* Subscription renewals
* Billing events
* Revenue tracking
* Refund handling
* Webhook processing

This is a revenue-critical system.

---

# Core Philosophy

The Billing System owns billing logic.

The Paystack Integration Builder owns Paystack implementation.

The Paystack integration must be:

* Secure
* Auditable
* Idempotent
* Reliable
* Server-driven

Revenue integrity is more important than implementation speed.

---

# Primary Responsibilities

This skill is responsible for:

* Transaction initialization
* Transaction verification
* Webhook processing
* Subscription setup
* Subscription renewal handling
* Refund handling
* Billing event creation
* Revenue reconciliation

This skill is not responsible for:

* Pricing strategy
* Subscription plan design
* Compliance calculations
* Regulatory verification

---

# Supported Payment Flows

LaunchSafe supports two payment flows.

---

## Assessment Purchase Flow

Required flow:

```text id="pay01"
Assessment Summary

↓

Purchase Report

↓

Paystack Checkout

↓

Verification

↓

Billing Update

↓

Report Unlock
```

---

## Subscription Flow

Required flow:

```text id="pay02"
Choose Plan

↓

Paystack Checkout

↓

Verification

↓

Subscription Activation

↓

Access Granted
```

---

# Core Security Principle

The client is never the source of truth.

The server is the source of truth.

---

# Never Trust Client-Side Payment State

Never trust:

* Success pages
* Callback URLs
* Query parameters
* Local storage
* Browser state
* Frontend payment flags

These may improve UX.

They must never determine access.

---

# Authoritative Payment Source

The following are authoritative:

```text id="pay03"
Paystack Verification API

Paystack Webhooks

Server-side Billing Records
```

Nothing else.

---

# Payment Initialization Rules

Every payment should create:

* Payment record
* Pending status
* Transaction reference

before redirecting to Paystack.

---

# Required Payment Statuses

Supported values:

```text id="pay04"
Pending

Paid

Failed

Refunded

Cancelled
```

---

# Payment Type Rules

Supported values:

```text id="pay05"
Assessment

Subscription
```

---

# Transaction Reference Rules

Every transaction must have:

* Unique reference
* User association
* Payment type
* Timestamp

References must never be reused.

---

# Verification Rules

Every payment must be verified server-side.

Required flow:

```text id="pay06"
Paystack Transaction

↓

Verification API

↓

Validation

↓

Billing Update

↓

Access Decision
```

---

# Verification Requirements

Verification must confirm:

* Transaction exists
* Transaction succeeded
* Amount matches
* Currency matches
* User matches
* Transaction not previously processed

---

# Idempotency Rules

Payment processing must be idempotent.

Processing the same event twice should never:

* Unlock twice
* Create duplicate subscriptions
* Create duplicate purchases
* Duplicate billing events

---

# Assessment Unlock Rules

A Full Compliance Report may only unlock when:

✓ Payment exists

✓ Verification succeeds

✓ Amount matches

✓ Billing event created

✓ Access updated

Only after all checks pass.

---

# Forbidden Assessment Logic

Never unlock reports because:

```text id="pay07"
User returned from success page

Query parameter says success

Frontend says payment succeeded
```

---

# Subscription Activation Rules

Subscriptions may activate only when:

✓ Verification succeeds

✓ Subscription created

✓ Billing event created

✓ Access recalculated

---

# Subscription Renewal Rules

Renewals should:

* Verify payment
* Extend access
* Update subscription
* Create billing event

Renewals should not create duplicate subscriptions.

---

# Paystack Webhook Rules

Webhooks are authoritative.

Required flow:

```text id="pay08"
Webhook Received

↓

Signature Verification

↓

Event Validation

↓

Idempotency Check

↓

Processing

↓

Billing Update

↓

Audit Log
```

---

# Webhook Security Rules

Every webhook must:

* Verify signature
* Validate payload
* Verify source
* Reject invalid requests

Never process unsigned webhooks.

---

# Supported Webhook Events

Examples:

```text id="pay09"
charge.success

subscription.create

subscription.disable

invoice.create

invoice.payment_failed
```

Implementation should remain extensible.

---

# Duplicate Event Protection

The system must prevent:

* Duplicate webhook execution
* Duplicate billing events
* Duplicate subscription activation

All webhook events should be tracked.

---

# Refund Rules

Refunds should:

* Update payment status
* Create billing event
* Preserve history

Refunds should never delete payment records.

---

# Revenue Reconciliation Rules

The system should reconcile:

* Paystack transactions
* Payment records
* Subscription records
* Billing events

Discrepancies should be flagged.

---

# Billing Event Rules

Every successful payment should generate:

Examples:

```text id="pay10"
Assessment Purchased

Payment Verified

Subscription Activated

Subscription Renewed

Refund Processed
```

Billing events are mandatory.

---

# Notification Integration Rules

Successful payments should trigger:

* Payment notifications
* Subscription notifications
* Assessment unlock notifications

---

# Audit Requirements

Log:

* Payment initialization
* Payment verification
* Webhook processing
* Subscription activation
* Subscription renewal
* Refund processing

Audit logs must be immutable.

---

# Database Requirements

Payment records should store:

* Reference
* Amount
* Currency
* Payment type
* Status
* Verification timestamp

Never store:

* Card number
* CVV
* Expiry date

---

# Currency Rules

Phase 1:

```text id="pay11"
NGN
```

Future:

* USD
* GBP
* EUR

Architecture should remain currency-agnostic.

---

# Error Handling Rules

Errors should be:

* Logged
* Traceable
* Recoverable

Users should receive clear messages.

Bad:

```text id="pay12"
Payment Error
```

Good:

```text id="pay13"
We could not verify your payment.

Please contact support if the issue persists.
```

---

# Performance Targets

Transaction Initialization:

```text id="pay14"
< 2 seconds
```

Verification:

```text id="pay15"
< 5 seconds
```

Webhook Processing:

```text id="pay16"
< 5 seconds
```

Subscription Activation:

```text id="pay17"
< 5 seconds
```

---

# Anti-Fraud Rules

Prevent:

* Duplicate payments
* Subscription spoofing
* Reference reuse
* Client-side access manipulation

Access decisions must originate from verified billing records.

---

# Testing Requirements

Critical tests:

✓ Transaction initialization

✓ Verification

✓ Webhook processing

✓ Assessment unlock

✓ Subscription activation

✓ Subscription renewal

✓ Duplicate webhook protection

✓ Refund handling

---

# Required Dependencies

This skill should follow:

* AGENTS.md
* billing-rules.md
* security.md
* architecture.md
* data-architecture.md
* paystack documentation

---

# Completion Checklist

✓ Payment initialization implemented

✓ Verification implemented

✓ Webhooks implemented

✓ Signature verification implemented

✓ Idempotency protection implemented

✓ Assessment unlock flow implemented

✓ Subscription activation implemented

✓ Refund handling implemented

✓ Audit logging implemented

✓ Revenue reconciliation supported

---

# Non-Negotiables

Never:

* Trust client-side payment status
* Unlock reports before verification
* Activate subscriptions before verification
* Process unsigned webhooks
* Store card information
* Create duplicate billing events
* Use AI to determine payment outcomes

For LaunchSafe, payment verification is the single source of truth for access control.
