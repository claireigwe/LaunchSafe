# skill: api-route-scaffolder

## Purpose

This skill is responsible for creating, extending, refactoring, and maintaining API routes throughout LaunchSafe.

This skill ensures all API endpoints follow:

* AGENTS.md
* architecture.md
* security.md
* code-style.md
* new-api-route.md
* billing-rules.md
* compliance-rules.md

This skill should be used whenever a new API endpoint is required.

---

# Core Philosophy

API routes should be thin.

API routes are orchestration layers.

API routes are not business logic layers.

The route should:

* Authenticate
* Authorize
* Validate
* Call Services
* Return Responses

Nothing more.

---

# Primary Responsibilities

This skill is responsible for:

* Route creation
* Route validation
* Route security
* Route standardization
* Route documentation
* Route refactoring

This skill is not responsible for:

* Business logic
* Database orchestration
* Compliance calculations
* Payment decisions

Those belong to services.

---

# Mandatory Pre-Build Checklist

Before creating a route:

## Step 1

Check whether a similar route already exists.

Questions:

* Does this endpoint already exist?
* Can an existing endpoint be extended?
* Does a service already support this use case?

Avoid route duplication.

---

## Step 2

Determine the owning domain.

Examples:

```text id="api01"
assessment
billing
compliance
documents
notifications
regulatory
businesses
users
```

Every route belongs to exactly one domain.

---

## Step 3

Determine required permissions.

Questions:

* Is authentication required?
* Is authorization required?
* Is ownership verification required?

---

## Step 4

Identify sensitive operations.

Examples:

* Payment verification
* Subscription activation
* Report unlocking
* Document generation

Additional validation is required.

---

# Route Architecture

Preferred flow:

```text id="api02"
Route

↓

Authentication

↓

Authorization

↓

Validation

↓

Service

↓

Response
```

---

# Forbidden Flow

```text id="api03"
Route

↓

Complex Business Logic

↓

Database Queries

↓

Response
```

Business logic must not live inside routes.

---

# Folder Structure

Preferred structure:

```text id="api04"
api/

assessment/
billing/
businesses/
compliance/
documents/
notifications/
regulatory/
users/
```

---

# Naming Rules

Use resource-based naming.

Good:

```text id="api05"
/api/assessments
/api/payments
/api/subscriptions
/api/compliance-tasks
```

Bad:

```text id="api06"
/api/run-assessment
/api/pay-now
/api/do-compliance
```

---

# HTTP Method Rules

## GET

Read data only.

Must never mutate state.

---

## POST

Create resources.

Examples:

* Create assessment
* Create subscription
* Generate document

---

## PATCH

Update resources.

Examples:

* Update business
* Update task status

---

## DELETE

Delete resources.

Use carefully.

---

# Authentication Rules

Protected routes must require authentication.

Examples:

```text id="api07"
/api/businesses
/api/documents
/api/compliance
/api/subscriptions
```

---

# Authorization Rules

Authentication is not enough.

Routes must verify:

* User identity
* Permissions
* Resource ownership

---

# Ownership Verification Rules

Every user-owned resource must validate ownership.

Examples:

* Businesses
* Assessments
* Documents
* Evidence
* Notifications
* Compliance tasks

Ownership checks must occur server-side.

---

# Validation Rules

All route inputs must be validated.

Validate:

* Request body
* Query parameters
* Route parameters

Never trust client input.

---

# Validation Layer Rules

Validation should happen before:

* Service calls
* Database writes
* AI requests
* Payment operations

---

# Service Layer Rules

Routes should invoke services.

Examples:

```text id="api08"
AssessmentService
BillingService
ComplianceService
NotificationService
DocumentService
```

---

# Repository Rules

Routes should never directly manage complex database operations.

Preferred flow:

