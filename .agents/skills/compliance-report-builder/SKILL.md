# skill: compliance-report-builder

## Purpose

This skill is responsible for generating Full Compliance Reports for LaunchSafe.

The Compliance Report Builder transforms assessment results into structured, actionable compliance reports.

This system is revenue-critical because users purchase access to these reports.

Accuracy is more important than speed.

---

# Primary Responsibilities

The Compliance Report Builder is responsible for:

* Report generation
* Requirement organization
* Agency organization
* Cost presentation
* Timeline generation
* Risk analysis
* Launch roadmap generation
* Source attribution
* Report formatting

The Compliance Report Builder is not responsible for:

* Assessment creation
* Payment processing
* Subscription management
* Regulatory data maintenance

---

# Core Principle

A report is a presentation layer.

The report does not create compliance intelligence.

The report presents compliance intelligence.

All report content must originate from:

* Assessment results
* Regulatory requirements
* Cost data
* Agency data
* Compliance rules

Never invent report content.

---

# Report Access Rules

Full Compliance Reports require:

* Assessment purchase
* Verified payment
* Server-side verification

Reports must never be unlocked from:

* Client-side state
* Query parameters
* Browser storage

---

# Report Structure

Every report should contain:

## Executive Summary

Overview of:

* Business type
* Industry
* Location
* Compliance complexity

---

## Compliance Overview

Summary of:

* Requirement count
* Agency count
* Compliance categories

---

## Requirement Breakdown

Detailed requirements.

Grouped logically.

---

## Agency Breakdown

All relevant agencies.

For each agency include:

* Name
* Responsibility
* Related requirements

---

## Cost Breakdown

Must separate:

### Official Costs

Published regulatory fees.

---

### Estimated Costs

Reasonable estimates.

---

### Community Reported Costs

User-reported costs.

---

Never merge these categories.

---

## Compliance Timeline

Display:

* Immediate actions
* Short-term actions
* Long-term actions

---

## Launch Roadmap

Provide:

* Recommended order
* Dependencies
* Critical path items

---

## Risk Analysis

Identify:

* Missing requirements
* High-risk obligations
* High-cost obligations
* Potential launch blockers

---

## Sources

Every report must include source attribution.

---

# Requirement Presentation Rules

Requirements should display:

* Requirement name
* Description
* Agency
* Jurisdiction
* Requirement type
* Frequency
* Confidence level

Requirements must never appear without supporting data.

---

# Agency Presentation Rules

Agencies must originate from verified regulatory data.

Never invent agencies.

---

# Cost Presentation Rules

Users must understand:

* Official fees
* Estimated costs
* Community-reported charges

These categories must remain visually distinct.

---

# Community Charge Rules

Community-reported charges must:

* Be clearly labeled
* Be separated from official costs
* Never be represented as legal obligations

---

# Timeline Rules

Timelines must be generated from:

* Requirement data
* Dependencies
* Regulatory deadlines

Never generate timelines from AI assumptions.

---

# Launch Roadmap Rules

Roadmaps should explain:

* What to do first
* What depends on what
* What may block launch

Roadmaps must be deterministic.

---

# Risk Analysis Rules

Risk analysis should identify:

* Critical obligations
* Missing requirements
* Cost risks
* Operational risks

Every risk should have supporting evidence.

---

# Source Attribution Rules

Every report should expose:

* Source agency
* Confidence level
* Verification status
* Last updated date

Transparency is mandatory.

---

# Anti-Hallucination Rules

The Report Builder must never:

* Invent requirements
* Invent permits
* Invent licenses
* Invent agencies
* Invent costs
* Invent deadlines
* Invent penalties

If supporting data does not exist:

Do not display the information.

---

# Missing Data Rules

Allowed:

```text id="6t43ij"
Information currently unavailable.

Additional verification required.
```

Not allowed:

```text id="t6kzmt"
Estimated requirement

Likely permit

Assumed fee
```

without supporting data.

---

# Formatting Rules

Reports should be:

* Structured
* Easy to scan
* Professional
* Actionable

Avoid large unstructured text blocks.

---

# Export Rules

Supported exports:

* PDF

Future:

* DOCX

PDF should be treated as the primary output format.

---

# Security Rules

Reports contain paid content.

The system must verify access before:

* Viewing reports
* Downloading reports
* Exporting reports

---

# Performance Targets

Report generation:

```text id="pjfjh6"
< 10 seconds
```

PDF export:

```text id="6nq8y9"
< 5 seconds
```

---

# Required Dependencies

This skill should follow:

* AGENTS.md
* product-rules.md
* compliance-rules.md
* regulatory-knowledge-rules.md
* billing-rules.md
* security.md

---

# Completion Checklist

✓ Report structure generated

✓ Requirements organized

✓ Agencies organized

✓ Costs separated correctly

✓ Timeline generated

✓ Roadmap generated

✓ Risk analysis generated

✓ Sources attached

✓ PDF export supported

✓ No hallucinated information

---

# Non-Negotiables

Never:

* Generate unsupported compliance information
* Hide source attribution
* Merge official and community-reported costs
* Expose reports without payment verification
* Use AI memory as a compliance source

Compliance reports are purchased products.

Accuracy is more important than completeness.
