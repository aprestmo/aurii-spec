ADR-0003 — Schema-First Architecture

Status: Accepted
Date: 2026-07-04
Decision Makers: Aurii Project
Supersedes: None

⸻

Context

Many platforms begin with database tables, ORM models or UI forms.

Schemas are often introduced later to describe existing models rather than defining them.

This creates multiple sources of truth:

* database schema
* API definitions
* validation logic
* frontend forms
* documentation
* AI prompts

These representations inevitably drift apart over time.

Aurii should instead have a single authoritative definition for every document type.

⸻

Problem Statement

When schemas are not the primary abstraction:

* validation becomes duplicated
* APIs become inconsistent
* UI becomes manually maintained
* documentation becomes outdated
* integrations become fragile
* AI lacks reliable structural context

As the platform grows, maintaining multiple representations becomes increasingly expensive.

⸻

Decision

Aurii adopts a Schema-First Architecture.

Every document type must be defined by a schema.

The schema is the canonical source of truth from which the platform derives behavior.

Schemas are not documentation.

Schemas are executable platform definitions.

⸻

Principles

Single Source of Truth

A schema defines:

* document identity
* fields
* field types
* validation
* relationships
* defaults
* constraints
* metadata

No other layer should redefine this information.

⸻

Runtime + Type Safety

Schemas should be usable:

* at runtime
* during validation
* by the API
* by Studio
* by AI
* during code generation

Whenever practical, TypeScript types should be derived from schemas rather than written manually.

⸻

Declarative

Schemas describe what a document is.

They should not describe how it is rendered.

Example:

defineType({
  name: "article",
  title: "Article",
  fields: [
    defineField({
      name: "title",
      type: "string",
      required: true,
    }),
  ],
})

Schemas remain declarative and platform-independent.

⸻

Responsibilities

Schemas should drive:

Validation

* required fields
* type validation
* custom rules
* constraints

⸻

API

Schemas inform:

* endpoints
* serialization
* filtering
* query validation

⸻

Studio

Studio generates:

* editors
* forms
* field layouts
* relationship pickers
* validation feedback

from schemas.

⸻

Documentation

Developer documentation should be generated from schemas whenever possible.

Manual documentation should complement schemas, not duplicate them.

⸻

AI

Schemas provide structured context for AI systems.

Examples:

* document structure
* field descriptions
* relationships
* allowed values
* validation rules

AI should never infer document structures from example data alone.

⸻

Schema Evolution

Schemas are expected to evolve.

Changes should support:

* versioning
* migrations
* backward compatibility where practical

Schema evolution should be explicit and traceable.

⸻

Relationships

Schemas define relationships explicitly.

Examples include:

* references
* collections
* parent-child structures
* bidirectional relationships
* future graph traversal

Relationships should never depend on UI implementation.

⸻

Extensibility

The schema system should support future additions such as:

* computed fields
* localized fields
* conditional validation
* permissions
* workflows
* indexing hints
* search metadata
* AI metadata
* presentation hints

without redesigning the core architecture.

⸻

Non-goals

Schemas should not contain:

* frontend layouts
* CSS
* page templates
* application-specific rendering
* business workflows
* deployment configuration

Those concerns belong elsewhere.

⸻

Alternatives Considered

Database-first

Rejected.

The database should implement schemas, not define them.

⸻

ORM-first

Rejected.

The ORM is an implementation detail.

Schemas must remain independent of any specific ORM.

⸻

UI-first

Rejected.

Forms and editors are consumers of schemas, not their source.

⸻

Consequences

Positive

* One authoritative definition.
* Less duplicated logic.
* Consistent APIs.
* Easier code generation.
* Better AI understanding.
* Simpler Studio implementation.
* Easier migrations.
* Stronger type safety.

Negative

* The schema system becomes a critical platform component.
* Initial implementation requires more planning.
* Changes to schemas must be carefully versioned.

⸻

Implementation Principles

When introducing new functionality, contributors should ask:

1. Can this be expressed in the schema?
2. Can Studio generate this automatically?
3. Can the API derive this behavior?
4. Can AI understand this without additional configuration?
5. Does this avoid introducing a second source of truth?

If not, reconsider the design.

⸻

Relationship to Other ADRs

This ADR builds upon:

* ADR-0001 — Platform Vision
* ADR-0002 — Core as the Content Lake

Future ADRs covering Query, Search, AI, Assets and Studio assume that schemas are the canonical representation of every document type.

⸻

Decision Summary

Schemas are the foundation of Aurii.

They define structure, validation and relationships, and act as the single source of truth for the platform.

Core, Studio, APIs, SDKs and AI systems should all derive their behavior from schemas rather than maintaining independent representations.