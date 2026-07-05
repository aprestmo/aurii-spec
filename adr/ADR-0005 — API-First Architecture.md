ADR-0005 — API-First Architecture

Status: Accepted
Date: 2026-07-04
Decision Makers: Aurii Project
Supersedes: None

⸻

Context

Many content platforms evolve around their graphical administration interface.

The API is often introduced later to expose selected functionality to external consumers.

This approach frequently leads to:

* hidden internal APIs
* duplicated business logic
* inconsistent behavior
* incomplete automation support
* limited integration capabilities

Aurii is intended to be a platform rather than a single application.

Every consumer—whether human or machine—must interact with the same platform capabilities.

⸻

Problem Statement

If Studio communicates with Core differently than other clients:

* automation becomes difficult
* SDKs become second-class citizens
* AI agents require special integrations
* APIs become inconsistent
* testing becomes more complex
* future clients become harder to build

The platform should expose one consistent interface for all consumers.

⸻

Decision

Aurii adopts an API-First Architecture.

Every platform capability must be implemented in Core and exposed through public APIs before it is consumed by Studio or any other client.

No client receives privileged functionality.

⸻

Principles

Core Owns the Business Logic

Core is responsible for:

* validation
* authorization
* permissions
* workflows
* document lifecycle
* schema enforcement
* querying
* versioning
* events

Clients are responsible only for presentation and user interaction.

⸻

One Platform API

All clients communicate with Core using supported APIs.

Examples include:

* Studio
* Astro applications
* Mobile applications
* CLI
* SDKs
* AI agents
* MCP servers
* Integration services

Every client should observe identical platform behavior.

⸻

No Private Endpoints

Private endpoints created exclusively for Studio are prohibited.

If functionality is required by Studio, it should be added to the public platform API.

This ensures:

* consistent behavior
* easier documentation
* simpler testing
* reusable integrations

⸻

Stable Contracts

Public APIs represent contracts between Core and its consumers.

Breaking changes should be avoided whenever practical.

When unavoidable, changes should be:

* documented
* versioned
* communicated clearly

⸻

API Design Principles

Platform APIs should be:

* predictable
* discoverable
* strongly typed
* schema-aware
* secure
* composable
* consistent

Behavior should be independent of the consuming client.

⸻

Authentication

Authentication is handled before business logic.

Supported mechanisms may include:

* OAuth 2.0
* OpenID Connect
* API Tokens
* Service Accounts
* Future machine identities

Authentication should remain independent of client implementation.

⸻

Authorization

Authorization is evaluated by Core.

Permissions should never be enforced solely by frontend applications.

Every request is validated using the authenticated identity and applicable permission model.

⸻

Versioning

APIs should evolve carefully.

Preferred approach:

* additive changes
* backward compatibility
* explicit deprecation
* predictable migration paths

Breaking changes should remain exceptional.

⸻

Errors

Platform errors should be:

* structured
* deterministic
* machine-readable
* human-readable

Clients should not depend on implementation-specific error messages.

⸻

Events

Every meaningful platform action should be capable of emitting events.

Examples include:

* document created
* document updated
* document deleted
* asset uploaded
* schema published
* workflow completed

These events enable:

* automation
* integrations
* webhooks
* future event-driven architectures

⸻

SDKs

Official SDKs should be thin wrappers around public APIs.

SDKs should never expose functionality unavailable through the platform itself.

This guarantees consistency across programming languages and environments.

⸻

AI Compatibility

AI systems should interact with Aurii exactly like any other client.

Examples include:

* querying documents
* creating content
* updating metadata
* executing workflows
* semantic search

No AI-specific backdoor APIs should exist.

⸻

Observability

Platform APIs should support:

* structured logging
* tracing
* metrics
* audit logging

Operational visibility should be built into Core rather than individual clients.

⸻

Non-goals

The API layer is not responsible for:

* frontend rendering
* editor layout
* presentation logic
* client state management
* application-specific business rules

These belong to consuming applications.

⸻

Alternatives Considered

Studio-first APIs

Rejected.

This approach creates hidden dependencies and reduces platform flexibility.

⸻

Separate Internal and External APIs

Rejected.

Maintaining parallel APIs increases complexity and encourages inconsistent behavior.

⸻

Client-side Business Logic

Rejected.

Business rules belong in Core to ensure consistency across all clients.

⸻

Consequences

Positive

* Consistent behavior across all clients.
* Simpler integrations.
* Better automation support.
* Easier testing.
* Stronger AI compatibility.
* Reduced duplication.
* Clear architectural boundaries.

Negative

* New UI features may require Core changes before implementation.
* Public API design requires greater discipline.
* API compatibility must be maintained over time.

⸻

Relationship to Other ADRs

This ADR builds upon:

* ADR-0001 — Platform Vision
* ADR-0002 — Core as the Content Lake
* ADR-0003 — Schema-First Architecture
* ADR-0004 — Query Language as a Platform Abstraction

The API is the public interface to Core and exposes its capabilities consistently to every client.

⸻

Decision Summary

Aurii is an API-first platform.

Core owns all business logic and exposes its capabilities through stable, public APIs.

Studio, SDKs, CLI tools, AI agents and future applications are equal consumers of these APIs, ensuring a consistent, extensible and maintainable platform architecture.