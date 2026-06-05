# skill: rag-knowledge-manager

## Purpose

This skill is responsible for building, maintaining, and improving the Retrieval-Augmented Generation (RAG) system that powers LaunchSafe.

This is the primary anti-hallucination system.

The RAG layer ensures that AI responses are grounded in verified regulatory knowledge rather than model memory.

Every AI compliance feature depends on this skill.

---

# Core Responsibility

The RAG Knowledge Manager is responsible for:

* Knowledge ingestion
* Document chunking
* Embedding generation
* Knowledge retrieval
* Context assembly
* Source attribution
* Retrieval optimization
* Knowledge freshness

The RAG Knowledge Manager is not responsible for:

* Regulatory verification
* Requirement creation
* Payment processing
* Subscription management

---

# Core Philosophy

For LaunchSafe:

```text id="ay6s5x"
Retrieved Knowledge

>

Model Memory
```

The system should always trust verified regulatory knowledge over AI memory.

If retrieved knowledge and model memory conflict:

Retrieved knowledge wins.

---

# Primary Objective

Every AI-generated compliance response should be grounded in:

* Regulatory requirements
* Agency documentation
* Regulatory updates
* Compliance policies
* Verified knowledge records

Never generate compliance intelligence from memory alone.

---

# Supported Knowledge Sources

Approved sources:

* Regulatory requirements
* Agency publications
* Government regulations
* Regulatory directives
* Regulatory circulars
* Official fee schedules
* Compliance templates
* Regulatory updates

---

# Forbidden Knowledge Sources

Do not ingest:

* Blogs
* Social media
* Forum posts
* User comments
* News articles
* AI-generated content

unless explicitly classified as community-reported information.

---

# Knowledge Ingestion Workflow

Required workflow:

```text id="wjlwmw"
Source

↓

Validation

↓

Classification

↓

Chunking

↓

Embedding

↓

Storage

↓

Retrieval
```

No content should bypass validation.

---

# Knowledge Classification Rules

Every knowledge record must belong to one category.

## Verified

Officially validated.

---

## Estimated

Derived from evidence.

---

## Community Reported

User-submitted information.

---

# Chunking Rules

Documents should be chunked logically.

Preferred boundaries:

* Requirement sections
* Agency sections
* Regulatory sections
* Fee schedules
* Compliance procedures

Avoid arbitrary chunk sizes.

---

# Chunk Metadata Rules

Every chunk should contain:

* Source ID
* Source Type
* Agency
* Industry
* Jurisdiction
* Verification Date
* Confidence Level

Metadata is mandatory.

---

# Embedding Rules

Only approved regulatory content should be embedded.

Examples:

* Requirements
* Directives
* Guidelines
* Fee schedules
* Compliance procedures

Do not embed:

* User passwords
* Payment information
* Internal secrets

---

# Recommended Vector Store

Preferred:

```text id="0if9hf"
pgvector
```

Reason:

* PostgreSQL integration
* Simpler architecture
* Lower operational complexity

---

# Retrieval Rules

Retrieval must prioritize:

1. Verified content
2. Industry relevance
3. Jurisdiction relevance
4. Recency
5. Confidence level

---

# Retrieval Workflow

Required flow:

```text id="mjlwm1"
User Query

↓

Query Analysis

↓

Knowledge Retrieval

↓

Context Ranking

↓

Context Assembly

↓

LLM

↓

Response
```

---

# Context Assembly Rules

Only relevant context should be included.

Avoid:

* Large irrelevant documents
* Excessive token usage
* Duplicate content

Prefer precision.

---

# Source Attribution Rules

Every AI-generated compliance response should retain:

* Source references
* Agency references
* Verification status
* Confidence level

Users should always understand where information originated.

---

# Freshness Rules

Knowledge should remain current.

Every record should include:

* Created date
* Verification date
* Last reviewed date

Stale knowledge should trigger review workflows.

---

# Regulatory Update Rules

When regulations change:

```text id="kkmjlwm"
Regulation Updated

↓

Knowledge Updated

↓

Embeddings Regenerated

↓

Retrieval Index Updated
```

Outdated embeddings should not remain active.

---

# Search Ranking Rules

Highest priority:

```text id="nhn3s8"
Verified

↓

Recent

↓

Relevant
```

Lowest priority:

```text id="5ub3na"
Community Reported
```

Community information should never outrank verified requirements.

---

# AI Context Rules

The AI should receive:

* Retrieved requirements
* Retrieved costs
* Retrieved deadlines
* Retrieved agencies

The AI should not receive:

* Entire databases
* Unrelated regulations
* Sensitive business information not required for the task

---

# Hallucination Prevention Rules

Before generating compliance content:

Verify:

* Retrieved data exists
* Sources exist
* Confidence levels exist

If retrieval fails:

The AI should acknowledge uncertainty.

---

# Missing Information Rules

Allowed:

```text id="shv7es"
Information currently unavailable.

Additional regulatory verification required.
```

Not Allowed:

```text id="7bpn3h"
Likely requirement

Probably required

Estimated regulation
```

without supporting retrieval.

---

# Retrieval Quality Rules

Responses should prioritize:

* Accuracy
* Source quality
* Relevance

Not:

* Creativity
* Completeness at all costs

---

# Security Rules

The RAG system must never retrieve:

* Passwords
* Payment credentials
* Secrets
* Internal system keys

Only approved knowledge should enter retrieval pipelines.

---

# Audit Requirements

Log:

* Ingestion events
* Retrieval events
* Knowledge updates
* Embedding updates

Maintain audit history.

---

# Performance Targets

Knowledge Retrieval:

```text id="jqjlwm"
< 2 seconds
```

Context Assembly:

```text id="jlwm4a"
< 1 second
```

AI Response Preparation:

```text id="jlwm8v"
< 3 seconds
```

---

# Required Dependencies

This skill should follow:

* AGENTS.md
* regulatory-knowledge-rules.md
* compliance-rules.md
* data-architecture.md
* security.md
* architecture.md

---

# Completion Checklist

✓ Knowledge source verified

✓ Chunking completed

✓ Metadata attached

✓ Embeddings generated

✓ Retrieval configured

✓ Source attribution preserved

✓ Freshness maintained

✓ Security rules followed

✓ No hallucination pathways introduced

---

# Non-Negotiables

Never:

* Use AI memory as a regulatory source
* Ingest unverified compliance information
* Remove source attribution
* Allow community-reported content to outrank verified content
* Generate compliance responses without retrieval

For LaunchSafe, retrieval accuracy is more important than AI sophistication.