```text id="api09"
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

All responses should be standardized.

Success:

```json id="api10"
{
  "success": true,
  "data": {}
}
```

Error:

```json id="api11"
{
  "success": false,
  "error": {
    "message": "Assessment not found"
  }
}
```

---

# Error Handling Rules

Errors should:

* Be consistent
* Be traceable
* Be human-readable

Do not expose:

* Database schemas
* Internal IDs
* Secrets
* Stack traces

---

# Assessment Route Rules

Assessment routes may:

* Create assessments
* Retrieve summaries
* Retrieve reports

---

## Assessment Summary Rules

Before payment:

Allowed:

* Summary data
* Requirement count
* Agency count
* Complexity score

Forbidden:

* Full report data
* Cost breakdowns
* Roadmaps
* Risk analysis

---

## Full Report Access Rules

Full reports require:

* Verified purchase
* Server-side verification

---

# Billing Route Rules

Billing routes are security-critical.

Examples:

```text id="api12"
/api/payments
/api/subscriptions
/api/webhooks/paystack
```

---

# Payment Verification Rules

Only the server may:

* Verify payments
* Unlock reports
* Activate subscriptions

Never trust:

* Success URLs
* Query strings
* Local storage
* Client state

---

# Webhook Rules

Paystack webhooks must:

* Verify signatures
* Validate payloads
* Prevent duplicate processing
* Create audit logs

Webhooks are authoritative.

---

# Subscription Route Rules

Subscription activation requires:

* Verified payment
* Subscription creation
* Billing event creation

---

# Compliance Route Rules

Compliance routes may:

* Retrieve obligations
* Update task status
* Retrieve compliance scores
* Retrieve deadlines

Compliance routes must never generate compliance intelligence.

They consume compliance intelligence.

---

# Regulatory Route Rules

Regulatory routes are admin-controlled.

Regular users must not:

* Create requirements
* Modify requirements
* Delete requirements

Only authorized administrators may do so.

---

# Document Route Rules

Document routes may:

* Generate documents
* Retrieve documents
* Download documents

Document generation should always be logged.

---

# File Upload Route Rules

Uploads must validate:

* File type
* File size
* Ownership

Reject unsupported files.

---

# AI Route Rules

AI routes must use RAG.

Required flow:

```text id="api13"
Request

↓

Retrieval

↓

Context Assembly

↓

AI Generation

↓

Response
```

---

# Anti-Hallucination Rules

AI routes must never:

* Invent requirements
* Invent fees
* Invent deadlines
* Invent agencies

Responses must be grounded in retrieved knowledge.

---

# Logging Rules

Log:

* Assessment creation
* Report unlocks
* Payment verification
* Subscription activation
* Document generation
* Regulatory modifications

---

# Audit Rules

Critical routes must generate audit records.

Examples:

* Payment verification
* Subscription activation
* Assessment purchases
* Regulatory updates

Audit records must be immutable.

---

# Rate Limiting Rules

Apply rate limits to:

* Authentication routes
* Billing routes
* AI routes
* Search routes

Protect the platform from abuse.

---

# Security Rules

Follow:

```text id="api14"
security.md
```

at all times.

Never expose:

* Secrets
* Service role keys
* Internal architecture

---

# Testing Rules

Critical routes should have tests.

Highest priority:

1. Billing
2. Assessment Access
3. Subscription Access
4. Regulatory Retrieval
5. Document Generation

---

# Generated Route Requirements

Every generated route should include:

✓ Authentication

✓ Authorization

✓ Validation

✓ Error handling

✓ Service invocation

✓ Standardized response format

✓ Logging

✓ Security checks

---

# Required Dependencies

This skill should follow:

* AGENTS.md
* architecture.md
* security.md
* code-style.md
* new-api-route.md
* billing-rules.md

---

# Completion Checklist

✓ Existing routes reviewed

✓ Correct domain selected

✓ Authentication implemented

✓ Authorization implemented

✓ Ownership checks implemented

✓ Validation implemented

✓ Service layer used

✓ Logging implemented

✓ Audit requirements met

✓ Security requirements met

---

# Non-Negotiables

Never:

* Put business logic inside routes
* Trust client-side payment status
* Skip ownership verification
* Expose locked assessment content
* Expose secrets
* Bypass service layers
* Invent compliance information

API routes exist to enforce security, consistency, and architecture.
