# skill: billing-system-builder

## Purpose

This skill is responsible for building, maintaining, and improving the LaunchSafe Billing System.

The Billing System manages all revenue-generating activities across the platform.

This includes:

* Assessment purchases
* Subscription purchases
* Payment verification
* Subscription lifecycle management
* Billing events
* Revenue tracking

This system is business-critical.

---

# Core Philosophy

Revenue access must be controlled by the server.

The Billing System is the source of truth for:

* Payment status
* Subscription status
* Assessment access

The client is never the source of truth.

---

# Primary Responsibilities

The Billing System is responsible for:

* Payment initiation
* Payment verification
* Assessment purchases
* Subscription billing
* Subscription activation
* Subscription renewal
* Billing event tracking
* Revenue reporting

The Billing System is not responsible for:

* Regulatory verification
* Compliance calculations
* Assessment generation
* Report generation

---

# Revenue Model

LaunchSafe operates two billing models.

---

## Model 1

### Pre-Launch Compliance Explorer

One-time purchase.

Users purchase:

* Full Compliance Report
* Compliance Roadmap
* Cost Analysis
* Requirement Breakdown
* Risk Analysis

This purchase does not create a subscription.

---

## Model 2

### Compliance Autopilot

Recurring subscription.

Users subscribe to:

* Compliance Dashboard
* Compliance Tracking
* Compliance Calendar
* Notifications
* Document Generation
* Evidence Management

---

# Payment Provider Rules

Primary provider:

```text id="bill01"
Paystack
```

---

# Future Providers

The architecture should support:

* Flutterwave
* Stripe
* Additional providers

Provider-specific logic should remain isolated.

---

# Payment Architecture

Required flow:

```text id="bill02"
User Action

↓

Payment Initialization

↓

Paystack Checkout

↓

Paystack Webhook

↓

Server Verification

↓

Billing Update

↓

Access Granted
```

Access must never be granted before verification.

---

# Assessment Purchase Flow

Required flow:

```text id="bill03"
Assessment Summary

↓

Purchase Report

↓

Paystack

↓

Server Verification

↓

Unlock Full Report
```

---

# Assessment Purchase Rules

Users may:

* Complete assessments
* View assessment summaries

without payment.

Users may not access:

* Requirement details
* Cost breakdowns
* Risk analysis
* Launch roadmap

until payment is verified.

---

# Existing Business Subscription Flow

Required flow:

```text id="bill04"
Create Account

↓

Add Business

↓

Choose Plan

↓

Paystack

↓

Verification

↓

Activate Subscription
```

Assessment purchases are not required.

---

# Independent Entry Point Rules

LaunchSafe supports:

## Path A

Pre-Launch Founder

Assessment

↓

Purchase Report

---

## Path B

Existing Business

Account

↓

Business Setup

↓

Subscription

Neither path should depend on the other.

---

# Subscription Plans

Supported plans:

```text id="bill05"
Free

Pro

Business

Enterprise
```

Plans should remain configurable.

---

# Free Plan Rules

Purpose:

Product discovery.

Access:

* Limited dashboard
* Limited compliance tracking
* Assessment summaries

Restricted:

* Advanced reporting
* Premium notifications
* Advanced document generation

---

# Pro Plan Rules

Purpose:

Solo founders and small businesses.

Access:

* Compliance dashboard
* Compliance tracking
* Compliance calendar
* Notifications
* Document generation
* Evidence management

---

# Business Plan Rules

Access:

* Multiple businesses
* Team members
* Advanced reporting

---

# Enterprise Plan Rules

Access:

* Enterprise controls
* Dedicated onboarding
* Advanced analytics

---

# Subscription Status Rules

Supported values:

```text id="bill06"
Trial

Active

Expired

Cancelled

Suspended
```

---

# Payment Status Rules

Supported values:

```text id="bill07"
Pending

Paid

Failed

Refunded
```

---

# Payment Type Rules

Supported values:

```text id="bill08"
Assessment

Subscription
```

---

# Payment Verification Rules

Verification must occur:

```text id="bill09"
Server Side Only
```

Never trust:

* Query parameters
* Success URLs
* Browser state
* Local storage

---

# Paystack Webhook Rules

All webhooks must:

* Verify signatures
* Validate payloads
* Prevent duplicate processing
* Create audit records

Webhooks are authoritative.

---

# Assessment Unlock Rules

Full reports may only unlock when:

* Payment exists
* Payment status is Paid
* Verification succeeds

Assessment access should never be controlled by the frontend.

---

# Subscription Activation Rules

Subscriptions become active only after:

* Payment verification
* Subscription creation
* Billing event creation

---

# Subscription Renewal Rules

Renewals should:

* Verify payment
* Extend subscription
* Record billing event

---

# Failed Payment Rules

When payment fails:

* Record failure
* Notify user
* Preserve audit trail

Do not activate access.

---

# Refund Rules

Refunds should:

* Create billing event
* Update payment status
* Preserve payment history

Never delete payment records.

---

# Billing Events

Every billing lifecycle action should create an event.

Examples:

* Assessment purchased
* Payment verified
* Subscription created
* Subscription renewed
* Subscription cancelled
* Payment refunded

---

# Revenue Reporting Rules

Track:

## Assessment Revenue

* Purchases
* Revenue
* Conversion rate

---

## Subscription Revenue

* MRR
* Renewals
* Churn

---

## Platform Revenue

* Total revenue
* Revenue by plan
* Revenue by country

---

# User Notification Rules

Notify users when:

## Assessment Events

* Purchase successful
* Report unlocked

---

## Subscription Events

* Subscription activated
* Subscription renewed
* Subscription expiring
* Subscription expired

---

## Payment Events

* Payment successful
* Payment failed
* Payment refunded

---

# Audit Requirements

Log:

* Payment initialization
* Payment verification
* Assessment unlock
* Subscription activation
* Subscription renewal
* Refund processing

Audit records must be immutable.

---

# Security Rules

Never store:

* Card numbers
* CVV values
* Card expiry dates

Store only:

* References
* Statuses
* Subscription identifiers

---

# Anti-Fraud Rules

The Billing System must prevent:

* Duplicate payments
* Duplicate webhook processing
* Unauthorized access
* Subscription spoofing

---

# Anti-Hallucination Rules

Billing decisions must never be generated by AI.

Access decisions must originate from:

* Billing records
* Payment verification
* Subscription records

Never use AI to determine access.

---

# Performance Targets

Payment Initialization:

```text id="bill10"
< 2 seconds
```

Webhook Processing:

```text id="bill11"
< 5 seconds
```

Subscription Activation:

```text id="bill12"
< 5 seconds
```

Report Unlock:

```text id="bill13"
< 2 seconds
```

---

# Required Dependencies

This skill should follow:

* AGENTS.md
* billing-rules.md
* security.md
* architecture.md
* data-architecture.md

---

# Completion Checklist

✓ Assessment purchases implemented

✓ Subscription billing implemented

✓ Paystack integration implemented

✓ Webhook verification implemented

✓ Subscription activation implemented

✓ Report unlock flow implemented

✓ Revenue reporting implemented

✓ Audit logging implemented

✓ Security rules followed

✓ No client-side access control

---

# Non-Negotiables

Never:

* Trust client-side payment status
* Unlock reports before verification
* Activate subscriptions before verification
* Store card information
* Delete billing history
* Allow AI to make billing decisions

Revenue integrity is more important than convenience.
