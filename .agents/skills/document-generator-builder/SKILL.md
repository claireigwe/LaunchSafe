# skill: document-generator-builder

## Purpose

This skill is responsible for building, maintaining, and improving the LaunchSafe Document Generation System.

The Document Generation System helps users prepare compliance-related documents required for business operations.

This system generates supporting documents.

It does not generate official government approvals.

---

# Core Philosophy

The purpose of document generation is to reduce administrative effort.

The system should help users prepare documents faster while maintaining accuracy.

The system is an assistant for document preparation.

The system is not a government authority.

---

# Primary Responsibilities

The Document Generator is responsible for:

* Document generation
* Template management
* Document versioning
* PDF generation
* Document storage
* Document retrieval
* Document history tracking

The Document Generator is not responsible for:

* Government approvals
* Regulatory verification
* Payment processing
* Subscription management

---

# Supported Document Types

The system may generate:

## Application Letters

Examples:

* Permit application letters
* Agency submission letters
* Registration support letters

---

## Cover Letters

Examples:

* Submission cover letters
* Agency communication letters

---

## Compliance Plans

Examples:

* Compliance implementation plans
* Compliance preparation plans

---

## Policies

Examples:

* Data protection policy
* Internal compliance policy
* Employee compliance policy

---

## Checklists

Examples:

* Launch checklist
* Compliance readiness checklist
* Renewal checklist

---

## Internal Records

Examples:

* Compliance logs
* Requirement tracking sheets
* Compliance preparation records

---

# Forbidden Document Types

The system must never generate:

* Government certificates
* Government permits
* Government licenses
* Regulatory approvals
* Official agency documents
* Forged regulatory records

The system may assist preparation.

It may not impersonate regulators.

---

# Document Generation Workflow

Required flow:

```text id="doc01"
User Request

↓

Template Selection

↓

Regulatory Context Retrieval

↓

Data Validation

↓

Document Generation

↓

Review

↓

Versioning

↓

Storage
```

No document should bypass validation.

---

# Template Rules

All generated documents should originate from templates.

Templates should be:

* Reusable
* Versioned
* Maintainable

Avoid generating entirely free-form documents.

---

# Template Categories

Supported categories:

```text id="doc02"
Application

Cover Letter

Policy

Checklist

Compliance Plan

Internal Record
```

---

# Template Versioning Rules

Templates may evolve.

Every template should support:

* Version history
* Change tracking
* Rollback capability

Historical versions should remain accessible.

---

# Data Population Rules

Documents should be populated using:

* Business information
* Regulatory requirements
* Assessment results
* Compliance records

Never populate documents using assumptions.

---

# AI Usage Rules

AI may assist with:

* Formatting
* Summarization
* Draft generation
* Language simplification

AI must not:

* Invent compliance requirements
* Invent agency requirements
* Invent regulatory language
* Invent legal obligations

AI supports document creation.

It does not define document content.

---

# Regulatory Context Rules

Before generating a document:

The system should retrieve:

* Relevant requirements
* Relevant agencies
* Relevant compliance data

Generated documents should remain grounded in retrieved information.

---

# Source Attribution Rules

Generated documents should retain references to:

* Related requirements
* Related agencies
* Source records

Traceability should be preserved.

---

# Business Information Rules

Business information should be validated before generation.

Examples:

* Business name
* Registration number
* Address
* Industry
* Contact information

Missing information should trigger validation errors.

---

# Document Review Rules

Before finalization:

Users should be able to:

* Preview documents
* Edit documents
* Regenerate documents

Document generation should not be irreversible.

---

# PDF Generation Rules

PDF is the primary export format.

Requirements:

* Consistent layout
* Proper typography
* Printable formatting
* Mobile-friendly viewing

---

# Future Export Support

Future formats may include:

* DOCX
* HTML

PDF remains the primary output.

---

# Versioning Rules

Every generated document should support:

* Version number
* Created date
* Updated date
* Generation source

Document history should be preserved.

---

# Storage Rules

Generated documents should be stored securely.

Supported storage:

```text id="doc03"
Supabase Storage
```

Documents must not be publicly accessible by default.

---

# Access Control Rules

Users may access only:

* Their own documents
* Their own generated files

Ownership verification is mandatory.

---

# Document History Rules

Users should be able to view:

* Current version
* Previous versions
* Generation timestamps

History should never be silently overwritten.

---

# Compliance Plan Rules

Compliance plans should include:

* Requirements
* Deadlines
* Responsibilities
* Recommended sequence

Plans should originate from regulatory data.

---

# Checklist Rules

Checklists should be generated from:

* Requirements
* Assessment results
* Compliance obligations

Checklists should remain actionable.

---

# Policy Generation Rules

Policies should:

* Follow approved templates
* Be editable
* Be clearly labeled as generated content

Policies must not be represented as legal advice.

---

# Security Rules

Generated documents may contain:

* Business information
* Compliance information
* Internal records

Documents should:

* Require authorization
* Be access controlled
* Be logged

---

# Audit Rules

Log:

* Document generation
* Document downloads
* Document updates
* Document deletions
* Template updates

Audit history should remain immutable.

---

# Anti-Hallucination Rules

The Document Generator must never:

* Invent regulatory requirements
* Invent agency requirements
* Invent compliance obligations
* Invent official approvals
* Invent government-issued content

All generated content must be supported by:

* Templates
* Regulatory data
* Business data
* Assessment data

---

# Missing Information Rules

When required information is unavailable:

Allowed:

```text id="doc04"
Additional business information required before document generation.
```

Not Allowed:

```text id="doc05"
Assumed business information
Invented registration details
Estimated company details
```

---

# Performance Targets

Document Draft Generation:

```text id="doc06"
< 5 seconds
```

PDF Export:

```text id="doc07"
< 5 seconds
```

Document Retrieval:

```text id="doc08"
< 2 seconds
```

---

# Required Dependencies

This skill should follow:

* AGENTS.md
* product-rules.md
* compliance-rules.md
* regulatory-knowledge-rules.md
* design-system.md
* security.md

---

# Completion Checklist

✓ Template selected

✓ Regulatory context retrieved

✓ Business information validated

✓ Document generated

✓ Version created

✓ PDF export supported

✓ Ownership checks implemented

✓ Audit logging implemented

✓ No hallucinated compliance information

---

# Non-Negotiables

Never:

* Generate government-issued documents
* Invent compliance requirements
* Invent regulatory obligations
* Expose another user's documents
* Store documents without versioning
* Treat generated documents as legal advice

Document generation should increase efficiency while preserving compliance accuracy.
