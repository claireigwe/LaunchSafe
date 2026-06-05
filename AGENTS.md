# AGENTS.md

# LaunchSafe AI Operating Manual

---

# Project Overview

LaunchSafe is a compliance intelligence platform that helps entrepreneurs and businesses understand, prepare for, and manage regulatory obligations before and after launching a business.

The platform exists because regulatory information is fragmented, difficult to understand, and often discovered too late.

LaunchSafe provides a single source of truth for business compliance by helping users:

* Discover regulatory requirements
* Understand compliance obligations
* Estimate compliance costs
* Generate supporting documents
* Track deadlines
* Monitor regulatory changes
* Maintain ongoing compliance

The long-term vision is to become the compliance operating system for African businesses.

---

# Mission

Help every business answer five critical questions:

1. What do I need?
2. How much will it cost?
3. When is it due?
4. What risk am I exposed to?
5. What should I do next?

The platform should provide clear, actionable answers without requiring legal expertise.

---

# Product Identity

## What LaunchSafe Is

LaunchSafe is:

* A compliance intelligence platform
* A regulatory knowledge platform
* A compliance workflow platform
* A compliance planning platform
* A compliance tracking platform
* A compliance document generation platform
* A regulatory monitoring platform

---

## What LaunchSafe Is Not

LaunchSafe is not:

* An AI chatbot
* A legal advisory firm
* An accounting platform
* A CRM
* An ERP
* A project management tool
* A generic AI assistant
* A tax filing platform
* A government portal

AI supports the platform but is never the primary experience.

---

# Core Promise

No founder should lose money, receive fines, delay operations, or shut down a business because they were unaware of a compliance requirement that could have been discovered earlier.

---

# Product Philosophy

Every feature should support at least one of the following outcomes:

* Discover compliance requirements
* Understand compliance obligations
* Prepare compliance documentation
* Reduce compliance risk
* Maintain compliance status

If a feature does not contribute to one of these outcomes, it likely does not belong in LaunchSafe.

LaunchSafe supports both transactional and subscription-based customer journeys.

Pre-launch compliance discovery may be purchased as a one-time assessment.

Ongoing compliance management is delivered through recurring subscriptions.

---

# Customer States

LaunchSafe serves two primary customer states.

Pre-Launch Founder

A founder who has not yet started the business and wants to understand:

- Regulatory requirements
- Startup compliance costs
- Required permits
- Licenses
- Risks
- Launch readiness

Existing Business Operator

A founder or team managing an existing business who wants to:

- Stay compliant
- Track obligations
- Monitor deadlines
- Generate documents
- Receive reminders
- Maintain compliance status

LaunchSafe supports two independent customer journeys.

1. Pre-Launch Compliance Explorer

For founders who have not yet launched a business and want to understand compliance requirements before investing money.

2. Compliance Autopilot

For businesses that are already operating and need ongoing compliance management.

Users are not required to complete a pre-launch assessment before accessing Compliance Autopilot.

---

# Tech Stack

| Layer            | Technology                             |
| ---------------- | -------------------------------------- |
| Framework        | Next.js 15 (App Router)                |
| Language         | TypeScript (Strict Mode)               |
| Database         | PostgreSQL                             |
| Backend Platform | Supabase                               |
| Authentication   | Supabase Auth                          |
| File Storage     | Supabase Storage                       |
| AI Providers     | OpenAI / DeepSeek                      |
| Vector Database  | pgvector                               |
| Email            | Resend                                 |
| Hosting          | Vercel                                 |
| Styling          | CSS Modules + Design Tokens            |
| State Management | React Query + Zustand (when necessary) |
| Payment Provider | Paystack                               |

Do not introduce alternative technologies unless explicitly instructed.

---

# Project Structure

```text
launchsafe/

├── app/
├── components/
│   ├── ui/
│   └── features/
├── features/
│   ├── assessments/
│   ├── compliance/
│   ├── documents/
│   ├── notifications/
│   ├── businesses/
│   └── regulatory-updates/
│   └── billing/
        ├── components/
        ├── hooks/
        ├── services/
        ├── api/
        └── types/

├── lib/
├── database/
├── ai/
├── documents/
├── tokens/
│   └── variables.css
├── types/
├── public/
├── scripts/
└── .agent/
    ├── rules/
    └── skills/
 
```

Always respect the existing project structure.

---

# Core Principles

## Accuracy Over Speed

Correct information is more important than fast information.

---

## Verification Over Assumptions

Never assume regulatory information.

---

