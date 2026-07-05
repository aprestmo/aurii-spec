ADR-0004 — Query Language as a Platform Abstraction

Status: Accepted
Date: 2026-07-04
Decision Makers: Aurii Project
Supersedes: None

⸻

Context

Aurii stores structured information in PostgreSQL.

While PostgreSQL provides a powerful query language (SQL), SQL is not the ideal interface for every consumer of the platform.

Different consumers have different needs:

* developers
* frontend applications
* AI agents
* CLI tools
* automation
* integrations
* Studio

Aurii should expose a consistent way to retrieve data without requiring every consumer to understand SQL or the underlying database implementation.

⸻

Problem Statement

Exposing SQL directly introduces several challenges:

* tight coupling to PostgreSQL
* difficult permission handling
* inconsistent APIs
* increased security risks
* poor developer experience for common queries
* unnecessary complexity for AI systems

Similarly, exposing REST endpoints for every possible query does not scale.

The platform requires a higher-level abstraction.

⸻

Decision

Aurii will implement its own query language.

The query language becomes the primary way to retrieve structured information from Core.

It acts as a platform abstraction between clients and the underlying database.

⸻

Goals

The query language should be:

* expressive
* composable
* deterministic
* type-aware
* schema-aware
* secure
* AI-friendly

It should prioritize readability over implementation details.

⸻

Design Principles

Schema-aware

The query language understands schemas.

Developers query document types and fields—not database tables.

Example:

from article
select title, slug, author.name
where published == true
order by publishedAt desc
limit 20

Clients should never need knowledge of SQL joins or internal table structures.

⸻

Storage-independent

Although the initial implementation targets PostgreSQL, the language should not expose PostgreSQL-specific concepts.

Future storage engines should be replaceable without changing client queries.

⸻

Read-first

The first version focuses on reading data.

Support includes:

* filtering
* sorting
* pagination
* projections
* references
* aggregations
* full-text search integration

Mutations remain separate platform operations.

⸻

Deterministic

A query should always produce predictable results.

Avoid hidden side effects.

Queries must never modify data.

⸻

Permission-aware

Permissions are evaluated by Core before query execution.

Clients only receive documents they are authorized to access.

Permission logic must never be delegated to the client.

⸻

AI-first Design

The language should be easy for AI systems to generate.

Queries should resemble natural language more than SQL.

The grammar should remain:

* predictable
* consistent
* concise

AI should not need detailed knowledge of database internals.

⸻

Relationship Traversal

Relationships are first-class concepts.

Example:

from article
select
  title,
  author.name,
  category.title,
  heroImage.url

Traversal should feel natural while remaining efficient.

⸻

Extensibility

The language should support future capabilities such as:

* semantic search
* vector similarity
* graph traversal
* faceting
* geospatial queries
* time-travel queries
* version queries
* computed fields

These features should extend the language rather than replace it.

⸻

API Integration

The query language should be available through:

* REST APIs
* SDKs
* CLI
* Studio
* AI agents
* MCP servers

Every client uses the same query capabilities.

⸻

Non-goals

The language is not intended to replace SQL as a database administration tool.

It should not expose:

* table names
* joins
* indexes
* transactions
* storage engine details
* execution plans

Those remain implementation details of Core.

⸻

Alternatives Considered

SQL

Rejected.

Powerful but too tightly coupled to PostgreSQL and unsuitable as the primary platform interface.

⸻

GraphQL

Rejected as the primary abstraction.

GraphQL solves transport concerns but does not define a platform-specific query model and introduces additional complexity around schemas and resolvers.

GraphQL may be supported in the future as an integration layer.

⸻

REST-only

Rejected.

An endpoint-per-query model does not scale and encourages API proliferation.

⸻

GROQ

Considered.

GROQ demonstrates many desirable characteristics:

* expressive
* projection-based
* relationship traversal
* readable

However, Aurii will design its own language tailored to its architecture rather than adopting GROQ directly.

⸻

Consequences

Positive

* Consistent querying across all clients.
* Reduced coupling to PostgreSQL.
* Better AI compatibility.
* Simpler client implementations.
* Centralized permission enforcement.
* Easier future platform evolution.

Negative

* Requires designing and maintaining a custom language.
* Developers must learn a new syntax.
* Query optimization becomes Core’s responsibility.

⸻

Relationship to Other ADRs

This ADR builds upon:

* ADR-0001 — Platform Vision
* ADR-0002 — Core as the Content Lake
* ADR-0003 — Schema-First Architecture

The query language depends on schemas and is executed exclusively by Core.

⸻

Decision Summary

Aurii will expose a platform-specific query language that is schema-aware, storage-independent and AI-friendly.

Clients interact with structured data through this abstraction rather than directly through SQL or an ever-growing collection of REST endpoints.

The query language is a core capability of the platform and a key part of Aurii’s long-term architecture.