# skill: compliance-dashboard-builder

## Purpose

This skill is responsible for building, maintaining, and improving the Compliance Dashboard experience within LaunchSafe.

The Compliance Dashboard is the primary workspace for businesses subscribed to Compliance Autopilot.

It serves as the operational command center for compliance management.

---

# Core Philosophy

The dashboard exists to answer three questions:

```text id="jlwm10"
What requires attention?

What is at risk?

What should I do next?
```

Every dashboard feature should support one or more of these questions.

---

# Primary Responsibilities

The Compliance Dashboard is responsible for:

* Compliance visibility
* Compliance tracking
* Deadline management
* Task management
* Compliance score visibility
* Regulatory update visibility
* Evidence tracking
* Document tracking
* Action prioritization

The dashboard is not responsible for:

* Assessment generation
* Regulatory data management
* Payment verification
* Subscription management

---

# Dashboard Principles

The dashboard should prioritize:

1. Actionability
2. Clarity
3. Compliance Risk
4. Task Completion
5. Progress Tracking

Avoid vanity metrics.

---

# Dashboard Hierarchy

The dashboard should prioritize information in the following order:

```text id="jlwm11"
Compliance Health Score

↓

Urgent Deadlines

↓

Overdue Obligations

↓

Upcoming Tasks

↓

Regulatory Updates

↓

Recent Activity
```

Critical information must appear above the fold.

---

# Core Dashboard Sections

## Compliance Health Score

Purpose:

Provide a high-level compliance overview.

Should display:

* Current score
* Score trend
* Score breakdown
* Key contributing factors

---

## Upcoming Deadlines

Purpose:

Help users avoid missed obligations.

Should display:

* Requirement
* Agency
* Due date
* Days remaining
* Priority

---

## Overdue Obligations

Purpose:

Highlight compliance risks.

Should display:

* Requirement
* Overdue duration
* Risk level
* Recommended action

---

## Compliance Tasks

Purpose:

Help users manage obligations.

Should display:

* Task title
* Status
* Priority
* Due date
* Related requirement

---

## Regulatory Updates

Purpose:

Surface important changes.

Should display:

* Update title
* Effective date
* Impact level
* Affected area

---

## Recent Activity

Purpose:

Provide operational awareness.

Examples:

* Document generated
* Evidence uploaded
* Requirement completed
* Compliance score updated

---

# Compliance Score Rules

Compliance scores should be:

* Explainable
* Transparent
* Reproducible

Users must understand:

* Why the score exists
* Why it changed
* How to improve it

---

# Compliance Score Factors

Positive Factors:

* Completed obligations
* Valid evidence
* Timely submissions
* Active compliance tasks

Negative Factors:

* Missed deadlines
* Missing evidence
* Overdue obligations
* Expired approvals

---

# Task Management Rules

Every task should contain:

* Title
* Description
* Status
* Priority
* Due date
* Related requirement
* Related agency

---

# Task Statuses

Supported statuses:

```text id="jlwm12"
Not Started

In Progress

Awaiting Submission

Submitted

Approved

Completed

Overdue
```

---

# Priority Levels

Supported values:

```text id="jlwm13"
Low

Medium

High

Critical
```

---

# Deadline Management Rules

Deadlines should support:

* Sorting
* Filtering
* Prioritization

Users should always understand urgency.

---

# Regulatory Update Rules

Only verified updates should appear.

Updates should include:

* Summary
* Effective date
* Impact level
* Recommended action

---

# Evidence Management Rules

Dashboard users should be able to:

* Upload evidence
* Review evidence
* Download evidence
* Track evidence status

Examples:

* Receipts
* Permits
* Certificates
* Inspection reports

---

# Document Management Rules

Users should be able to:

* View generated documents
* Download documents
* Track document history

Documents should remain searchable.

---

# Notification Integration Rules

Dashboard notifications should support:

* Upcoming deadlines
* Missed deadlines
* Regulatory updates
* Subscription events

Notifications should be actionable.

---

# Dashboard Filtering Rules

Users should be able to filter by:

* Business
* Agency
* Status
* Priority
* Due date
* Compliance category

---

# Multi-Business Rules

Business and Enterprise plans may manage multiple businesses.

The dashboard should support:

* Business switching
* Business-specific views
* Aggregated compliance insights

---

# Mobile Dashboard Rules

The dashboard must remain usable on:

```text id="jlwm14"
375px width
```

Priority information should remain visible without excessive scrolling.

---

# Empty State Rules

Every dashboard section should explain:

* Why no data exists
* What action is available

Example:

```text id="jlwm15"
No compliance tasks found.

Create your first business profile to begin tracking compliance obligations.
```

---

# Loading State Rules

Every dashboard section should support:

* Loading
* Error
* Empty
* Success

states.

---

# Security Rules

Users must only access:

* Their own businesses
* Their own tasks
* Their own evidence
* Their own documents

Ownership verification is mandatory.

---

# Performance Targets

Dashboard Load:

```text id="jlwm16"
< 3 seconds
```

Compliance Score Update:

```text id="jlwm17"
< 2 seconds
```

Task Updates:

```text id="jlwm18"
Near real-time
```

---

# Anti-Hallucination Rules

The dashboard must never display:

* Invented requirements
* Invented deadlines
* Invented compliance tasks
* Invented compliance scores

All dashboard content must originate from:

* Regulatory data
* Compliance tasks
* Assessment results
* Verified business records

---

# Required Dependencies

This skill should follow:

* AGENTS.md
* product-rules.md
* compliance-rules.md
* design-system.md
* security.md
* architecture.md

---

# Completion Checklist

✓ Compliance score displayed

✓ Deadlines displayed

✓ Tasks displayed

✓ Regulatory updates displayed

✓ Evidence integrated

✓ Notifications integrated

✓ Mobile support verified

✓ Ownership checks implemented

✓ No hallucinated data

✓ Dashboard remains actionable

---

# Non-Negotiables

Never:

* Display unsupported compliance information
* Hide critical compliance risks
* Prioritize vanity metrics over actions
* Expose another business's data
* Generate dashboard data from AI assumptions

The Compliance Dashboard is an operational tool, not a reporting screen.
