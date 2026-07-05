ADR-0006 — Unified Data Model

Status: Accepted
Date: 2026-07-04
Decision Makers: Aurii Project
Supersedes: None

⸻

Context

Most platforms distinguish between different categories of information.

Examples include:

* content
* products
* users
* assets
* settings
* taxonomies
* metadata

These categories are often implemented using separate subsystems with different APIs, storage models and permission systems.

As platforms grow, these distinctions introduce unnecessary complexity.

Aurii should instead provide a single conceptual model for structured information.

⸻

Problem Statement

Treating different types of information as fundamentally different entities results in:

* duplicated infrastructure
* inconsistent APIs
* multiple permission models
* fragmented search capabilities
* duplicated validation
* difficult integrations
* higher maintenance costs

There is little technical justification for treating an article differently from a product or a tax record when both are structured documents governed by schemas.

⸻

Decision

Aurii adopts a Unified Data Model.

Every piece of structured information is represented as a document.

A document is defined by a schema and managed through the same platform capabilities regardless of its domain.

The platform does not distinguish between “content” and “data.”

⸻

Definition of a Document

A document is a structured object that:

* has an identifier
* belongs to a schema
* contains fields
* supports validation
* may reference other documents
* supports versioning
* participates in permissions
* can be queried
* can be indexed
* can emit events

Every document follows the same lifecycle.

⸻

Examples

The following are all documents:

* article
* page
* product
* company
* person
* municipality
* postal code
* election result
* tax record
* media asset
* workflow
* API key
* AI embedding metadata

The platform treats them consistently.

⸻

Relationships

Relationships are independent of document type.

Examples include:

Article
 ├── Author (Person)
 ├── Hero Image (Asset)
 ├── Category
 └── Municipality
Company
 ├── Address
 ├── Municipality
 ├── Industry
 └── Owners
Municipality
 ├── County
 ├── Postal Codes
 ├── Statistics
 └── Election Results

All relationships are expressed through schemas rather than special-purpose implementations.

⸻

Cross-Domain Data

One of Aurii’s primary goals is enabling relationships across domains.

Examples include:

An article may reference:

* a municipality
* a company
* election statistics
* geospatial data
* media assets

A company may reference:

* tax information
* postal codes
* ownership records
* statistical classifications

No additional integration layer should be required.

⸻

Consistent Platform Services

Every document should support the same platform capabilities where applicable:

* CRUD operations
* validation
* version history
* permissions
* search
* references
* events
* workflows
* AI enrichment
* indexing
* auditing

Features should not depend on document type.

⸻

Schema Independence

Behavior should originate from schemas rather than hardcoded classes.

Adding a new document type should require defining a schema—not modifying platform logic.

Core should not contain special handling for:

* articles
* products
* pages
* companies

These concepts belong to applications, not the platform.

⸻

Metadata

Platform metadata should remain consistent across all documents.

Examples include:

* id
* schema
* revision
* createdAt
* updatedAt
* createdBy
* updatedBy
* status
* permissions

Applications may extend metadata, but Core defines the common foundation.

⸻

Search

Search operates on documents rather than specialized repositories.

The search engine should not need to know whether a document represents:

* content
* products
* datasets
* configuration

Only schemas determine searchable fields.

⸻

AI

AI should interact with documents through a common model.

This enables:

* generic assistants
* reusable prompts
* consistent retrieval
* semantic search
* document generation
* metadata enrichment

AI systems should not require document-specific implementations for common tasks.

⸻

Non-goals

The Unified Data Model does not imply that every application behaves identically.

Applications remain free to:

* present documents differently
* implement domain-specific workflows
* apply custom business rules
* create specialized user experiences

The platform provides the foundation, not the application behavior.

⸻

Alternatives Considered

Separate models for each domain

Rejected.

This duplicates infrastructure and reduces interoperability.

⸻

CMS-centric model

Rejected.

Optimizing around editorial content limits the platform’s usefulness for other structured datasets.

⸻

Database table per feature

Rejected.

Storage implementation should not define the platform architecture.

⸻

Consequences

Positive

* Consistent APIs.
* Unified permissions.
* Reusable platform capabilities.
* Simpler integrations.
* Cross-domain relationships.
* Better AI interoperability.
* Easier platform evolution.

Negative

* Domain-specific features must be implemented outside Core.
* Platform abstractions require careful design.
* Contributors must resist introducing special-case behavior.

⸻

Relationship to Other ADRs

This ADR builds upon:

* ADR-0001 — Platform Vision
* ADR-0002 — Core as the Content Lake
* ADR-0003 — Schema-First Architecture
* ADR-0004 — Query Language as a Platform Abstraction
* ADR-0005 — API-First Architecture

The Unified Data Model is the conceptual foundation upon which all platform services operate.

⸻

Decision Summary

Aurii represents all structured information as documents governed by schemas.

The platform does not distinguish between content, products, datasets or other domain concepts.

Every document participates in the same lifecycle, APIs, permissions, search and AI capabilities, allowing Aurii to function as a true Content & Data Platform rather than a traditional CMS.