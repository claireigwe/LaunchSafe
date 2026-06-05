---
trigger: always_on
---

# compliance-rules.md

## Purpose

This file defines how regulatory information is collected, stored, verified, classified, displayed, updated, and used throughout LaunchSafe.

All compliance intelligence must follow these rules.

If compliance-rules.md conflicts with any other rule file, compliance-rules.md takes precedence for regulatory information.

---

# Regulatory Information Principles

LaunchSafe exists to provide trustworthy compliance intelligence.

Compliance information must always be:

* Accurate
* Traceable
* Explainable
* Actionable
* Updatable

Every compliance requirement must have a clear source.

---

# Compliance Information Hierarchy

All compliance information must belong to one of the following categories.

## Verified

Officially sourced and validated.

Examples:

* Government regulations
* Agency publications
* Official fee schedules
* Regulatory guidelines
* Published directives

Verified information represents the highest confidence level.

---

## Estimated

Reasonable estimates derived from available information.

Examples:

* Cost ranges
* Processing timelines
* Expected approval durations

Estimated information must always be labeled as estimated.

---

## Community Reported

Reported by businesses or users.

Examples:

* Informal charges
* Community experiences
* Local implementation realities
* User-reported timelines

Community-reported information must never be presented as official regulatory requirements.

---

# Regulatory Source Requirements

Every requirement must contain:

* Source agency
* Source document
* Verification date
* Last updated date
* Confidence level

Requirements without traceable sources must not be displayed as verified.

---

# Requirement Classification Rules

Every requirement must be classified by:

## Jurisdiction

Examples:

* Federal
* State
* LGA
* Industry-specific

---

## Requirement Type

Examples:

* Registration
* License
* Permit
* Inspection
* Tax
* Filing
* Certification
* Reporting

---

## Frequency

Examples:

* One-time
* Monthly
* Quarterly
* Annual
* Event-driven

---

# Requirement Display Rules

Every requirement screen must display:

* Requirement name
* Requirement description
* Responsible agency
* Requirement type
* Cost information
* Deadline information
* Confidence level
* Source information

Users must always understand:

* What is required
* Why it is required
* Who requires it
* When it is due
* What happens if ignored

---

# Cost Rules

LaunchSafe may display:

* Official costs
* Estimated costs
* Community-reported costs

These must always remain separate.

Example:

Official Cost
₦50,000

Estimated Additional Costs
₦10,000 - ₦25,000

Community Reported Charges
₦5,000 - ₦15,000

The platform must never merge these categories.

---

# Informal Charge Rules

LaunchSafe recognizes that informal or unofficial charges may exist in some jurisdictions.

These may be recorded as:

Community Reported Charges

Requirements:

* Clearly labeled
* Never treated as official fees
* Never represented as legal obligations
* Supported by multiple reports where possible

---

# Regulatory Update Rules

Every regulatory update must contain:

* Title
* Summary
* Effective date
* Source
* Impact analysis

Users should understand:

* What changed
* Who is affected
* What action is required

---

# Compliance Recommendation Rules

Recommendations must be derived from:

* Business profile
* Industry
* Location
* Compliance status
* Regulatory requirements

Recommendations must never be generated from assumptions alone.

---

# Compliance Timeline Rules

Timeline calculations must be based on:

* Requirement frequency
* Requirement deadlines
* Business launch date
* Existing compliance history

Timeline events must remain auditable.

---

# Compliance Score Rules

Compliance scores must be explainable.

Users must understand why a score changed.

Scoring factors may include:

Positive Factors

* Completed obligations
* Valid documentation
* Timely submissions

Negative Factors

* Missed deadlines
* Missing evidence
* Overdue obligations
* Expired approvals

---

# Regulatory Change Monitoring Rules

The platform should monitor:

* Laws
* Regulations
* Circulars
* Guidelines
* Directives
* Agency publications

Changes must be reviewed before becoming visible to users.

---

# Requirement Lifecycle

Requirements move through the following lifecycle:

Draft

↓

Under Review

↓

Verified

↓

Active

↓

Updated

↓

Archived

Only Active requirements should be shown to users.

---

# Compliance Report Rules

Every Full Compliance Report should contain:

* Requirement breakdown
* Agency breakdown
* Cost breakdown
* Deadline schedule
* Compliance timeline
* Risk analysis
* Recommended actions

Reports must include confidence labels.

---

# Assessment Summary Rules

Assessment Summary is available before payment.

Assessment Summary may include:

* Business type
* Location
* Requirement count
* Agency count
* Compliance complexity score
* Compliance categories

Assessment Summary must not include:

* Exact requirements
* Cost breakdowns
* Permit details
* Licensing details
* Compliance timelines
* Risk analysis
* Launch roadmap

---

# Full Report Access Rules

Full Compliance Reports may only be unlocked when:

* Payment exists
* Payment is verified
* Verification occurs server-side

Client-side verification must never unlock reports.

---

# AI Compliance Rules

AI may:

* Explain requirements
* Summarize regulations
* Generate recommendations
* Generate compliance documents

AI must not:

* Create regulatory requirements
* Create legal obligations
* Create costs
* Create deadlines
* Create penalties

AI responses must be grounded in retrieved regulatory data.

---

# Source Transparency Rules

Users must always be able to identify:

* Where information came from
* When it was verified
* How trustworthy it is

LaunchSafe should prioritize transparency over simplicity whenever the two conflict.

---

# Future Expansion Rules

All compliance data structures must support:

* Multiple countries
* Multiple states
* Multiple industries
* Multiple regulatory agencies

No compliance logic should be hardcoded specifically for Nigeria.

Nigeria is the first market, not the only market.

---

# Non-Negotiables

Never:

* Invent requirements
* Invent costs
* Invent penalties
* Invent deadlines
* Present unofficial information as official
* Remove source attribution
* Hide confidence levels
* Unlock full reports before verified payment

Compliance accuracy is more important than feature completeness.
