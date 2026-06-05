---
trigger: always_on
---

# data-architecture.md

## Purpose

This document defines the data architecture, schema principles, entity relationships, and data governance rules for LaunchSafe.

All database design, migrations, API routes, services, background jobs, and AI retrieval systems must follow these rules.

If implementation conflicts with this document, this document takes precedence for data modeling decisions.

---

# Core Philosophy

LaunchSafe is a data platform before it is an application.

The quality of the product depends on:

* Data accuracy
* Data traceability
* Data consistency
* Data relationships
* Data auditability

Every feature ultimately depends on the integrity of the underlying data model.

---

# Data Domains

LaunchSafe data is divided into four domains.

## User Data

Represents customer-owned information.

Examples:

* Users
* Businesses
* Assessments
* Compliance tasks
* Documents
* Evidence
* Notifications

---

## Regulatory Data

Represents structured compliance intelligence.

Examples:

* Agencies
* Requirements
* Sources
* Costs
* Deadlines
* Industries
* Locations

---

## Billing Data

Represents payments and subscriptions.

Examples:

* Assessment purchases
* Subscription plans
* Subscriptions
* Payments
* Billing events

---

## AI Knowledge Data

Represents retrieval and generation systems.

Examples:

* Embeddings
* Regulatory documents
* Summaries
* Generated content
* Regulatory updates

---

# Database Design Principles

## Source of Truth

Each piece of information should have a single authoritative source.

Avoid duplication whenever possible.

---

## Normalization

Regulatory requirements should not be duplicated unnecessarily.

Agencies, industries, locations, and requirements should exist as reusable entities.

---

## Auditability

All important actions must be traceable.

Historical records should be preserved whenever possible.

---

## Geographic Flexibility

The schema must support:

* Countries
* States
* Cities
* LGAs

without requiring redesign.

---

## Industry Flexibility

Requirements should be reusable across industries when appropriate.

---

# Core Entity Groups

## User Domain

Users

↓

Businesses

↓

Assessments

↓

Compliance Tasks

↓

Documents

↓

Evidence

↓

Notifications

↓

Compliance Scores

---

## Billing Domain

Users

↓

Assessment Purchases

↓

Payments

Users

↓

Subscriptions

↓

Subscription Plans

↓

Billing Events

---

## Regulatory Domain

Countries

↓

States

↓

LGAs

↓

Industries

↓

Requirements

↓

Agencies

↓

Sources

↓

Costs

↓

Deadlines

↓

Required Documents

---

# User Domain Rules

## Users

Represents platform accounts.

A user may own multiple businesses.

A user may have:

* Assessment purchases
* Subscriptions
* Notifications
* Generated documents

---

## Businesses

Represents a real business.

A business belongs to exactly one user.

A business may have:

* Assessments
* Tasks
* Documents
* Evidence
* Compliance scores

---

# Assessment Rules

## Assessments

Assessments represent compliance discovery.

Every assessment must contain:

* Industry
* Location
* Business profile
* Generated summary

---

## Assessment Summary

Assessment summaries are available before payment.

Stored in:

```text
summary_json
```

Contains:

* Requirement count
* Agency count
* Compliance complexity
* Compliance categories

Must not contain:

* Detailed obligations
* Costs
* Risk analysis
* Launch roadmap

---

## Full Compliance Report

Stored in:

```text
results_json
```

Access requires:

* Valid payment
* Server-side verification

---

# Billing Domain Rules

## Assessment Purchases

Represents one-time purchases.

One assessment may have one purchase record.

Assessment access must be controlled through purchase status.

---

## Subscription Plans

Represents available plans.

Supported plans:

* Free
* Pro
* Business
* Enterprise

Plans should be configurable.

Plan logic must not be hardcoded.

---

## Subscriptions

Represents recurring billing relationships.

Subscriptions determine:

* Feature access
* Limits
* Permissions

Status values:

* Trial
* Active
* Expired
* Cancelled

---

## Payments

Represents all billing transactions.

