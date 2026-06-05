# skill: db-migration-runner

## Purpose

This skill is responsible for creating, reviewing, validating, executing, and documenting database migrations throughout LaunchSafe.

This skill protects the integrity of:

* Regulatory data
* Assessment data
* Compliance data
* Billing data
* User data
* AI knowledge data
* Audit data

Database migrations are high-risk operations.

Data integrity always takes priority over development speed.

---

# Core Philosophy

A migration should be:

* Safe
* Reversible
* Auditable
* Predictable

The purpose of a migration is to evolve the schema without risking data loss.

---

# Primary Responsibilities

This skill is responsible for:

* Schema migrations
* Table creation
* Table modification
* Index creation
* Constraint management
* Data migrations
* Rollback planning
* Migration validation

This skill is not responsible for:

* Business logic
* API creation
* UI implementation
* Regulatory calculations

---

# Mandatory Pre-Migration Checklist

Before creating a migration:

## Step 1

Review:

```text id="db01"
data-architecture.md
```

---

## Step 2

Review:

```text id="db02"
architecture.md
```

---

## Step 3

Determine impact.

Questions:

* Which tables are affected?
* Which services are affected?
* Which APIs are affected?
* Which reports are affected?

---

## Step 4

Determine rollback strategy.

Every migration must have a rollback plan.

---

# Migration Philosophy

Prefer:

```text id="db03"
Additive Changes
```

over:

```text id="db04"
Destructive Changes
```

Adding columns is safer than removing columns.

---

# Approved Migration Types

## New Tables

Examples:

* notifications
* regulatory_updates
* billing_events

---

## New Columns

Examples:

* status
* verification_date
* confidence_level

---

## New Indexes

Examples:

* search optimization
* filtering optimization

---

## New Constraints

Examples:

* foreign keys
* unique constraints
* validation constraints

---

## Data Migrations

Examples:

* status normalization
* record transformation
* schema upgrades

---

# High-Risk Migration Types

The following require extra caution:

## Column Removal

Examples:

```sql id="db05"
DROP COLUMN
```

---

## Table Removal

Examples:

```sql id="db06"
DROP TABLE
```

---

## Data Deletion

Examples:

```sql id="db07"
DELETE
TRUNCATE
```

---

## Constraint Changes

Examples:

* Foreign key modifications
* Unique constraint modifications

---

# Destructive Migration Rules

Before destructive changes:

1. Confirm necessity
2. Create backup
3. Document impact
4. Create rollback strategy

Destructive changes require explicit approval.

---

# Database Design Rules

All migrations must follow:

```text id="db08"
data-architecture.md
```

---

# Naming Rules

Use:

```text id="db09"
snake_case
```

for:

* Tables
* Columns
* Indexes
* Constraints

---

# Table Naming Rules

Good:

```text id="db10"
assessment_purchases
billing_events
compliance_tasks
```

Bad:

```text id="db11"
AssessmentPurchases
BillingEvents
```

---

# Primary Key Rules

Every table should contain:

```text id="db12"
id
```

as primary key.

Use consistent ID strategy throughout the platform.

---

# Foreign Key Rules

Relationships should be enforced.

Examples:

```text id="db13"
business_id

user_id

requirement_id
```

Foreign keys should not be optional unless justified.

---

# Auditability Rules

Important data should remain traceable.

Examples:

* Assessments
* Purchases
* Payments
* Compliance tasks
* Regulatory updates

Historical integrity matters.

---

# Regulatory Data Rules

Regulatory tables should preserve:

* Version history
* Verification history
* Source attribution

Never overwrite regulatory history.

---

# Billing Data Rules

Billing tables should preserve:

* Payment history
* Subscription history
* Refund history
* Billing events

Never delete billing records.

---

# Assessment Data Rules

Assessment tables should preserve:

* Assessment summaries
* Full reports
* Purchase history

Assessment history should remain accessible.

---

# Compliance Data Rules

Compliance tables should preserve:

* Task history
* Status history
* Score history
* Evidence history

Compliance data should remain auditable.

---

# AI Knowledge Rules

Knowledge tables should preserve:

* Embeddings
* Chunks
* Sources
* Retrieval metadata

Knowledge lineage should remain intact.

---

# Soft Delete Rules

Prefer:

```text id="db14"
archived_at
deleted_at
```

over permanent deletion.

Especially for:

* Regulatory data
* Compliance records
* Billing records

---

# Indexing Rules

Add indexes for:

* Frequently queried fields
* Foreign keys
* Search operations
* Filtering operations

Avoid premature indexing.

---

# Data Migration Rules

When transforming data:

1. Validate existing records
2. Migrate safely
3. Verify results
4. Preserve history

Never assume existing data is clean.

---

# Rollback Rules

Every migration must define:

* Rollback procedure
* Recovery plan
* Impact assessment

If rollback is impossible:

Document why.

---

# Testing Rules

Before production:

Verify:

* Migration executes
* Rollback executes
* Data remains intact
* Constraints work correctly

---

# Multi-Country Rules

All schema changes must support:

* Multiple countries
* Multiple states
* Multiple industries
* Multiple agencies

Do not hardcode Nigeria-specific assumptions.

---

# Security Rules

Follow:

```text id="db15"
security.md
```

at all times.

Never store:

* Card numbers
* CVV values
* Payment credentials

---

# Regulatory Knowledge Rules

Follow:

```text id="db16"
regulatory-knowledge-rules.md
```

for:

* Requirements
* Costs
* Agencies
* Sources

---

# Migration Documentation Rules

Every migration should document:

* Purpose
* Tables affected
* Columns affected
* Rollback strategy
* Risks

Future developers should understand why it exists.

---

# Performance Rules

Migrations should:

* Minimize downtime
* Avoid table locks where possible
* Avoid unnecessary full-table rewrites

Large migrations should be staged.

---

# Generated Migration Requirements

Every migration should include:

✓ Migration description

✓ Rollback strategy

✓ Data validation

✓ Constraint validation

✓ Documentation

✓ Impact assessment

---

# Required Dependencies

This skill should follow:

* AGENTS.md
* data-architecture.md
* architecture.md
* security.md
* regulatory-knowledge-rules.md
* billing-rules.md

---

# Completion Checklist

✓ Schema reviewed

✓ Impact assessed

✓ Rollback planned

✓ Constraints validated

✓ Data preserved

✓ Documentation created

✓ Multi-country support maintained

✓ Security requirements met

✓ No destructive operations without approval

---

# Non-Negotiables

Never:

* Drop tables without approval
* Delete regulatory history
* Delete billing history
* Remove audit logs
* Create irreversible migrations without documentation
* Store sensitive payment information

Database integrity is more important than development velocity.
