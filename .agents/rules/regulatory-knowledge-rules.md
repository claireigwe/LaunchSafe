---
trigger: always_on
---

# regulatory-knowledge-rules.md

## Purpose

This document defines how regulatory knowledge is collected, verified, structured, maintained, versioned, updated, retrieved, and surfaced throughout LaunchSafe.

This is the primary anti-hallucination rule file.

All compliance intelligence systems, AI systems, assessment engines, report generators, recommendation engines, and regulatory workflows must comply with this document.

If implementation conflicts with this document, this document takes precedence for all regulatory knowledge decisions.

---

# Core Principle

LaunchSafe is a compliance intelligence platform.

The value of LaunchSafe depends entirely on the accuracy and trustworthiness of its regulatory knowledge.

If regulatory knowledge cannot be trusted, the product fails.

---

# Regulatory Knowledge Hierarchy

All knowledge must belong to one of three categories.

## Verified

Officially sourced and validated.

Examples:

* Laws
* Regulations
* Agency guidelines
* Official fee schedules
* Official directives
* Government publications

Highest confidence level.

---

## Estimated

Derived from available evidence.

Examples:

* Cost estimates
* Processing timelines
* Approval durations

Must always be clearly labeled.

---

## Community Reported

Information reported by businesses.

Examples:

* Informal charges
* Operational realities
* Typical timelines
* Local implementation experiences

Must never be presented as official requirements.

---

# Approved Regulatory Sources

LaunchSafe may only create Verified regulatory knowledge from approved sources.

Examples:

* Federal laws
* State laws
* Agency regulations
* Official government publications
* Agency websites
* Regulatory circulars
* Regulatory directives
* Official fee schedules

---

# Unapproved Regulatory Sources

The following must never create Verified requirements:

* Blogs
* Social media posts
* User comments
* News articles
* Community forums
* AI-generated content

These may be used for investigation only.

Never for verification.

---

# Source Traceability Rules

Every requirement must have:

* Source agency
* Source document
* Source URL (if available)
* Verification date
* Last updated date
* Confidence level

Requirements without traceable sources must not be marked Verified.

---

# Requirement Creation Rules

Requirements must never be manually invented.

Requirements must originate from:

* Verified regulatory sources
* Structured regulatory reviews

Every requirement must contain:

* Title
* Description
* Agency
* Jurisdiction
* Industry
* Requirement type
* Source
* Confidence level

---

# Requirement Versioning Rules

Requirements may change over time.

LaunchSafe must preserve:

* Previous versions
* Previous costs
* Previous deadlines
* Previous requirements

Never overwrite historical versions without retaining history.

---

# Requirement Lifecycle

Requirements move through:

```text
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

Only Active requirements should appear in assessments and reports.

---

# Cost Intelligence Rules

Costs must be separated into distinct categories.

## Official Costs

Published by regulators.

Highest confidence.

---

## Estimated Costs

Derived from available evidence.

Must be labeled:

```text
Estimated
```

---

## Community Reported Costs

Derived from user experiences.

Must be labeled:

```text
Community Reported
```

---

# Cost Separation Rules

The system must never combine:

* Official costs
* Estimated costs
* Community-reported costs

into a single value.

Users must understand where each number comes from.

---

# Community Charge Rules

LaunchSafe recognizes that unofficial charges may exist.

Community-reported charges may be stored.

Requirements:

* Clearly labeled
* Separated from official costs
* Never treated as legal obligations
* Never represented as government fees

---

# Regulatory Update Rules

Every regulatory update must contain:

* Title
* Summary
* Source
* Effective date
* Impact analysis

---

# Regulatory Change Workflow

```text
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

User Notification
```

No update should bypass verification.

---

# Knowledge Freshness Rules

Regulatory information must remain current.

Every requirement should have:

* Verification date
* Last reviewed date

Stale information should trigger review workflows.

---

# Requirement Confidence Rules

Every requirement must have a confidence level.

Supported values:

## Verified

Officially validated.

---

## Estimated

Reasonable estimate.

---

## Community Reported

User-reported information.

---

# Assessment Engine Rules

Assessments must be generated from:

* Requirements
* Industries
* Locations
* Business profiles

Assessments must never be generated from AI assumptions.

---

# Assessment Summary Rules

Assessment summaries may contain:

* Requirement count
* Agency count
* Compliance complexity score
* Compliance categories

Assessment summaries must not expose:

* Requirement details
* Cost breakdowns
* Launch roadmaps
* Risk analysis

before payment verification.

---

# Full Report Rules

Full reports may contain:

* Requirement details
* Agency obligations
* Cost breakdowns
* Timelines
* Risks
* Roadmaps

Only after successful payment verification.

---

# Recommendation Engine Rules

Recommendations must be derived from:

* Requirements
* Compliance status
* Industry
* Location

Recommendations must never be generated without supporting regulatory data.

---

# AI Knowledge Retrieval Rules

All AI-generated compliance content must originate from retrieved knowledge.

Required flow:

```text
User Request

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

AI must never:

* Invent requirements
* Invent permits
* Invent licenses
* Invent fees
* Invent costs
* Invent deadlines
* Invent penalties
* Invent regulatory agencies

If information cannot be verified:

The AI should acknowledge uncertainty.

---

# Missing Data Rules

When information is unavailable:

Allowed:

```text
Information currently unavailable.

Verification required.

Additional regulatory research recommended.
```

Not Allowed:

```text
Best guess
Likely requirement
Assumed fee
Estimated regulation
```

without supporting evidence.

---

# Source Display Rules

Every compliance insight should expose:

* Source
* Confidence level
* Verification status
* Last updated date

Transparency is mandatory.

---

# Conflict Resolution Rules

When two sources conflict:

1. Prefer official sources.
2. Prefer newer sources.
3. Flag conflicts for review.
4. Avoid presenting uncertain information as fact.

---

# Search Rules

Regulatory search must prioritize:

1. Verified content
2. Updated content
3. Relevant jurisdiction
4. Relevant industry

Community-reported information should never outrank verified requirements.

---

# AI Explanation Rules

AI may:

* Simplify language
* Summarize requirements
* Explain obligations

AI may not:

* Change the meaning of regulations
* Modify legal requirements
* Alter official costs

---

# Regulatory Expansion Rules

All knowledge structures must support:

* Multiple countries
* Multiple states
* Multiple agencies
* Multiple industries

No regulatory logic should be hardcoded for Nigeria only.

---

# Knowledge Base Quality Rules

Before publishing knowledge:

Verify:

* Source exists
* Source is valid
* Source is current
* Jurisdiction is correct
* Industry mapping is correct

---

# Non-Negotiables

Never:

* Invent regulatory information
* Remove source attribution
* Treat community reports as verified requirements
* Present assumptions as facts
* Expose full reports before payment verification
* Allow AI memory to override retrieved knowledge
* Publish unverified regulatory requirements

When uncertainty exists, transparency is more important than completeness.