## Compliance Over Convenience

User convenience must never compromise compliance accuracy.

---

## Simplicity Over Complexity

Prefer the simplest maintainable solution.

---

## Reuse Over Rebuilding

Always reuse existing architecture, components, and patterns.

---

## Data Before AI

The regulatory knowledge base is the foundation of LaunchSafe.

AI enhances the data.

AI does not replace the data.

---

# Compliance Maturity Model

LaunchSafe supports four levels of compliance assistance.

---

## Level 1: Inform Me

Help users understand:

* Requirements
* Costs
* Agencies
* Deadlines
* Risks

---

## Level 2: Track Me

Help users monitor:

* Renewals
* Filings
* Deadlines
* Compliance status

---

## Level 3: Prepare For Me

Help users generate:

* Application letters
* Compliance plans
* Policies
* Checklists
* Supporting documents

---

## Level 4: Do It For Me

Future roadmap:

* Filing assistance
* Professional marketplace
* Government integrations
* Automated submissions

---

# Regulatory Knowledge Model

LaunchSafe organizes compliance information using the following hierarchy:

```text
Country
    ↓
State
    ↓
LGA / Local Jurisdiction
    ↓
Industry
    ↓
Requirement
        ├── Agency
        ├── Costs
        ├── Deadlines
        ├── Required Documents
        ├── Sources
        ├── Confidence Level
        └── Risk Information
```

All compliance intelligence should conform to this structure.

---

# Core Domain Models

The platform revolves around these primary entities:

## User

Represents a platform user.

---

## Business

Represents a business being managed.

---

## Assessment

Represents a compliance discovery assessment.

---

## Requirement

Represents a regulatory obligation.

---

## Compliance Task

Represents a business-specific obligation.

---

## Compliance Document

Represents generated or uploaded compliance documentation.

---

## Evidence

Represents proof of compliance activity.

---

## Regulatory Update

Represents regulatory changes and updates.

---

## Notification

Represents reminders, alerts, and compliance communications.

---

## AssessmentPurchase

Represents a one-time purchase of a compliance assessment.

---
## SubscriptionPlan

Represents a plan available for subscription.

---
## Subscription

Represents a user's active subscription to a plan.

---
## Payment

Represents a payment transaction.

---
## BillingEvent

Represents a billing-related event (e.g., invoice generation, payment failure).

---

# Business Rules

These rules apply across the entire platform.

---

## Requirement Rules

Every requirement must have:

* Source
* Agency
* Confidence level
* Requirement type
* Verification status

---

## Cost Rules

Every cost must be classified as:

* Official
* Estimated
* Community Reported

Never present Estimated or Community Reported costs as official fees.

---

## Compliance Score Rules

Compliance scores must update whenever:

* Tasks are completed
* Evidence is uploaded
* Deadlines are missed
* Documents expire

---

## Evidence Rules

Evidence should never be permanently deleted.

Archive instead of removing historical records.

---

## Document Rules

Generated documents are supporting documents only.

LaunchSafe must never generate:

* Government approvals
* Government certificates
* Official permits

---

## Business Rules

Businesses should be archived rather than permanently deleted whenever possible.

---

# Compliance Workflow Lifecycle

Every compliance activity should follow:

```text
Discover
    ↓
Understand
    ↓
Prepare
    ↓
Submit
    ↓
Verify
    ↓
Complete
    ↓
Monitor
```

All workflow design should support this lifecycle.

---

# User Flows

## Founder Flow

Landing Page

↓

Business Discovery Assessment

↓

View Assessment Summary

↓

Purchase Full Assessment

↓

Paystack Checkout

↓

Server Verification

↓

Unlock Full Compliance Report

↓

Download Compliance Roadmap

↓

Optional Business Creation

↓

Optional Upgrade To Compliance Autopilot

---

## Assessment Purchase Flow

Assessment

↓

Review Preview Results

↓

Purchase Assessment

↓

Paystack Checkout

↓

Server Verification

↓

Generate Full Report

↓

Download Report

---

## Existing Business Flow

Create Business Profile

↓

Generate Dashboard

↓

Review Obligations

↓

Track Deadlines

↓

Maintain Compliance

---

## Compliance Monitoring Flow

Dashboard

↓

Upcoming Obligations

↓

Review Requirements

↓

Take Action

↓

Update Compliance Status

---

## Document Generation Flow

Requirement

↓

Generate Template

↓

Review

↓

Download

↓

Submit Externally

---

## Evidence Upload Flow

Requirement

↓

