---
trigger: always_on
---

# new-api-route.md

## Purpose

This document defines the rules and process for creating new API routes in LaunchSafe.

All API endpoints must follow these standards.

The goal is to ensure:

* Security
* Consistency
* Maintainability
* Auditability
* Compliance with platform architecture

If implementation conflicts with this document, this document takes precedence for API design decisions.

---

# Core Philosophy

API routes should be thin.

API routes are responsible for:

* Authentication
* Authorization
* Validation
* Service invocation
* Response formatting

API routes are not responsible for:

* Business logic
* Compliance calculations
* Payment decisions
* Regulatory analysis
* Database orchestration

Those responsibilities belong to services.

---

# Mandatory Pre-Route Checklist

Before creating a route:

## Step 1

Check whether a route already exists.

Questions:

* Does a similar endpoint already exist?
* Can the existing route be extended?
* Can existing services solve the problem?

Do not create duplicate routes.

---

## Step 2

Determine the owning domain.

Examples:

```text id="l4xg2o"
assessment
billing
compliance
documents
notifications
regulatory
businesses
```

Every route must belong to exactly one domain.

---

## Step 3

Identify required permissions.

Questions:

* Is authentication required?
* Is authorization required?
* Is ownership verification required?

---

## Step 4

Determine whether the route contains sensitive actions.

Examples:

* Payment verification
* Report unlocking
* Subscription activation
* Document generation

Sensitive actions require additional validation.

---

# Route Structure

Preferred structure:

```text id="vvk8q0"
/api

/api/assessments
/api/businesses
/api/compliance
/api/billing
/api/documents
/api/notifications
/api/regulatory
```

Avoid unrelated route nesting.

---

# Naming Rules

Use clear nouns.

Good:

```text id="xv6p9j"
/api/assessments
/api/subscriptions
/api/payments
```

Bad:

```text id="c5k2h8"
/api/do-assessment
/api/run-payment
/api/get-business
```

---

# HTTP Method Rules

## GET

Retrieve data.

Must never mutate state.

---

## POST

Create data.

Examples:

* Create assessment
* Create subscription
* Generate document

---

## PATCH

Update data.

Examples:

* Update business
* Update task status

---

## DELETE

Remove data.

Must be used carefully.

---

# Authentication Rules

Protected routes must require authentication.

Examples:

```text id="v7n4e0"
/api/businesses
/api/subscriptions
/api/documents
/api/compliance
```

---

# Authorization Rules

Authentication is not enough.

Routes must verify:

* User identity
* Resource ownership
* Permission level

---

## Example

User A must never access:

```text id="x2yq49"
User B's:

- Business
- Assessment
- Documents
- Evidence
```

even if they know the ID.

---

# Ownership Verification Rules

Every business-owned resource must verify ownership.

Examples:

* Assessments
* Compliance tasks
* Documents
* Evidence
* Notifications

Ownership checks must happen server-side.

---

# Validation Rules

Every route must validate input.

Validate:

* Request body
* Query parameters
* Route parameters

Never trust client input.

---

# Service Layer Rules

API routes must delegate business logic.

Good:

```text id="1pxd80"
Route

↓

Validation

↓

AssessmentService

↓

Response
```

Bad:

```text id="gm8txk"
Route

↓

Complex business logic

↓

Database writes

↓

Response
```

---

# Database Rules

Routes must not directly contain large database operations.

Prefer:

```text id="mk1gcb"
Route

↓

Service

↓

Repository

↓

Database
```

---

# Response Rules

Responses should be consistent.

Success:

```json
{
  "success": true,
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "message": "Assessment not found"
  }
}
```

---

# Error Handling Rules

Errors should be:

* Consistent
* Actionable
* Human-readable

Do not expose:

* Database structure
* Internal IDs
* Secrets
* Stack traces

---

# Assessment Route Rules

Assessment routes must respect payment gating.

Before payment:

Allowed:

* Assessment summary

Forbidden:

* Full report details
* Cost breakdowns
* Launch roadmap

---

# Assessment Creation Flow

```text id="m6m2u9"
Assessment Request

↓

Validation

↓

Assessment Service

↓

Summary Generation

↓

Response
```

---

# Full Report Access Rules

Full reports require:

* Verified purchase
* Server-side verification

Client-side status must never unlock reports.

---

# Billing Route Rules

Billing routes are security-critical.

Examples:

```text id="9r3k9q"
/api/payments
/api/subscriptions
/api/webhooks/paystack
```

---

# Payment Verification Rules

Only server-side verification may:

* Unlock reports
* Activate subscriptions
* Grant premium access

---

# Webhook Rules

Paystack webhooks must:

* Verify signatures
* Validate events
* Log activity
* Prevent duplicate processing

---

# Subscription Route Rules

Subscription activation requires:

* Verified payment
* Billing event creation
* Subscription status update

---

# Compliance Route Rules

Compliance routes may:

* Create tasks
* Update task status
* Retrieve compliance information

Compliance routes must never invent regulatory information.

---

# Regulatory Route Rules

Regulatory routes are platform-owned.

Regular users must never:

* Create requirements
* Edit requirements
* Delete requirements

Only authorized administrators may perform those actions.

---

# Document Route Rules

Document routes may:

* Generate documents
* Retrieve documents
* Download documents

Generated documents should always be logged.

---

# File Upload Route Rules

Uploads must validate:

* File type
* File size
* Ownership

Unsupported file types should be rejected.

---

# AI Route Rules

AI routes must use retrieval.

Required flow:

```text id="zjlwmq"
Request

↓

Knowledge Retrieval

↓

Context Assembly

↓

LLM

↓

Response
```

---

# Anti-Hallucination Rules

AI routes must never:

* Invent requirements
* Invent fees
* Invent deadlines
* Invent penalties

Responses must be grounded in retrieved regulatory data.

---

# Logging Rules

Log:

* Assessment creation
* Report unlocks
* Payment verification
* Subscription activation
* Regulatory updates
* Document generation

Do not log:

* Passwords
* Secrets
* Payment credentials

---

# Audit Rules

Critical routes must create audit records.

Examples:

* Assessment purchases
* Subscription changes
* Payment verification
* Regulatory modifications

Audit logs must be immutable.

---

# Rate Limiting Rules

Apply rate limits to:

* Authentication routes
* Billing routes
* AI routes
* Search routes

Protect against abuse.

---

# Environment Variable Rules

Never hardcode:

* API keys
* Database URLs
* Secrets

Always use environment variables.

---

# Route Acceptance Checklist

A route is considered complete only when:

✓ Authentication implemented

✓ Authorization implemented

✓ Ownership checks implemented

✓ Validation implemented

✓ Service layer used

✓ Error handling implemented

✓ Logging implemented

✓ Security rules followed

✓ Response format standardized

✓ Tests added where required

---

# Non-Negotiables

Never:

* Put business logic inside routes
* Trust client-side payment status
* Skip ownership checks
* Expose locked assessment content
* Expose secrets
* Bypass service layers
* Invent regulatory information

Security, consistency, and correctness take priority over speed of implementation.
