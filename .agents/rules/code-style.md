---
trigger: always_on
---

# code-style.md

## Purpose

This document defines coding standards, naming conventions, project organization rules, TypeScript standards, React standards, database interaction standards, API standards, and AI-generated code requirements for LaunchSafe.

All generated code must comply with this document.

If implementation conflicts with this document, this document takes precedence for coding decisions.

---

# Core Philosophy

LaunchSafe is a long-term product.

Code should optimize for:

* Maintainability
* Readability
* Scalability
* Consistency
* Security

Never optimize for writing the fewest lines of code.

Optimize for future developers and AI agents.

---

# General Rules

Code should be:

* Explicit
* Predictable
* Typed
* Testable
* Reusable

Avoid:

* Clever code
* Hidden behavior
* Magic values
* Unclear abstractions

---

# Language Standards

## TypeScript Required

Use TypeScript everywhere.

Avoid plain JavaScript.

---

## Strict Mode

TypeScript strict mode must remain enabled.

Do not bypass type safety.

---

# Naming Conventions

## Components

Use PascalCase.

Good:

```text id="efycrs"
AssessmentSummary
ComplianceDashboard
BusinessCard
```

Bad:

```text id="w7b9ga"
assessmentSummary
assessment-summary
```

---

## Functions

Use camelCase.

Good:

```text id="d6hbrm"
generateAssessment()
verifyPayment()
calculateComplianceScore()
```

---

## Variables

Use camelCase.

Good:

```text id="mjlwmn"
assessmentResult
paymentStatus
businessProfile
```

---

## Constants

Use UPPER_SNAKE_CASE.

Good:

```text id="lbgz7p"
MAX_FILE_SIZE
DEFAULT_PAGE_SIZE
```

---

## Types

Use PascalCase.

Good:

```text id="wyv2hx"
Business
AssessmentSummary
ComplianceRequirement
```

---

## Enums

Use PascalCase.

Good:

```text id="vwni4m"
SubscriptionStatus
RequirementType
```

---

# File Naming Rules

Use kebab-case.

Good:

```text id="kuz3cu"
assessment-service.ts
payment-verification.ts
compliance-score.ts
```

Bad:

```text id="hqtqta"
AssessmentService.ts
assessmentService.ts
```

---

# Folder Structure Rules

Organize by feature.

Preferred:

```text id="e0n8f0"
features/

assessment/
billing/
compliance/
documents/
notifications/
regulatory/
```

Avoid organizing primarily by file type.

---

# Component Rules

## One Responsibility

Components should have one clear purpose.

Avoid components that do everything.

---

## Component Size

When a component becomes difficult to understand:

Extract subcomponents.

---

## Reusability

Before creating a new component:

1. Search existing components
2. Reuse if possible
3. Extend if necessary

Do not duplicate UI patterns.

---

# React Rules

## Functional Components Only

Use functional components.

Do not create class components.

---

## Hooks

Prefer hooks over custom state abstractions.

---

## Keep Hooks Predictable

Avoid:

```text id="kewjlwm"
Complex nested effects
Hidden dependencies
```

---

## Side Effects

Keep side effects isolated.

Prefer dedicated services.

---

# State Management Rules

## Local First

Use local state where appropriate.

---

## Shared State

Only elevate state when necessary.

---

## Avoid Global State Abuse

Do not put everything in global state.

---

# Styling Rules

All styling must follow:

```text id="qzuxhy"
design-system.md
```

and

```text id="mrg1wn"
tokens/variables.css
```

---

## CSS Modules Required

Use:

```text id="ykd2sz"
Component.module.css
```

for component styling.

---

## No Inline Styling

Avoid:

```jsx id="3xzknv"
style={{}}
```

except for truly dynamic values.

---

## No Tailwind

Never introduce Tailwind.

---

# Type Rules

## No Any

Avoid:

```ts id="kpn4a7"
any
```

Use proper types.

---

## Explicit Types

Public interfaces should always be typed.

---

## Shared Types

Place reusable types in shared type files.

Avoid duplication.

---

# API Route Rules

API routes should remain thin.

Responsibilities:

* Authentication
* Validation
* Service invocation
* Response formatting

Business logic belongs in services.

---

# Service Rules

Services contain business logic.

Examples:

```text id="j44kda"
AssessmentService
BillingService
ComplianceService
DocumentService
```

---

## Service Responsibilities

Services may:

* Execute business rules
* Coordinate workflows
* Trigger events

Services should not:

* Render UI
* Own presentation logic

---

# Repository Rules

Repositories handle:

* Database reads
* Database writes

Nothing else.

---

# Validation Rules

Validate before:

* Database writes
* AI requests
* Payment operations
* File uploads

Never trust client input.

---

# Database Rules

Database access should occur through repositories or dedicated data services.

Avoid direct database queries inside components.

---

# Security Rules

Follow:

```text id="s3tqbn"
security.md
```

at all times.

---

## Never Trust Client State

Do not trust:

* Local storage
* Query parameters
* Client-side payment flags

Always verify on the server.

---

# Payment Rules

Payment verification must always occur server-side.

Never unlock:

* Full reports
* Subscriptions
* Premium features

from client-side logic.

---

# Assessment Rules

Assessment summaries and full reports are different entities.

Do not expose locked report content before payment verification.

---

# Regulatory Data Rules

Follow:

```text id="u7n3xt"
regulatory-knowledge-rules.md
```

for all compliance intelligence work.

---

## Never Hardcode Regulatory Data

Do not hardcode:

* Fees
* Agencies
* Requirements
* Deadlines

Retrieve from data sources.

---

# AI Code Generation Rules

When generating code:

Prefer:

* Clarity
* Explicitness
* Maintainability

Avoid:

* Clever abstractions
* Overengineering
* Premature optimization

---

# Error Handling Rules

Errors should:

* Be logged
* Be actionable
* Be user-friendly

Bad:

```text id="a8q7xk"
Something went wrong
```

Good:

```text id="9l1v7n"
Assessment generation failed because no regulatory requirements were found for the selected industry.
```

---

# Logging Rules

Log:

* Assessment creation
* Payment verification
* Subscription activation
* Compliance updates
* Document generation

Do not log:

* Passwords
* Secrets
* Payment credentials

---

# Environment Variable Rules

Never hardcode:

* API keys
* Database URLs
* Secrets

Use environment variables.

---

# Testing Rules

Critical systems should have tests.

Priority areas:

1. Billing
2. Assessment generation
3. Report unlocking
4. Compliance scoring
5. Regulatory retrieval

---

# Refactoring Rules

When modifying code:

1. Preserve behavior
2. Improve clarity
3. Reduce duplication

Do not perform large rewrites without justification.

---

# AI Agent Rules

Before generating code:

1. Check AGENTS.md
2. Check relevant rules files
3. Reuse existing patterns
4. Follow established architecture

Never invent new architectural patterns without justification.

---

# Non-Negotiables

Never:

* Use `any`
* Introduce Tailwind
* Put business logic in components
* Trust client-side payment state
* Hardcode regulatory information
* Bypass service layers
* Expose locked assessment content
* Store secrets in code

Maintainability and correctness are more important than speed.
