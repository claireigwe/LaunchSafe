---
trigger: always_on
---

# design-system.md

## Purpose

This document defines the visual system, UI implementation rules, UX standards, accessibility requirements, layout rules, and styling constraints for LaunchSafe.

All UI development must follow this document.

If implementation conflicts with this document, this document takes precedence for all design decisions.

---

# Design Philosophy

LaunchSafe is a professional compliance operating system.

The interface should feel:

* Trustworthy
* Structured
* Calm
* Professional
* Efficient
* Clear

The interface should never feel:

* Playful
* Experimental
* Social-media inspired
* Trendy
* AI-chat focused

Users should feel confident managing important business compliance obligations.

---

# Design System Source of Truth

## Token Files Are The Source Of Truth

LaunchSafe uses:

```text
tokens/variables.css
```

as the single source of truth for:

* Colors
* Typography

The AI must never modify token values without explicit instruction.

---

# Mandatory: Use CSS Variables

Never hardcode:

* Colors
* Typography
* Font sizes
* Font weights
* Font families

Wrong:

```css
color: #000;
font-size: 16px;
font-family: Arial;
```

Correct:

```css
color: var(--color-text-primary);
font-size: var(--font-size-body);
font-family: var(--font-family-base);
```

Before introducing a value:

1. Check variables.css
2. Use an existing token
3. Ask before inventing new tokens

---

# Styling Architecture

## Approved Styling Method

Use:

```text
CSS Modules
```

Example:

```text
Button.module.css
DashboardCard.module.css
AssessmentSummary.module.css
```

---

## Forbidden Styling Methods

Do not use:

* Tailwind
* Styled Components
* Emotion
* Inline CSS frameworks

---

## Inline Styles

Avoid:

```jsx
style={{}}
```

except for truly dynamic values.

Examples:

* Progress percentages
* Dynamic chart dimensions

---

# Mobile First Rules

LaunchSafe must be built mobile-first.

Default styles target mobile.

Enhance upward using breakpoints.

---

## Supported Viewports

Mobile

```text
320px - 767px
```

Tablet

```text
768px - 1023px
```

Desktop

```text
1024px+
```

---

## Mobile Requirements

Every screen must function correctly on:

```text
375px width
```

This is the minimum design validation size.

---

# Responsive Rules

Use:

```css
@media (min-width: 768px)
```

for tablet enhancements.

Use:

```css
@media (min-width: 1024px)
```

for desktop enhancements.

---

# Spacing System

Use a consistent spacing scale.

Approved values:

```text
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

Spacing applies to:

* Padding
* Margin
* Gap
* Layout spacing

Do not invent arbitrary spacing values.

---

# Border Radius Rules

Use only approved radius values.

Small Elements

```text
4px
```

Examples:

* Badges
* Tags

---

Inputs & Buttons

```text
12px
```

Examples:

* Inputs
* Selects
* Buttons

---

Cards & Modals

```text
24px
```

Examples:

* Dashboard cards
* Assessment cards
* Dialogs
* Modals

---

Do not invent new radius values.

---

# Shadow & Elevation Rules

LaunchSafe should use subtle elevation.

Prioritize:

* Borders
* Surface separation

before heavy shadows.

Avoid:

* Large blur shadows
* Floating card aesthetics

The product should feel professional, not decorative.

---

# Layout Rules

## Content Width

Use predictable container widths.

Suggested maximum:

```text
1280px
```

for desktop layouts.

---

## Page Structure

Typical page layout:

```text
Header

↓

Page Title

↓

Primary Actions

↓

Main Content

↓

Secondary Content
```

---

# Navigation Rules

Primary navigation should expose:

* Dashboard
* Businesses
* Assessments
* Compliance Tasks
* Documents
* Regulatory Updates
* Notifications
* Settings

Avoid excessive nesting.

---

# Component Design Rules

Components must be:

* Reusable
* Accessible
* Predictable
* Composable

---

## Component Hierarchy

Prefer:

```text
Primitive Components

↓

Shared Components

↓

Feature Components

↓

