# ADR-0001: Adopt a Runtime-First Architecture

**Status:** Accepted

**Date:** 2026-07-04

---

# Context

Aurii was originally conceived as a headless CMS inspired by systems such as Sanity.

As the architecture evolved, it became clear that a traditional CMS-centric architecture imposed unnecessary constraints on the platform.

Modern organizations manage much more than articles and pages. They manage structured knowledge across websites, applications, AI systems, print workflows, APIs and internal tools.

Building the platform around documents or user interfaces would make these use cases secondary.

Instead, the architecture should treat structured knowledge as the primary concern.

---

# Decision

Aurii adopts a Runtime-first architecture.

The Runtime is the heart of the platform.

Applications—including Studio—are clients of the Runtime.

The Runtime executes declarative languages rather than application-specific logic.

The Runtime becomes the single execution environment for:

- Schema Language
- Query Language
- Pipeline Language
- Capability Model
- Plugin Runtime

Business applications do not define platform behavior.

They consume it.

---

# Rationale

This approach provides several advantages.

## Generic Platform

The Runtime understands concepts rather than applications.

It understands:

- Entities
- Schemas
- Relationships
- Capabilities
- Pipelines
- Queries

It does not understand:

- Articles
- Products
- Municipalities
- Customers

These concepts are defined through Schemas.

---

## Stable Core

The Runtime remains small and generic.

Industry-specific functionality belongs in:

- Plugins
- Schemas
- Pipelines
- Capabilities

This reduces long-term maintenance costs.

---

## Consistency

Every client uses the same Runtime.

Examples include:

- Studio
- REST APIs
- CLI
- AI Agents
- Mobile Applications
- Future Clients

Behavior remains consistent regardless of entry point.

---

## Declarative Platform

Instead of writing application code, developers describe intent.

Examples include:

- defining Schemas
- declaring Capabilities
- composing Pipelines
- writing Queries

The Runtime performs execution.

---

## AI Native

AI becomes another Runtime client.

AI never bypasses:

- permissions
- validation
- queries
- schemas

This keeps AI deterministic, secure and explainable.

---

# Consequences

The Runtime becomes the primary architectural boundary.

Studio is no longer considered the product.

Core implementation should always reinforce Runtime concepts.

Future architectural discussions should begin by asking:

> Does this belong in the Runtime?

If the answer is no, the feature probably belongs elsewhere.

---

# Alternatives Considered

## Traditional CMS Architecture

Rejected.

Reason:

Places presentation and editorial workflows at the center of the platform.

---

## Service-Oriented Backend

Rejected.

Reason:

Creates duplicated business logic across services and clients.

---

## Application-Centric Architecture

Rejected.

Reason:

Optimizes for current applications rather than future capabilities.

---

# Principles Established

This decision establishes several long-term principles.

- Runtime is the platform.
- Applications are clients.
- Entities are the primary data primitive.
- Schemas define structure.
- Capabilities define behavior.
- Pipelines define transformation.
- Queries define retrieval.
- Plugins define specialization.

---

# Related Documents

- VISION.md
- CONSTITUTION.md
- ARCHITECTURE.md
- RUNTIME.md
- DOMAIN_MODEL.md

---

# Future Impact

This ADR is expected to influence every architectural decision made within Aurii.

Future ADRs should be evaluated against this decision before being accepted.

If a proposal weakens the Runtime-first architecture, it should require strong justification.

---

# Summary

Aurii is not built around applications.

Aurii is built around a Runtime.

Everything else is layered on top.