Supported payment types:

* Assessment
* Subscription

Supported statuses:

* Pending
* Paid
* Failed
* Refunded

Payment records must never store card information.

---

## Billing Events

Represents subscription lifecycle activity.

Examples:

* Subscription created
* Subscription renewed
* Subscription expired
* Payment failed
* Payment refunded

---

# Regulatory Domain Rules

## Countries

Top-level geographic entity.

---

## States

Belong to countries.

---

## LGAs

Belong to states.

---

## Industries

Represent business sectors.

Examples:

* Restaurant
* Pharmacy
* Fintech
* Food Processing
* E-commerce

---

## Agencies

Represent regulatory authorities.

Examples:

* CAC
* FIRS
* NAFDAC
* SON
* NDPC

---

## Requirements

Requirements are the most important regulatory entity.

Every requirement must contain:

* Agency
* Industry
* Jurisdiction
* Confidence level
* Verification status

Requirements must be reusable.

---

## Requirement Costs

Supported cost types:

* Registration
* Renewal
* Inspection
* Filing
* Estimated
* Community Reported

Official and community-reported costs must remain separate.

---

## Requirement Deadlines

Supported frequencies:

* One-time
* Monthly
* Quarterly
* Annual
* Event-driven

---

## Requirement Sources

Every requirement must have a source.

Requirements without sources must not be marked verified.

---

# Compliance Domain Rules

## Compliance Tasks

Represents obligations assigned to businesses.

Supported statuses:

* Not Started
* In Progress
* Awaiting Submission
* Submitted
* Approved
* Due Soon
* Overdue
* Completed

---

## Compliance Scores

Scores range:

0 - 100

Must be explainable.

Score calculations must remain reproducible.

---

## Notifications

Must always reference:

* User
* Business
* Event

Notification history should be retained.

---

# Document Domain Rules

## Generated Documents

Documents generated by LaunchSafe.

Examples:

* Application letters
* Compliance plans
* Policies
* Checklists

---

## Evidence

Evidence represents uploaded proof.

Examples:

* Receipts
* Permits
* Certificates
* Inspection reports

Evidence must remain immutable after upload.

Replacements should create new records.

---

# Regulatory Updates Domain

## Regulatory Updates

Stores regulatory changes.

Must contain:

* Title
* Summary
* Source
* Effective date

---

## Regulatory Impacts

Stores affected:

* Industries
* Requirements
* Businesses

Impact levels:

* Low
* Medium
* High

---

# AI Knowledge Architecture

## Vector Database

Recommended:

pgvector

Reasons:

* PostgreSQL integration
* Lower complexity
* Lower cost

---

## Embeddings

Only approved content may be embedded.

Examples:

* Regulations
* Circulars
* Guidelines
* Agency publications
* Compliance templates

---

## Retrieval Rules

All AI responses must originate from retrieved content.

Model memory must never be treated as a regulatory source.

---

# Audit Logging Rules

All critical actions must be logged.

Examples:

* Assessment creation
* Assessment purchase
* Subscription creation
* Payment verification
* Evidence upload
* Document generation
* Compliance score updates

Audit logs must be append-only.

---

# Data Retention Rules

Business data should not be deleted automatically.

Expired subscriptions must not remove:

* Businesses
* Assessments
* Documents
* Evidence
* Compliance history

Users lose access, not ownership.

---

# Migration Rules

Every migration must:

* Be reversible
* Be documented
* Preserve existing data
* Include rollback procedures

Destructive migrations require explicit approval.

---

# Future Expansion Rules

All schemas must support:

* Multi-country expansion
* Multi-state expansion
* Multi-industry expansion
* Additional regulators
* Additional billing providers

No schema should assume Nigeria is the only supported market.

---

# Non-Negotiables

Never:

* Store payment card data
* Remove source traceability
* Merge official and community-reported costs
* Unlock reports without verified payment
* Delete audit records
* Hardcode country-specific assumptions into core entities

Data integrity is more important than implementation speed.