Page Components
```

---

# Button Rules

## Primary Button

Used for:

* Continue
* Generate Report
* Save
* Purchase Assessment
* Subscribe

Only one primary action should dominate a section.

---

## Secondary Button

Used for:

* Cancel
* Back
* Review
* Optional actions

---

## Destructive Button

Used for:

* Delete
* Remove
* Archive

Must visually communicate risk.

---

# Form Rules

LaunchSafe is form-heavy.

Forms must be:

* Clear
* Structured
* Easy to scan

---

## Required Form Features

Every field must support:

* Label
* Validation
* Error state
* Helper text when needed

---

## Multi-Step Forms

Assessment flows should be split into logical steps.

Avoid overwhelming users with long forms.

---

# Table Rules

Regulatory information frequently appears in tables.

Tables should support:

* Sorting
* Filtering
* Responsive layouts

---

## Mobile Tables

Do not allow horizontal scrolling when avoidable.

Prefer stacked cards for mobile.

---

# Card Rules

Cards should display:

* Title
* Key information
* Status
* Action

Avoid excessive content inside a single card.

---

# Status Badge Rules

Status badges should be used consistently.

Examples:

* Verified
* Estimated
* Community Reported
* Active
* Due Soon
* Overdue
* Completed

Status badges must always include text, not color alone.

---

# Dashboard Rules

Dashboard priority order:

1. Compliance Health Score
2. Upcoming Deadlines
3. Outstanding Tasks
4. Regulatory Updates
5. Recent Activity

Critical information should appear above the fold.

---

# Assessment Experience Rules

Assessment experiences should feel guided.

Users should always know:

* Current step
* Remaining steps
* Expected outcome

---

# Assessment Summary Rules

Before payment, users may see:

* Business type
* Location
* Requirement count
* Agency count
* Compliance complexity score
* Compliance categories

Users must never see:

* Exact requirements
* Cost breakdowns
* Permit details
* Licensing details
* Compliance timelines
* Risk analysis
* Launch roadmap

before payment verification.

---

# Payment UI Rules

The UI must clearly communicate:

* What is free
* What is paid
* What becomes available after purchase

Avoid surprise paywalls.

---

# Compliance Dashboard Rules

Every dashboard should emphasize:

* Actions
* Deadlines
* Risks
* Progress

Avoid vanity metrics.

---

# Notification Rules

Notifications must be:

* Relevant
* Actionable
* Timely

Avoid notification fatigue.

---

# Loading State Rules

All async actions require visible feedback.

Examples:

* Assessment generation
* Payment verification
* Document generation
* Report generation

Users should never wonder if the system is working.

---

# Empty State Rules

Every empty state must explain:

* What happened
* Why it happened
* What to do next

---

# Error State Rules

Errors must be:

* Human-readable
* Actionable
* Specific

Bad:

```text
Error 500
```

Good:

```text
We couldn't generate your assessment because the selected industry is not currently supported.
```

---

# Accessibility Rules

All components must support:

* Keyboard navigation
* Focus states
* Screen readers
* Sufficient color contrast

---

## Touch Targets

Minimum interactive height:

```text
44px
```

Preferred:

```text
48px
```

Applies to:

* Buttons
* Inputs
* Navigation items

---

# AI Interface Rules

LaunchSafe is not a chatbot.

Avoid:

* Chat interfaces
* AI avatars
* Conversational-first UX

Prefer:

* Dashboards
* Reports
* Forms
* Structured workflows

AI should feel embedded, not personified.

---

# Trust & Transparency Rules

Every compliance insight should display:

* Confidence level
* Verification status
* Source information

Trust is a product requirement.

---

# Design System Enforcement Rules

Before creating a new component:

1. Check if a similar component exists
2. Reuse before creating
3. Use existing tokens
4. Follow approved spacing
5. Follow approved radius values
6. Follow accessibility requirements

Consistency is more important than creativity.

---

# Non-Negotiables

Never:

* Hardcode colors
* Hardcode typography values
* Introduce Tailwind
* Introduce styled-components
* Bypass design tokens
* Expose locked assessment content
* Build chatbot-style experiences
* Create inaccessible components
* Invent spacing values
* Invent radius values

LaunchSafe must feel like a single, trustworthy compliance operating system.
