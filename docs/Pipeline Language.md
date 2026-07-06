# Pipeline Language

> Pipelines describe how information moves and changes within Aurii.
>
> Schemas describe structure.
>
> Queries describe retrieval.
>
> Pipelines describe transformation.

---

# Purpose

Every platform needs a way to change information.

Traditional systems solve this with:

- scripts
- cron jobs
- SQL
- custom code
- integrations
- CI/CD pipelines

These solutions often become fragmented.

Aurii instead provides one declarative language for describing transformations.

---

# Philosophy

A Pipeline answers one question:

> How should information change?

A Pipeline never asks:

> How do I write code to do this?

Instead it describes intent.

Core performs execution.

---

# The Three Languages

Aurii is built around three declarative languages.

```
Schema Language

↓

Describes reality

-------------------------

Query Language

↓

Reads reality

-------------------------

Pipeline Language

↓

Changes reality
```

Together they form the programming model of Aurii.

---

# Pipelines Are Resources

A Pipeline is an Entity.

It has:

- identity
- version
- documentation
- permissions
- execution history
- ownership

Pipelines should be reusable.

---

# Pipeline Lifecycle

Every Pipeline follows the same lifecycle.

```
Design

↓

Validate

↓

Test

↓

Publish

↓

Execute

↓

Observe

↓

Version
```

Pipelines are long-lived assets.

---

# Declarative

Pipelines describe transformations.

Example:

```
Import CSV

↓

Normalize

↓

Validate

↓

Create Relationships

↓

Generate Slugs

↓

Store Entities
```

The Pipeline never describes threads, transactions or SQL.

Core decides execution.

---

# Building Blocks

Pipelines consist of Steps.

```
Pipeline

↓

Step

↓

Step

↓

Step
```

Every Step performs one responsibility.

---

# Step Types

Examples include:

## Read

Read information from:

- Import
- Dataset
- API
- Database
- Object Storage

---

## Transform

Examples:

- Trim
- Normalize
- Split
- Merge
- Convert
- Format
- Calculate

---

## Validate

Examples:

- Schema validation
- Business rules
- Duplicate detection
- Reference validation
- Custom rules

---

## Enrich

Examples:

- Municipality lookup
- Currency conversion
- Geocoding
- AI enrichment
- Metadata extraction

---

## Relationship

Create or update Entity relationships.

Examples:

```
Company

↓

Municipality

↓

County
```

---

## Publish

Publish information.

Examples:

- Events
- APIs
- Search
- Webhooks

---

## Notify

Examples:

- Email
- Slack
- Teams
- Webhook
- Push Notification

---

## AI

AI may participate as a Step.

Examples:

- Summarize
- Categorize
- Translate
- Generate Metadata
- Detect Language
- Extract Entities

AI remains deterministic through reviewable outputs.

---

# Composition

Pipelines should compose.

One Pipeline may call another.

Example:

```
Import Pipeline

↓

Validation Pipeline

↓

Publishing Pipeline
```

Small reusable Pipelines are preferred over large monolithic workflows.

---

# Inputs

Every Pipeline accepts one or more inputs.

Examples:

- Entity
- Dataset
- Import
- Asset
- Event

Everything entering a Pipeline should be typed.

---

# Outputs

Outputs are also typed.

Examples:

- Entity
- Dataset
- Event
- Asset
- Report

The next Step always knows what to expect.

---

# Idempotency

Pipelines should be safe to run repeatedly.

Running the same Pipeline twice should never create inconsistent state.

Whenever possible:

```
Input

↓

Pipeline

↓

Result

↓

Run Again

↓

Same Result
```

Predictability is critical.

---

# Transactions

Pipeline execution should remain transactional where possible.

```
Validate

↓

Transform

↓

Persist

↓

Index

↓

Publish Event
```

Either everything succeeds,

or nothing succeeds.

---

# Parallelism

Independent Steps may execute concurrently.

Example:

```
Extract Metadata

────────────┐

Generate Preview

────────────┤

Create Thumbnail

────────────┘

↓

Continue
```

Core decides scheduling.

Pipelines remain declarative.

---

# Scheduling

Pipelines may execute:

- manually
- on schedule
- after imports
- after events
- via API
- via webhooks

Execution should never depend on UI.

---

# Event Driven

Pipelines should react to Events.

Examples:

```
Entity Published

↓

Generate RSS

↓

Invalidate Cache

↓

Notify Subscribers
```

Events trigger Pipelines.

Pipelines create Events.

This creates a loosely coupled platform.

---

# Error Handling

Failures should be explicit.

Possible strategies include:

- Retry
- Skip
- Rollback
- Continue
- Dead Letter Queue

Pipeline authors choose intent.

Core executes consistently.

---

# Observability

Every execution should expose:

- status
- duration
- logs
- metrics
- warnings
- outputs
- failures

Pipelines should never be black boxes.

---

# Security

Pipelines execute under a security context.

Permissions apply exactly as if a user performed the action.

Pipelines never bypass authorization.

---

# Versioning

Pipelines evolve over time.

Every published version remains reproducible.

Historical executions always reference the Pipeline version they used.

---

# Plugins

Plugins may contribute new Steps.

Examples:

```
AI Classification

↓

New Step

----------------

Translate

↓

New Step

----------------

Send to SAP

↓

New Step
```

Core should not require modification.

---

# Studio

Studio should visualize Pipelines.

Users should understand workflows without reading code.

Visual editing should be optional.

The underlying representation remains declarative.

---

# Relationship to Capabilities

Capabilities describe what an Entity can do.

Pipelines describe how those capabilities are exercised.

Example:

```
Capability

↓

Publish

↓

Pipeline

↓

Validate

↓

Index

↓

Notify

↓

Complete
```

Capabilities define behavior.

Pipelines orchestrate execution.

---

# Relationship to AI

AI is not the Pipeline.

AI is one possible Step.

This keeps Pipelines deterministic while allowing AI where it adds value.

---

# Why Pipeline Language Exists

Without Pipeline Language:

- automation lives in scripts
- integrations become custom code
- workflows become duplicated

With Pipeline Language:

- workflows become reusable
- automation becomes declarative
- execution becomes observable
- AI becomes composable

The platform becomes predictable.

---

# Guiding Principle

Schemas describe what exists.

Queries describe what is needed.

Pipelines describe how change happens.

Together they form the declarative foundation of Aurii.

Core is the runtime that executes them.