Upload Evidence

↓

Store Record

↓

Update Compliance Status

---

# AI Behaviour Rules

The AI must never:

* Invent regulations
* Invent compliance obligations
* Invent agencies
* Invent deadlines
* Invent costs
* Invent penalties
* Invent legal requirements

When information cannot be verified:

* Surface uncertainty
* Provide confidence levels
* Request clarification

Never present assumptions as facts.

---

# AI Architecture Expectations

LaunchSafe uses Retrieval-Augmented Generation (RAG).

AI responses must prioritize:

1. Retrieval
2. Verification
3. Context Assembly
4. Generation

Never rely solely on model memory when answering compliance-related questions.

Always prefer retrieved knowledge.

---

# Confidence Framework

Every compliance output should fit one of the following categories.

## Verified

Supported by official or trusted sources.

---

## Estimated

Derived from available information.

---

## Community Reported

Based on user-reported experiences.

---

Never represent Estimated or Community Reported information as Verified.

---

# Required Rules

The following rule files are mandatory references.

```text
rules/
├── architecture.md
├── code-style.md
├── design-system.md
├── product-rules.md
├── compliance-rules.md
├── data-architecture.md
├── security.md
├── new-component.md
└── new-api-route.md
```

Before implementing features, review applicable rule files.

Rule files take precedence over assumptions.

---

# Required Skills

Use existing skills before creating new implementations.

```text
skills/
├── compliance-report-builder
├── compliance-dashboard-builder
├── assessment-engine-builder
├── document-generator-builder
├── notification-system-builder
├── regulatory-data-manager
├── ai-compliance-engine
├── rag-knowledge-manager
├── component-builder
├── api-route-scaffolder
└── db-migration-runner
```

Always reuse existing skills when possible.

---

# Revenue Model

LaunchSafe operates using a hybrid revenue model.

Revenue Stream 1

Pre-Launch Compliance Explorer

Assessment Summary Access

Before purchasing the full assessment, users may view:

- Business type identified
- Location identified
- Number of requirements discovered
- Number of agencies involved
- Compliance complexity score
- Compliance categories involved

Users must not see:

- Exact requirements
- Agency-specific obligations
- Cost breakdowns
- Compliance timelines
- Permit details
- Licensing details
- Risk analysis
- Full compliance roadmap

These are unlocked only after successful payment verification.

Users may purchase a one-time compliance assessment report.

This includes:

- Compliance requirements
- Cost estimates
- Permit requirements
- Licensing requirements
- Compliance roadmap
- Risk analysis

No recurring subscription is required.

Revenue Stream 2

Compliance Autopilot

Users with active businesses may subscribe to ongoing compliance management.

This includes:

- Compliance dashboard
- Compliance calendar
- Notifications
- Document generation
- Compliance tracking
- Evidence management
- Regulatory monitoring

# Payment Architecture

LaunchSafe uses Paystack for:

- Assessment purchases
- Subscription billing

All payment operations must be handled server-side.

The client is responsible only for:

* Initiating checkout
* Redirecting users
* Displaying payment status

The client must never:

* Verify payments
* Activate subscriptions
* Modify billing records
* Grant feature access
* Determine payment success

These actions must always occur on the server.

---

## Payment Flow

### Pre-Launch Assessment Purchase Flow

Landing Page

↓

Business Assessment

↓

Preview Results

↓

Purchase Full Assessment

↓

Paystack Checkout

↓

Server Verification

↓

Unlock Full Compliance Report

↓

Download Report

### Subscription Billing Flow

User selects subscription plan.

↓

Server creates Paystack transaction.

↓

User completes payment through Paystack.

↓

Paystack sends webhook to server.

↓

Server verifies transaction directly with Paystack.

↓

Server updates payment records.

↓

Server activates subscription.

↓

Server unlocks paid features.

---

## Verification Requirements

Payment success must never be determined from:

* Query parameters
* Redirect URLs
* Client-side state
* Browser storage
* Frontend API responses

All successful payments must be verified using Paystack's server-side verification endpoints before any subscription changes occur.

---

## Subscription Activation Rules

Assessment Unlock Rules

Full assessment reports may only be unlocked when:

- Payment exists
- Payment is verified
- Verification occurs server-side
- Assessment purchase records are successfully updated

Assessment access must never be granted based on:

- Client-side state
- Redirect parameters
- Local storage
- Browser storage

Subscriptions may only be activated when:

* Payment exists
* Payment is verified
* Verification occurs server-side
* Billing records are successfully updated

