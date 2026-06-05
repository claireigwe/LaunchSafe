---
trigger: always_on
---

# new-component.md

## Purpose

This document defines the process and requirements for creating new UI components in LaunchSafe.

Before creating any component, the AI must follow these rules.

The goal is to maximize:

* Consistency
* Reusability
* Accessibility
* Maintainability

while minimizing:

* Duplication
* Design drift
* Component sprawl

---

# Mandatory Pre-Component Checklist

Before creating a component:

## Step 1

Check whether a similar component already exists.

Questions:

* Does an existing component solve this problem?
* Can an existing component be extended?
* Can composition solve the requirement?

If yes:

Reuse the existing component.

Do not create a new one.

---

## Step 2

Check:

```text id="nb5u18"
design-system.md
```

for:

* Spacing
* Radius
* Accessibility
* Layout
* Component rules

---

## Step 3

Check:

```text id="hs1b2w"
tokens/variables.css
```

for:

* Colors
* Typography

Never hardcode values.

---

## Step 4

Determine the component type.

---

# Component Classification

Every component must belong to one category.

---

## Primitive Component

Examples:

```text id="m4dh3u"
Button
Input
Badge
Avatar
Spinner
```

Reusable throughout the application.

---

## Shared Component

Examples:

```text id="eqn4i2"
PageHeader
SearchBar
EmptyState
ConfirmationModal
```

Used across multiple domains.

---

## Feature Component

Examples:

```text id="6k08l3"
AssessmentSummaryCard
ComplianceScoreCard
RequirementList
```

Specific to one feature.

---

## Page Component

Examples:

```text id="8wmbsh"
AssessmentPage
ComplianceDashboardPage
```

Should primarily compose smaller components.

---

# Folder Structure

Every component should follow:

```text id="8z6b1u"
component-name/

├── component-name.tsx
├── component-name.module.css
├── component-name.types.ts
└── index.ts
```

---

# Component Naming Rules

Use PascalCase.

Good:

```text id="pgj0s5"
AssessmentSummaryCard
ComplianceTaskCard
BusinessSwitcher
```

Bad:

```text id="h9h3h8"
assessmentSummaryCard
assessment-summary-card
```

---

# Single Responsibility Rule

Each component should do one thing.

Bad:

```text id="o6c80t"
Dashboard component

- Fetches data
- Processes data
- Renders data
- Handles payments
- Generates reports
```

Good:

```text id="pj4j0m"
Dashboard

↓

ComplianceScoreCard

↓

TaskList

↓

RecentActivity
```

---

# Data Fetching Rules

Components should not directly own business logic.

Avoid:

```tsx id="2uvxpv"
Component

↓

Database Query

↓

Render
```

Prefer:

```tsx id="w54gsh"
API

↓

Service

↓

Component
```

---

# Styling Rules

All styling must use:

```text id="bdp6yh"
CSS Modules
```

---

## Required File

Every component must have:

```text id="38pjr9"
ComponentName.module.css
```

---

## Forbidden

Do not use:

* Tailwind
* Styled Components
* Emotion
* Inline style systems

---

# Token Rules

All colors and typography must come from:

```text id="8hprvu"
tokens/variables.css
```

Never hardcode:

* Hex colors
* RGB values
* Font sizes
* Font families
* Font weights

---

# Layout Rules

Use approved spacing values only.

Allowed:

```text id="6gm6t8"
4
8
12
16
24
32
48
64
80
96
```

Do not invent spacing values.

---

# Accessibility Rules

Every component must support:

* Keyboard navigation
* Focus states
* Screen readers

---

## Interactive Components

Must support:

* Hover
* Focus
* Disabled
* Loading

states.

---

## Touch Targets

Minimum:

```text id="m7phv4"
44px
```

Preferred:

```text id="8zqdc0"
48px
```

---

# Form Component Rules

Inputs must support:

* Label
* Validation
* Error state
* Helper text

Never create unlabeled form controls.

---

# Card Component Rules

Cards should contain:

* Title
* Content
* Action

Avoid overloading cards.

---

# Table Component Rules

Tables should support:

* Empty states
* Loading states
* Responsive behavior

For mobile:

Prefer stacked layouts over horizontal scrolling.

---

# Assessment Component Rules

Assessment components must respect payment gating.

Before payment:

Allowed:

* Requirement count
* Agency count
* Compliance score
* Categories

Forbidden:

* Requirement details
* Cost breakdowns
* Risk analysis
* Launch roadmap

---

# Billing Component Rules

Billing components must never determine access.

The server determines:

* Subscription status
* Assessment access
* Premium access

The UI only displays status.

---

# Compliance Component Rules

Compliance components must clearly communicate:

* Status
* Priority
* Due date
* Required action

Users should always know what to do next.

---

# Loading State Rules

Every async component must support:

* Loading
* Success
* Error
* Empty

states.

---

# Empty State Rules

Empty states must explain:

* Why the state exists
* What action is available

Avoid generic messages.

---

# Error State Rules

Errors must be:

* Human-readable
* Actionable

Bad:

```text id="rj4byh"
Something went wrong
```

Good:

```text id="y3vgfk"
No compliance requirements were found for the selected industry.
```

---

# Component Documentation Rules

Every new component should document:

* Purpose
* Props
* Usage

Complex components should include examples.

---

# Performance Rules

Avoid unnecessary:

* Re-renders
* Data fetching
* State duplication

Optimize only when necessary.

---

# Reusability Rules

Before creating:

```text id="b5xkmv"
AssessmentRequirementCard
```

Check whether:

```text id="umr9tk"
RequirementCard
```

already exists.

Prefer extension over duplication.

---

# Security Rules

Components must never:

* Expose locked assessment content
* Trust payment state from the client
* Expose sensitive identifiers
* Expose private business data

---

# Component Acceptance Checklist

A component is considered complete only when:

✓ Uses existing design tokens

✓ Uses CSS Modules

✓ Follows spacing rules

✓ Is accessible

✓ Supports loading state

✓ Supports error state

✓ Supports empty state

✓ Uses proper typing

✓ Respects security rules

✓ Respects payment-gating rules

---

# Non-Negotiables

Never:

* Create duplicate components
* Hardcode colors
* Hardcode typography
* Introduce Tailwind
* Put business logic inside UI components
* Bypass design tokens
* Expose locked assessment content

Consistency is more important than speed of implementation.
