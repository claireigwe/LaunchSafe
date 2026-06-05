# skill: assessment-engine-builder

## Purpose

This skill is responsible for building, extending, maintaining, and improving the LaunchSafe Assessment Engine.

The Assessment Engine powers the Pre-Launch Compliance Explorer and is responsible for transforming business information into compliance intelligence.

This is a core business system.

Changes to this system must be approached carefully.

---

# Primary Responsibilities

The Assessment Engine is responsible for:

* Collecting business information
* Identifying applicable requirements
* Determining relevant agencies
* Calculating compliance complexity
* Generating assessment summaries
* Generating full compliance reports
* Producing launch roadmaps
* Estimating compliance costs
* Estimating compliance timelines

The Assessment Engine is not responsible for:

* Subscription management
* Payment processing
* User authentication
* Regulatory data management
* Notification delivery

---

# Assessment Philosophy

The Assessment Engine is a rule-driven system.

The Assessment Engine is not an AI guessing engine.

Compliance intelligence must come from:

* Regulatory requirements
* Industry mappings
* Geographic mappings
* Verified compliance data

Never generate assessments from assumptions.

---

# Required Inputs

The Assessment Engine should be capable of evaluating:

## Business Type

Examples:

* Sole Proprietorship
* Limited Liability Company
* Partnership
* Cooperative

---

## Industry

Examples:

* Restaurant
* Pharmacy
* Fintech
* Logistics
* Manufacturing
* Food Processing

---

## Location

Required:

* Country

Optional:

* State
* LGA
* City

---

## Operational Characteristics

Examples:

* Physical location
* Online operation
* Number of employees
* Import/export activity
* Food handling
* Financial services
* Healthcare activity

---

# Assessment Workflow

Required flow:

```text
Business Inputs

↓

Validation

↓

Industry Matching

↓

Location Matching

↓

Requirement Matching

↓

Agency Matching

↓

Complexity Analysis

↓

Cost Analysis

↓

Summary Generation

↓

Assessment Summary

↓

Payment Verification

↓

Full Compliance Report
```

---

# Assessment Summary Rules

Assessment summaries are publicly visible.

Assessment summaries may contain:

* Business type
* Industry
* Location
* Requirement count
* Agency count
* Compliance complexity score
* Compliance categories

Assessment summaries must not contain:

* Requirement details
* Cost breakdowns
* Permit details
* License details
* Risk analysis
* Compliance roadmap

---

# Full Compliance Report Rules

Full reports may contain:

* Requirement details
* Agency obligations
* Cost analysis
* Permit requirements
* Licensing requirements
* Compliance timelines
* Risk analysis
* Launch roadmap

Only after successful payment verification.

---

# Requirement Matching Rules

Requirements must be matched using:

* Industry
* Jurisdiction
* Business profile
* Operational activities

Never match requirements using AI assumptions.

---

# Agency Matching Rules

Every requirement must map to at least one agency.

Examples:

* CAC
* FIRS
* NAFDAC
* SON
* NDPC
* State Agencies
* LGA Authorities

Agencies must come from regulatory data.

Never invent agencies.

---

# Cost Estimation Rules

Cost calculations should separate:

## Official Costs

Published fees.

---

## Estimated Costs

Calculated estimates.

---

## Community Reported Costs

User-reported costs.

---

These categories must never be merged.

---

# Informal Charge Rules

The system may surface:

```text
Community Reported Charges
```

These must:

* Be clearly labeled
* Never be represented as official fees
* Never be treated as legal obligations

---

# Compliance Complexity Rules

The Assessment Engine should generate a complexity score.

Factors may include:

* Number of requirements
* Number of agencies
* Regulatory intensity
* Renewal frequency
* Industry risk level

Complexity scoring must be deterministic.

---

# Compliance Category Rules

Requirements should be grouped into categories.

Examples:

* Business Registration
* Tax Compliance
* Industry Licensing
* Environmental Compliance
* Employment Compliance
* Data Protection
* Health & Safety
* Local Government Requirements

---

# Launch Roadmap Rules

The Launch Roadmap should provide:

* Recommended sequence
* Dependencies
* Estimated timelines
* Preparation requirements

Roadmaps should be generated from requirements.

Not from AI guesses.

---

# Risk Analysis Rules

Risk analysis should identify:

* Missing requirements
* High-risk obligations
* High-cost obligations
* Critical launch blockers

Risks must be explainable.

---

# Assessment Engine Data Sources

Approved sources:

* Regulatory requirements
* Agency mappings
* Cost databases
* Geographic mappings
* Industry mappings

---

# Prohibited Data Sources

Do not generate assessments from:

* User assumptions
* AI memory
* Social media
* Blog content
* Forum content

unless explicitly stored as Community Reported Information.

---

# Anti-Hallucination Rules

The Assessment Engine must never:

* Invent requirements
* Invent permits
* Invent licenses
* Invent agencies
* Invent fees
* Invent deadlines
* Invent penalties

When information is unavailable:

Return uncertainty.

Do not guess.

---

# Missing Data Handling

When information is incomplete:

Allowed:

```text
Additional regulatory verification required.

Information currently unavailable.
```

Not allowed:

```text
Likely requirement

Probably required

Estimated regulation
```

without supporting data.

---

# Performance Requirements

Assessment Summary Generation

Target:

```text
< 5 seconds
```

---

Full Report Generation

Target:

```text
< 10 seconds
```

---

# Security Requirements

Assessment summaries are public.

Full reports require:

* Verified purchase
* Server-side verification

The assessment engine must never determine payment status itself.

Billing systems determine access.

---

# Required Dependencies

This skill should follow:

* AGENTS.md
* product-rules.md
* compliance-rules.md
* regulatory-knowledge-rules.md
* architecture.md
* security.md
* billing-rules.md

---

# Completion Checklist

Before considering work complete:

✓ Inputs validated

✓ Requirements matched

✓ Agencies matched

✓ Costs separated correctly

✓ Complexity score generated

✓ Assessment summary generated

✓ Full report gated properly

✓ No hallucinated compliance information

✓ Regulatory sources preserved

✓ Security rules followed

---

# Non-Negotiables

Never:

* Invent compliance information
* Expose full reports before payment verification
* Merge official and community-reported costs
* Use AI memory as a regulatory source
* Generate requirements without supporting data

Assessment accuracy is more important than assessment completeness.