---

## Feature Access Rules

Feature access should be determined by server-side subscription status.

Never determine access using:

* Local storage
* Session storage
* Client-side flags
* Frontend state

Always validate permissions against the database.

---

## Webhook Requirements

Paystack webhooks are the source of truth for billing events.

Webhook handlers must:

* Verify signatures
* Prevent duplicate processing
* Log billing events
* Update subscription status
* Trigger notifications

---

## Security Requirements

Never expose:

* Secret keys
* Verification keys
* Billing credentials

Never trust client-side payment information.

Always verify payment state directly with Paystack before making billing decisions.

Payment integrity is more important than user convenience.


# Design System Requirements

Typography and colors are sourced from:

```text
tokens/variables.css
```

This file is the source of truth for:

* Colors
* Typography

Additional design guidance is defined in:

```text
.agent/rules/design-system.md
```

Never create competing design systems.

Never hardcode colors or typography values that already exist in the design system.

---

# Environment Variables

The following variables are expected:

```text
DATABASE_URL

NEXT_PUBLIC_APP_URL

SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY

PAYSTACK_SECRET_KEY
PAYSTACK_PUBLIC_KEY
PAYSTACK_WEBHOOK_SECRET

DEEPSEEK_API_KEY

RESEND_API_KEY

CRON_SECRET

NEXT_PUBLIC_ENVIRONMENT
```

Never hardcode secrets.

Never expose server-side secrets to the client.

Never log secrets.

---

# Security Principles

All compliance data is sensitive.

Requirements:

* Authentication required
* Authorization required
* Audit logging required
* Secure file storage required
* Input validation required
* Principle of least privilege

Security rules are further defined in:

```text
.agent/rules/security.md
```

---

# Architecture Philosophy

LaunchSafe is a data-first platform.

Prioritize:

* Scalability
* Maintainability
* Modularity
* Auditability
* Extensibility

Avoid:

* Tight coupling
* Duplicate logic
* Deep nesting
* Overengineering
* Premature optimization

---

# UX Philosophy

The experience should feel:

* Professional
* Trustworthy
* Structured
* Modern
* Easy to understand

Primary interfaces should be:

* Dashboards
* Reports
* Checklists
* Compliance calendars
* Compliance records
* Workflow-driven screens

The primary interface must never be chat.

---

# Development Workflow

Before implementing any feature:

1. Understand the business objective.
2. Review AGENTS.md.
3. Review applicable rule files.
4. Review existing architecture.
5. Review existing components.
6. Review existing skills.
7. Reuse patterns whenever possible.
8. Implement the smallest viable solution.
9. Validate functionality.
10. Proceed to the next task.

Do not skip steps.

---

# Feature Evaluation Framework

Before adding any feature:

### Does it help users discover requirements?

### Does it help users estimate compliance costs?

### Does it help users prepare for business launch?

### Does it help users understand compliance obligations?

### Does it help users prepare compliance documentation?

### Does it help users track compliance activities?

### Does it reduce compliance risk?

### Does it improve compliance maintenance?

### Does it provide ongoing compliance value?

---

# Expansion Strategy

Phase 1

Nigeria

---

Phase 2

Ghana

---

Phase 3

Kenya

---

Phase 4

South Africa

Architecture decisions must support future geographic expansion.

Avoid country-specific assumptions where possible.

---

# Non-Negotiables

Never turn LaunchSafe into a chatbot.

Never hardcode regulatory information.

Never bypass source verification.

Never introduce compliance data without confidence levels.

Never create competing design systems.

Never use colors or typography outside `tokens/variables.css`.

Never invent regulatory obligations.

Never sacrifice accuracy for convenience.

Never trust client-side payment status.

All payment verification, subscription activation, feature access decisions, and billing updates must be performed server-side.

Never expose full compliance assessments before payment verification.

Only assessment summaries may be shown before purchase.

---

# Success Criteria

LaunchSafe succeeds when users can:

* Discover requirements before launch
* Understand obligations
* Generate supporting documentation
* Track compliance activities
* Stay ahead of deadlines
* Avoid regulatory surprises
* Determine whether a business idea is compliant before investing money.
* Estimate startup compliance costs before launch.
* Understand launch requirements before committing resources.

Every implementation should move the platform closer to those outcomes.

---

# Long-Term Vision

Today:

"Tell me what I need."

Tomorrow:

"Help me stay compliant."

Eventually:

"Handle compliance for me."

LaunchSafe should become the trusted compliance infrastructure layer for African businesses.
