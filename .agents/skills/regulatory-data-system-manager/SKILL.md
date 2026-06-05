# skill: regulatory-data-manager

## Purpose

This skill is responsible for managing LaunchSafe's regulatory knowledge base.

It governs:

* Regulatory requirements
* Agencies
* Regulatory costs
* Deadlines
* Jurisdictions
* Industry mappings
* Regulatory updates
* Source verification

This skill is the primary guardian of compliance accuracy.

---

# Core Responsibility

The Regulatory Data Manager is responsible for:

* Creating regulatory records
* Updating regulatory records
* Archiving regulatory records
* Verifying regulatory sources
* Managing requirement versions
* Managing regulatory updates
* Maintaining industry mappings
* Maintaining jurisdiction mappings

The Regulatory Data Manager is not responsible for:

* Assessment generation
* Report generation
* Subscription management
* Payment processing

---

# Regulatory Data Philosophy

Regulatory knowledge is a product asset.

Every requirement must be:

* Verifiable
* Traceable
* Auditable
* Versioned

No compliance intelligence should exist without supporting evidence.

---

# Supported Regulatory Entities

The system manages:

## Countries

Examples:

* Nigeria
* Ghana
* Kenya
* South Africa

---

## States / Regions

Examples:

* Lagos
* Oyo
* Abuja
* Rivers

---

## LGAs

Examples:

* Ibadan North
* Ikeja
* Surulere

---

## Industries

Examples:

* Restaurant
* Pharmacy
* Fintech
* Manufacturing
* Logistics
* E-commerce

---

## Agencies

Examples:

* CAC
* FIRS
* NAFDAC
* SON
* NDPC

---

## Requirements

Examples:

* CAC Registration
* Food Handling Permit
* Data Protection Registration
* Environmental Permit

---

## Costs

Examples:

* Registration fees
* Renewal fees
* Inspection fees

---

## Regulatory Updates

Examples:

* New directives
* Updated fee schedules
* Regulatory amendments

---

# Requirement Creation Rules

Requirements must only be created when:

* A source exists
* Verification is completed
* Jurisdiction is identified
* Industry mapping is identified

Required fields:

* Name
* Description
* Agency
* Jurisdiction
* Industry
* Requirement type
* Source
* Confidence level

---

# Source Verification Rules

Every requirement must have:

* Source agency
* Source document
* Verification date
* Last updated date

Requirements without sources must never be marked Verified.

---

# Requirement Versioning Rules

Requirements change.

Version history must be preserved.

Examples:

* Cost changes
* Deadline changes
* Requirement changes

Old versions should never be deleted.

---

# Requirement Lifecycle

Supported states:

```text id="xsm8yt"
Draft

↓

Review

↓

Verified

↓

Active

↓

Updated

↓

Archived
```

Only Active requirements should be surfaced to users.

---

# Industry Mapping Rules

Every requirement must be mapped to one or more industries.

Examples:

```text id="jlwmgo"
Restaurant

↓

Food Handling Permit

↓

NAFDAC Requirement
```

Mappings must be explicit.

Never infer mappings from AI assumptions.

---

# Geographic Mapping Rules

Requirements may apply at:

* Country level
* State level
* LGA level

The system must support all three.

---

# Cost Management Rules

Costs must be stored separately.

## Official Costs

Published fees.

---

## Estimated Costs

Reasonable estimates.

---

## Community Reported Costs

User-reported costs.

---

# Cost Integrity Rules

Never merge:

* Official costs
* Estimated costs
* Community-reported costs

into a single value.

---

# Community Charge Rules

Community-reported charges may be stored.

Requirements:

* Clearly labeled
* Separate from official costs
* Not treated as legal obligations

---

# Regulatory Update Workflow

```text id="bl24zv"
Source Identified

↓

Review

↓

Verification

↓

Impact Analysis

↓

Publication

↓

Notification
```

Updates must not bypass review.

---

# Impact Analysis Rules

Every update should identify:

* Affected industries
* Affected requirements
* Affected agencies
* Affected businesses

Impact should be classified:

* Low
* Medium
* High

---

# Regulatory Freshness Rules

Every requirement should contain:

* Verification date
* Last reviewed date

Stale records should trigger review workflows.

---

# Confidence Rules

Supported confidence levels:

## Verified

Officially validated.

---

## Estimated

Derived estimate.

---

## Community Reported

User-submitted information.

---

# Search Rules

Search should prioritize:

1. Verified records
2. Updated records
3. Jurisdiction relevance
4. Industry relevance

Community-reported information must never outrank verified requirements.

---

# Anti-Hallucination Rules

The Regulatory Data Manager must never:

* Invent agencies
* Invent requirements
* Invent costs
* Invent deadlines
* Invent permits
* Invent licenses

All records must originate from supported sources.

---

# Conflict Resolution Rules

When sources conflict:

1. Prefer official sources
2. Prefer newer sources
3. Flag for review
4. Preserve audit history

Never silently overwrite data.

---

# Audit Requirements

Every change must be logged.

Examples:

* Requirement created
* Requirement updated
* Cost updated
* Source updated
* Agency updated

Audit logs must be immutable.

---

# Security Requirements

Only authorized administrators may:

* Create requirements
* Update requirements
* Archive requirements
* Modify costs

Regular users must never modify regulatory intelligence.

---

# Required Dependencies

This skill should follow:

* AGENTS.md
* compliance-rules.md
* regulatory-knowledge-rules.md
* data-architecture.md
* security.md

---

# Completion Checklist

✓ Sources verified

✓ Requirement created correctly

✓ Industry mapping completed

✓ Jurisdiction mapping completed

✓ Costs categorized correctly

✓ Version history preserved

✓ Audit logs created

✓ Confidence level assigned

✓ No hallucinated information

---

# Non-Negotiables

Never:

* Create unsupported requirements
* Remove source attribution
* Delete version history
* Merge official and community-reported costs
* Treat estimates as verified facts
* Allow AI memory to become a regulatory source

Regulatory integrity is more important than feature velocity.
