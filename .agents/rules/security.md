---
trigger: always_on
---

# security.md

## Purpose

This document defines the security requirements, security architecture, access control policies, payment security standards, data protection requirements, and operational security procedures for LaunchSafe.

Security requirements are mandatory.

If implementation conflicts with security requirements, security requirements take precedence.

---

# Security Philosophy

LaunchSafe manages:

* Business compliance records
* Regulatory intelligence
* Generated documents
* Compliance evidence
* Assessment reports
* Payment information
* Subscription data

Security is a core product requirement.

Security is not optional.

---

# Core Security Principles

## Least Privilege

Users should only access resources they need.

---

## Defense In Depth

Security should exist at multiple layers:

* Frontend
* API
* Database
* Storage
* Authentication
* Authorization

---

## Secure By Default

All systems should default to the most secure configuration.

---

## Verify Everything

Never trust:

* Client-side input
* Browser state
* Query parameters
* Local storage
* Session assumptions

Always verify.

---

## Auditability

Every important action should be traceable.

---

# Authentication Security

## Approved Authentication Methods

Supported:

* Email and password
* Magic links

Future:

* OAuth providers

---

## Password Security

Passwords must:

* Be hashed
* Never be stored in plaintext
* Never be logged

Use modern password hashing standards.

---

## Email Verification

Email verification is required before:

* Accessing business data
* Accessing subscription features
* Managing compliance records

---

## Session Security

Sessions must:

* Expire appropriately
* Be revocable
* Be protected from unauthorized access

---

# Authorization Rules

## Role-Based Access Control

Supported Roles:

### Business Owner

May:

* Manage businesses
* Manage subscriptions
* Generate reports
* Manage compliance

---

### Team Member

May:

* View assigned compliance data
* Upload evidence
* Generate documents

May not:

* Manage billing
* Manage subscriptions
* Delete businesses

---

### Administrator

May:

* Manage platform data
* Manage regulatory data
* Manage users

Administrative actions must be logged.

---

# Business Isolation Rules

Users must never access another user's business data.

Every request must verify:

* User identity
* Business ownership
* Resource permissions

---

# Database Security Rules

## Row Level Security

All user-owned tables must enforce row-level security.

Examples:

* Businesses
* Assessments
* Documents
* Evidence
* Notifications
* Compliance tasks

---

## Data Ownership

Every user-owned record must have a clear owner.

Ownership must be enforced at the database layer.

---

## Sensitive Fields

Sensitive fields should never be exposed unnecessarily.

Examples:

* Password hashes
* Internal IDs
* Billing identifiers

---

# Payment Security Rules

## Payment Philosophy

Payments are security-critical operations.

Payment decisions must always be made server-side.

---

## Never Trust Client-Side Payment Status

The following must never activate access:

* Success pages
* Query parameters
* Redirect URLs
* Browser state
* Local storage

---

## Payment Verification

All payments must be verified through Paystack before:

* Unlocking reports
* Activating subscriptions
* Renewing subscriptions
* Granting premium access

---

## Assessment Purchase Security

Full Compliance Reports may only be unlocked when:

* Payment exists
* Payment is verified
* Verification occurs server-side

Assessment summaries may be viewed without payment.

---

## Subscription Security

Subscriptions may only become active when:

* Payment is verified
* Subscription records are updated
* Billing events are recorded

---

## Card Data Rules

LaunchSafe must never store:

* Card numbers
* CVV values
* Expiration dates

Only store:

* References
* Statuses
* Subscription identifiers

---

# API Security Rules

## Input Validation

All inputs must be validated.

Examples:

* Forms
* Search inputs
* File uploads
* Assessment data

---

## Rate Limiting

Apply rate limiting to:

* Authentication endpoints
* AI endpoints
* Search endpoints
* Billing endpoints

---

## API Authorization

Every protected endpoint must verify:

* Authentication
* Authorization
* Resource ownership

---

## Error Handling

Errors must never expose:

* Database structure
* Internal identifiers
* Secrets
* API keys

---

# File Security Rules

## Storage Security

All uploaded files must be stored securely.

Examples:

* Evidence
* Documents
* Templates

---

## Access Control

Files must not be publicly accessible by default.

Access should require authorization.

---

## Upload Validation

Validate:

* File type
* File size
* Upload permissions

---

## Malware Protection

Uploaded files should be scanned whenever possible.

---

# Document Security Rules

Generated documents may contain sensitive information.

Requirements:

* Access-controlled downloads
* Secure storage
* Audit logging
* Version tracking

---

# Regulatory Data Security

Regulatory intelligence is platform-owned data.

Only authorized administrators may:

* Create requirements
* Modify requirements
* Archive requirements
* Update costs

All changes must be logged.

---

# AI Security Rules

## Prompt Injection Protection

AI systems must not blindly trust user input.

Retrieved content should be prioritized over user instructions.

---

## Retrieval Security

AI responses must be grounded in approved sources.

Unverified information must not be elevated to verified status.

---

## AI Data Access

AI systems should only receive the minimum data necessary to complete a task.

---

# Secrets Management

Secrets must never be:

* Hardcoded
* Committed to source control
* Logged

Examples:

* OpenAI keys
* DeepSeek keys
* Supabase service keys
* Paystack secret keys

Use environment variables.

---

# Environment Security

Required protected secrets:

```env
OPENAI_API_KEY=
DEEPSEEK_API_KEY=

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

PAYSTACK_SECRET_KEY=
PAYSTACK_WEBHOOK_SECRET=

NEXTAUTH_SECRET=
```

---

# Audit Logging Requirements

The following actions must be logged:

* Login attempts
* Password resets
* Assessment creation
* Assessment purchases
* Subscription changes
* Payment verification
* Evidence uploads
* Document generation
* Regulatory data changes

Audit logs must be immutable.

---

# Incident Response Rules

Security incidents should be:

1. Detected
2. Logged
3. Investigated
4. Contained
5. Resolved
6. Documented

---

# Data Retention Rules

Expired subscriptions must not delete:

* Businesses
* Assessments
* Documents
* Evidence
* Compliance history

Users lose access, not ownership.

---

# Backup Rules

Backups should include:

* Database
* Uploaded files
* Regulatory knowledge data

Backups should be tested regularly.

---

# Compliance & Privacy Principles

LaunchSafe should follow:

* Data minimization
* Purpose limitation
* Access control
* Auditability

Collect only the information required to provide the service.

---

# Non-Negotiables

Never:

* Store card information
* Trust client-side payment status
* Bypass payment verification
* Expose private business data
* Disable row-level security
* Expose service role keys
* Store plaintext passwords
* Unlock reports before verified payment

Security always takes priority over convenience.
