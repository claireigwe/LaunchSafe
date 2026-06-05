# skill: notification-system-builder

## Purpose

This skill is responsible for building, maintaining, and improving the LaunchSafe Notification System.

The Notification System ensures businesses receive timely reminders, alerts, warnings, and updates related to compliance obligations.

This system is mission-critical because compliance failures are often caused by missed deadlines rather than lack of information.

---

# Core Philosophy

The purpose of notifications is to drive action.

Notifications should answer:

```text id="notif01"
What happened?

Why does it matter?

What should I do next?
```

Every notification should help the user take action.

---

# Primary Responsibilities

The Notification System is responsible for:

* Deadline reminders
* Compliance alerts
* Regulatory update notifications
* Document notifications
* Billing notifications
* Assessment notifications
* Subscription notifications
* Notification scheduling
* Notification delivery

The Notification System is not responsible for:

* Compliance calculations
* Regulatory verification
* Payment processing
* Subscription activation

---

# Notification Categories

Supported categories:

## Compliance

Examples:

* Upcoming deadline
* Requirement due soon
* Requirement overdue
* Compliance score changes

---

## Regulatory Updates

Examples:

* New regulation
* Updated requirement
* Updated fee schedule
* New agency guidance

---

## Documents

Examples:

* Document generated
* Document ready
* Document updated

---

## Assessments

Examples:

* Assessment completed
* Report unlocked
* Report available

---

## Billing

Examples:

* Payment successful
* Payment failed
* Subscription renewed
* Subscription expiring

---

## System

Examples:

* Account updates
* Security notifications
* Platform announcements

---

# Notification Channels

Supported channels:

## In-App

Primary notification channel.

Required.

---

## Email

Secondary notification channel.

Required.

---

# Future Channels

Potential future support:

* SMS
* WhatsApp
* Push notifications

Architecture should support expansion.

---

# Notification Priority Levels

Supported priorities:

```text id="notif02"
Low

Medium

High

Critical
```

---

# Priority Rules

## Critical

Examples:

* Overdue obligations
* Compliance violations
* Expiring permits

Immediate visibility required.

---

## High

Examples:

* Upcoming deadlines
* Regulatory changes

---

## Medium

Examples:

* Generated reports
* Generated documents

---

## Low

Examples:

* Informational updates

---

# Notification Workflow

Required flow:

```text id="notif03"
Event

↓

Notification Service

↓

Notification Creation

↓

Channel Selection

↓

Delivery

↓

Tracking
```

Notifications should be event-driven.

---

# Event Sources

Notifications may originate from:

* Compliance tasks
* Compliance deadlines
* Regulatory updates
* Billing events
* Document generation
* Assessment completion
* Subscription lifecycle events

---

# Deadline Reminder Rules

The system should generate reminders:

```text id="notif04"
30 Days Before

14 Days Before

7 Days Before

3 Days Before

1 Day Before

Due Date

Overdue
```

These intervals should be configurable.

---

# Overdue Rules

When a requirement becomes overdue:

The system should:

1. Create notification
2. Increase visibility
3. Surface risk information
4. Recommend next action

---

# Compliance Score Notification Rules

Notify users when:

* Score increases significantly
* Score decreases significantly
* Critical compliance issues emerge

Notifications should explain why.

---

# Regulatory Update Rules

Users should only receive updates relevant to:

* Their country
* Their state
* Their industry
* Their compliance obligations

Avoid irrelevant alerts.

---

# Billing Notification Rules

Notify users for:

## Assessment Purchases

* Purchase successful
* Report unlocked
* Report available

---

## Subscriptions

* Subscription activated
* Subscription renewed
* Subscription expiring
* Subscription expired
* Payment failed

---

# Document Notification Rules

Notify users when:

* Document generated
* Document updated
* Document ready for download

---

# Notification Content Rules

Every notification should contain:

* Title
* Summary
* Priority
* Related entity
* Recommended action

Notifications should remain concise.

---

# Actionability Rules

Good notification:

```text id="notif05"
Food Handling Permit expires in 7 days.

Renew now to avoid compliance risk.
```

Bad notification:

```text id="notif06"
Reminder.
```

Notifications should always provide context.

---

# User Preference Rules

Users should be able to manage:

* Email preferences
* Notification categories
* Notification frequency

Critical compliance alerts may override optional preferences.

---

# Notification Deduplication Rules

Avoid duplicate notifications.

The system should prevent:

```text id="notif07"
10 notifications

for the same deadline
```

within a short period.

---

# Notification Expiration Rules

Notifications should support:

* Active
* Read
* Archived

states.

Old notifications should not clutter the interface.

---

# Multi-Business Rules

For users managing multiple businesses:

Notifications should clearly identify:

* Business name
* Related obligation
* Related agency

Avoid ambiguity.

---

# Dashboard Integration Rules

Notifications should integrate with:

* Compliance Dashboard
* Task Management
* Regulatory Updates
* Billing Center

Notifications should drive users toward action.

---

# Email Rules

Emails should be:

* Clear
* Action-oriented
* Mobile-friendly

Avoid long compliance essays.

---

# Mobile Rules

Notification interfaces must function correctly on:

```text id="notif08"
375px width
```

Minimum supported viewport.

---

# Security Rules

Notifications must never expose:

* Sensitive business data
* Payment credentials
* Internal platform data

Notification content should be permission-aware.

---

# Audit Rules

Log:

* Notification creation
* Notification delivery
* Notification failures
* Notification reads

Maintain delivery history.

---

# Anti-Hallucination Rules

Notifications must never contain:

* Invented deadlines
* Invented requirements
* Invented compliance risks
* Invented regulatory changes

All notifications must originate from verified system data.

---

# Performance Targets

Notification Creation:

```text id="notif09"
< 1 second
```

In-App Delivery:

```text id="notif10"
Near real-time
```

Email Dispatch:

```text id="notif11"
< 5 minutes
```

---

# Required Dependencies

This skill should follow:

* AGENTS.md
* compliance-rules.md
* regulatory-knowledge-rules.md
* security.md
* compliance-dashboard-builder
* architecture.md

---

# Completion Checklist

✓ Notification categories implemented

✓ Priority levels implemented

✓ Scheduling implemented

✓ Deadline reminders implemented

✓ Regulatory update alerts implemented

✓ Billing notifications implemented

✓ User preferences implemented

✓ Deduplication implemented

✓ Audit logging implemented

✓ No hallucinated notifications

---

# Non-Negotiables

Never:

* Send duplicate notification spam
* Generate notifications from AI assumptions
* Notify users about unsupported compliance information
* Expose sensitive information in notifications
* Ignore ownership permissions

A notification is only valuable if it helps the user take the correct action at the correct time.
