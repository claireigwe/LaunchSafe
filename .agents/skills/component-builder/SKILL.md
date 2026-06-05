# skill: component-builder

## Purpose

This skill is responsible for creating, extending, refactoring, and maintaining UI components throughout LaunchSafe.

This skill exists to ensure all generated components follow:

* AGENTS.md
* design-system.md
* code-style.md
* architecture.md
* new-component.md

This skill should be used whenever a new UI component is requested.

---

# Core Philosophy

Components should be:

* Reusable
* Accessible
* Predictable
* Maintainable
* Consistent

The goal is not to build components quickly.

The goal is to build components that remain useful for years.

---

# Primary Responsibilities

This skill is responsible for:

* Component creation
* Component extension
* Component refactoring
* Component composition
* Accessibility implementation
* Responsive implementation
* Design system compliance

This skill is not responsible for:

* Business logic
* Database access
* Payment verification
* Regulatory calculations

---

# Mandatory Pre-Build Checklist

Before creating a component:

## Step 1

Search existing components.

Questions:

* Does a similar component already exist?
* Can an existing component be reused?
* Can composition solve the problem?

If yes:

Reuse existing components.

---

## Step 2

Review:

```text id="comp01"
design-system.md
```

---

## Step 3

Review:

```text id="comp02"
new-component.md
```

---

## Step 4

Review:

```text id="comp03"
tokens/variables.css
```

---

## Step 5

Determine component classification.

---

# Component Classification

Every component must belong to one category.

---

## Primitive Components

Examples:

```text id="comp04"
Button
Input
Textarea
Select
Badge
Spinner
Modal
```

Reusable everywhere.

---

## Shared Components

Examples:

```text id="comp05"
PageHeader
EmptyState
DataTable
ConfirmationModal
SearchBar
```

Used across multiple domains.

---

## Feature Components

Examples:

```text id="comp06"
AssessmentSummaryCard
ComplianceScoreCard
RequirementCard
DeadlineList
```

Feature-specific.

---

## Page Components

Examples:

```text id="comp07"
AssessmentPage
DashboardPage
BillingPage
```

Should primarily compose smaller components.

---

# Required File Structure

Every component should follow:

```text id="comp08"
component-name/

├── component-name.tsx
├── component-name.module.css
├── component-name.types.ts
└── index.ts
```

---

# Styling Rules

All styling must use:

```text id="comp09"
CSS Modules
```

---

# Token Rules

Colors and typography must come from:

```text id="comp10"
tokens/variables.css
```

Never hardcode:

* Colors
* Font sizes
* Font families
* Font weights

---

# Spacing Rules

Allowed values:

```text id="comp11"
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

# Radius Rules

Use approved values only.

Small Elements:

```text id="comp12"
4px
```

Inputs & Buttons:

```text id="comp13"
12px
```

Cards & Modals:

```text id="comp14"
24px
```

---

# Responsive Rules

All components must support:

```text id="comp15"
Mobile
Tablet
Desktop
```

Minimum supported width:

```text id="comp16"
375px
```

---

# Accessibility Rules

Every component must support:

* Keyboard navigation
* Focus states
* Screen readers
* Proper semantic HTML

---

# Touch Target Rules

Minimum:

```text id="comp17"
44px
```

Preferred:

```text id="comp18"
48px
```

---

# Form Component Rules

Every input component must support:

* Label
* Validation
* Error state
* Helper text
* Disabled state

---

# Table Component Rules

Tables must support:

* Empty state
* Loading state
* Error state

Mobile layouts should be considered.

---

# Card Component Rules

Cards should contain:

* Clear title
* Relevant information
* Action(s)

Avoid overloaded cards.

---

# Loading State Rules

Every async component must support:

```text id="comp19"
Loading
Success
Error
Empty
```

states.

---

# Error State Rules

Errors should be:

* Human-readable
* Actionable

Avoid technical messages.

---

# Empty State Rules

Empty states should explain:

* Why nothing is displayed
* What action is available

---

# Assessment Component Rules

Assessment-related components must respect payment gating.

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

Billing components may display:

* Subscription status
* Payment history
* Plan information

Billing components must never determine access rights.

The server determines access.

---

# Compliance Component Rules

Compliance components should prioritize:

* Due dates
* Priority
* Status
* Required actions

Users should always know what action to take.

---

# Security Rules

Components must never:

* Expose private data
* Expose locked content
* Trust client-side payment state
* Reveal sensitive identifiers

---

# Performance Rules

Avoid:

* Unnecessary re-renders
* Duplicate state
* Excessive prop drilling

Prefer simple, predictable components.

---

# Refactoring Rules

Before creating new components:

Check if an existing component can be:

* Reused
* Extended
* Composed

Avoid duplication.

---

# Required Output Standards

Generated components should include:

✓ TypeScript typing

✓ CSS Module

✓ Accessibility support

✓ Loading state

✓ Error state

✓ Empty state (where applicable)

✓ Responsive behavior

✓ Design system compliance

---

# Required Dependencies

This skill should follow:

* AGENTS.md
* design-system.md
* code-style.md
* new-component.md
* architecture.md

---

# Completion Checklist

✓ Existing components reviewed

✓ Design system followed

✓ CSS Modules used

✓ Tokens used

✓ Accessibility implemented

✓ Responsive behavior verified

✓ Proper typing added

✓ Security rules respected

✓ No duplicate component created

---

# Non-Negotiables

Never:

* Introduce Tailwind
* Hardcode colors
* Hardcode typography
* Bypass design tokens
* Create inaccessible components
* Duplicate existing components
* Expose locked assessment content

Component consistency is more important than development speed.
