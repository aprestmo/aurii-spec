ADR-0001 — Platform Vision

Status: Accepted
Date: 2026-07-04
Decision Makers: Aurii Project
Supersedes: None

⸻

Context

Most existing content platforms are designed around one specific domain.

Examples include:

* CMS platforms
* Headless CMS platforms
* DAM systems
* Product Information Management (PIM)
* Documentation platforms
* Internal knowledge bases

While these products often expose APIs, their internal architecture is still centered around their original use case.

Aurii takes a different approach.

The goal is not to build another CMS.

The goal is to build a general-purpose platform for structured information.

⸻

Problem Statement

Organizations increasingly manage many different categories of structured information:

* Editorial content
* Products
* Customer data
* Assets
* Government datasets
* Statistics
* Geospatial information
* Event data
* Internal documentation
* AI knowledge
* Metadata
* Print production data

These datasets are typically stored in separate systems, resulting in:

* duplicated information
* inconsistent APIs
* fragmented permissions
* multiple search implementations
* duplicated business logic
* difficult integrations

Traditional CMS architectures are not designed to become the central platform for all structured organizational data.

⸻

Decision

Aurii will be developed as a Content & Data Platform rather than a Headless CMS.

The platform will provide a common foundation for storing, validating, querying, securing and exposing structured data, regardless of domain.

Content is treated as one category of structured data—not the primary abstraction.

The platform itself must remain domain-agnostic.

⸻

Vision

Aurii should become the single source of truth for structured information within an organization.

Examples include:

* articles
* pages
* products
* media assets
* customer records
* tax datasets
* statistical datasets
* logistics data
* elections
* geospatial information
* AI embeddings
* internal documentation
* configuration
* workflow metadata

Every dataset should be managed using the same architectural principles.

⸻

Core Principles

Aurii is founded on the following principles:

Everything is structured data

The platform does not distinguish between “content” and “data.”

Both are documents governed by schemas.

⸻

API-first

Every capability exposed through graphical interfaces must also be available through public APIs.

No hidden internal functionality should exist exclusively for Studio.

⸻

Schema-first

Schemas define:

* data validation
* editing capabilities
* relationships
* documentation
* API behaviour
* AI context

Applications derive behavior from schemas rather than hardcoded models.

⸻

Self-hosted first

Aurii must always function as a fully self-hosted platform.

Cloud offerings may exist in the future but must never become a requirement.

⸻

AI-native

Artificial Intelligence is considered a core platform capability.

AI should consume the same APIs as human users.

No separate “AI mode” should exist.

⸻

Extensible by design

Every subsystem should be replaceable or extendable without redesigning the platform.

Examples include:

* authentication providers
* storage providers
* search engines
* asset backends
* deployment targets

⸻

Non-goals

Aurii is not intended to become:

* a page builder
* a website builder
* a low-code platform
* a visual app builder
* a monolithic publishing suite

Such capabilities may be built on top of Aurii but should not define its architecture.

⸻

Success Criteria

Aurii should eventually support use cases such as:

* Headless CMS
* Editorial publishing
* Documentation platforms
* Product Information Management
* Digital Asset Management
* Internal knowledge systems
* Public open-data portals
* Government datasets
* AI knowledge bases
* Analytics metadata
* Print publishing workflows

without requiring different architectural foundations.

⸻

Consequences

Positive

* One platform can support many domains.
* APIs remain consistent across projects.
* Data becomes easier to integrate.
* AI gains access to a unified data model.
* Organizations reduce duplicated infrastructure.
* New products can be developed on the same foundation.

Negative

* Initial architecture becomes more complex than a traditional CMS.
* Product scope must be carefully managed.
* Generality may delay highly specialized features.
* Strong architectural discipline is required to avoid domain-specific shortcuts.

⸻

Alternatives Considered

Build a Headless CMS

Rejected.

This would optimize the platform around editorial workflows and limit its applicability to broader structured data use cases.

⸻

Build separate products for each domain

Rejected.

Separate systems increase maintenance costs, duplicate infrastructure, and complicate integrations.

⸻

Build a Backend-as-a-Service

Rejected.

Aurii is not intended to replace application backends.

Its responsibility is the management, validation, querying and distribution of structured information.

⸻

Decision Summary

Aurii is a Content & Data Platform.

Content is only one category of structured data.

All architectural decisions should reinforce this principle.

Whenever uncertainty arises, implementations should favor solutions that strengthen Aurii as a general-purpose platform rather than as a specialized CMS.