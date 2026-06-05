---
trigger: always_on
---

# architecture.md

## Purpose

This document defines the architectural principles, system boundaries, module responsibilities, service patterns, and implementation standards for LaunchSafe.

All new features, API routes, database changes, services, jobs, AI systems, and UI modules must follow these architectural rules.

If implementation conflicts with architecture.md, architecture.md takes precedence for structural decisions.

---

# Architecture Philosophy

LaunchSafe is:

* A compliance intelligence platform
* A compliance operations platform
* A data platform

LaunchSafe is not:

* A chatbot
* A legal advice platform
* A collection of disconnected features

The architecture should optimize for:

* Scalability
* Maintainability
* Traceability
* Reliability
* Security

---

# Core Architectural Principles

## Domain-Driven Design

The application should be organized around business domains.

Not:

```text
components/
pages/
utils/
```

But:

```text
assessment/
compliance/
billing/
documents/
regulatory/
notifications/
```

Business concepts should drive structure.

---

## Modular Architecture

Each module should own:

* UI
* Business logic
* Validation
* API routes
* Services

Avoid tightly coupled modules.

---

## Separation of Concerns

Separate:

* UI
* Business Logic
* Data Access
* External Integrations

No layer should directly own responsibilities belonging to another layer.

---

## Server Authority

Critical decisions must happen on the server.

Examples:

* Payment verification
* Report unlocking
* Subscription activation
* Permission checks
* Compliance status changes

The client is never the source of truth.

---

# High-Level Architecture

```text
Frontend

↓

Application Layer

↓

Domain Services

↓

Database Layer

↓

Knowledge Layer

↓

AI Layer

↓

External Services
```

---

# Primary Domains

LaunchSafe should be organized into the following domains.

## Assessment Domain

Responsible for:

* Assessments
* Assessment summaries
* Full compliance reports
* Assessment purchases

---

## Compliance Domain

Responsible for:

* Compliance tasks
* Deadlines
* Statuses
* Compliance scores
* Compliance timelines

---

## Regulatory Domain

Responsible for:

* Agencies
* Requirements
* Sources
* Costs
* Deadlines
* Regulatory updates

---

## Billing Domain

Responsible for:

* Assessment purchases
* Subscription plans
* Subscriptions
* Payments
* Billing events

---

## Document Domain

Responsible for:

* Document generation
* Templates
* Downloads
* Compliance records

---

## Evidence Domain

Responsible for:

* Uploads
* Compliance proof
* Verification records

---

## Notification Domain

Responsible for:

* In-app notifications
* Email notifications
* Reminder scheduling

---

## AI Domain

Responsible for:

* RAG
* Summaries
* Explanations
* Recommendations
* Document generation

---

# Module Boundaries

Domains may communicate through services.

Domains must not directly manipulate another domain's internal state.

Example:

Good:

```text
Assessment Service

↓

Billing Service

↓

Assessment Unlock Service
```

Bad:

```text
Assessment Component

↓

Direct Database Update

↓

Unlock Report
```

---

# Frontend Architecture

Recommended:

```text
app/
features/
components/
lib/
hooks/
services/
```

---

## Feature-Based Structure

Example:

```text
features/

assessment/
billing/
compliance/
documents/
notifications/
regulatory/
settings/
```

Avoid organizing primarily by component type.

---

# Backend Architecture

Recommended:

```text
api/
services/
repositories/
validators/
jobs/
```

---

## Service Layer

All business logic should live in services.

Examples:

```text
AssessmentService

ComplianceService

BillingService

NotificationService

DocumentService
```

Business logic should not live in components.

---

## Repository Layer

Repositories should be responsible for:

* Database reads
* Database writes

Nothing else.

---

## Validation Layer

Validation should occur before:

* Database writes
* External API calls
* AI requests

---

# Assessment Architecture

Assessment processing should follow:

```text
Assessment Input

↓

Assessment Engine

↓

Requirement Matching

↓

Summary Generation

↓

Assessment Summary

↓

Purchase

↓

Payment Verification

↓

Full Report Generation
```

Full reports must never be generated solely from client requests.

---

# Billing Architecture

Assessment purchases and subscriptions are separate flows.

---

## Assessment Billing Flow

```text
Assessment Summary

↓

Purchase

↓

Paystack

↓

Server Verification

↓

Unlock Report
```

---

## Subscription Billing Flow

```text
Choose Plan

↓

Paystack

↓

Server Verification

↓

Activate Subscription
```

---

# Compliance Architecture

Compliance tasks are generated from requirements.

```text
Requirements

↓

Business Profile

↓

Compliance Engine

↓

Compliance Tasks

↓

Compliance Dashboard
```

Tasks should remain reproducible.

---

# Regulatory Architecture

Regulatory data is platform-owned.

Users never edit:

* Requirements
* Sources
* Agencies

Users only consume regulatory intelligence.

---

# Document Architecture

Document generation should follow:

```text
Requirement

↓

Document Template

↓

AI Generation

↓

Review

↓

Store Document
```

Generated documents should be versioned.

---

# Notification Architecture

Notifications should be event-driven.

Example:

```text
Requirement Due Soon

↓

Event

↓

Notification Service

↓

Email + In-App Alert
```

Avoid scheduled UI polling.

---

# AI Architecture

LaunchSafe uses AI as a supporting layer.

AI is never the primary source of truth.

---

## AI Flow

```text
User Request

↓

Knowledge Retrieval

↓

Context Assembly

↓

LLM

↓

Structured Response
```

---

## RAG Requirement

All compliance responses must use retrieval.

Model memory must never be treated as regulatory authority.

---

# Background Jobs

Background jobs should handle:

* Reminder scheduling
* Regulatory update processing
* Compliance score recalculation
* Notification dispatch
* Billing synchronization
* Subscription status updates

Heavy processes should not run in request cycles.

---

# API Architecture

API routes should be thin.

Responsibilities:

* Authentication
* Validation
* Service invocation
* Response formatting

API routes should not contain business logic.

---

# Storage Architecture

Supabase Storage should be used for:

* Evidence
* Generated documents
* Templates

Storage access must be permission-controlled.

---

# Search Architecture

Search should support:

* Requirements
* Agencies
* Industries
* Documents
* Regulatory updates

Search results must remain filterable.

---

# Scalability Rules

Architecture should support:

* Additional countries
* Additional industries
* Additional agencies
* Additional payment providers
* Additional AI providers

No architectural decision should assume Nigeria is the only market.

---

# Error Handling Rules

Errors should:

* Be logged
* Be traceable
* Be user-friendly

Errors must not expose:

* Internal architecture
* Database structure
* Secrets

---

# Performance Rules

Targets:

Dashboard Load Time:

* Less than 3 seconds

Assessment Generation:

* Less than 10 seconds

Assessment Summary Generation:

* Less than 5 seconds

Notification Delivery:

* Near real-time

---

# Non-Negotiables

Never:

* Put business logic inside UI components
* Trust client-side payment status
* Allow modules to bypass service layers
* Hardcode regulatory requirements
* Use AI as a regulatory source
* Allow direct database access from the frontend

Architecture must prioritize maintainability, traceability, and compliance accuracy over implementation speed.
