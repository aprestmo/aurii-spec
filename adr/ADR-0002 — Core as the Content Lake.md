ADR-0002 — Core as the Content Lake

Status: Accepted
Date: 2026-07-04
Decision Makers: Aurii Project
Supersedes: None

⸻

Context

Traditional content platforms often evolve around a graphical editor.

The editor becomes the primary product, while the underlying storage layer is tightly coupled to its implementation.

This makes it difficult to:

* build alternative clients
* automate workflows
* expose complete APIs
* support non-editorial datasets
* integrate AI agents
* support future products

Throughout the design of Aurii, it became clear that the platform’s greatest long-term value is not the editor—it is the underlying data platform.

⸻

Problem Statement

If the platform is designed around Studio, every architectural decision becomes biased toward interactive editing.

This introduces unnecessary coupling between:

* storage
* APIs
* user interfaces
* workflows
* permissions
* integrations

It also limits the platform’s usefulness for applications that do not require a graphical editor.

Many use cases only require:

* storing data
* querying data
* importing datasets
* exposing APIs
* AI interaction
* automation

These should not depend on Studio.

⸻

Decision

Aurii Core is the platform.

Studio is an optional client.

Every capability required by Studio must originate in Core.

Core must remain fully usable without any graphical interface.

⸻

Responsibilities of Core

Core is responsible for:

* storing structured documents
* managing schemas
* validating data
* document versioning
* relationships
* permissions
* authentication integration
* indexing
* querying
* event generation
* APIs
* AI integration
* asset references
* transactions

Core owns all business logic.

⸻

Responsibilities of Studio

Studio is responsible for:

* editing documents
* browsing datasets
* managing schemas
* viewing revisions
* workflow interaction
* asset management
* administration

Studio owns presentation, not business logic.

⸻

Architectural Principle

The relationship can be expressed as:

             Applications
 Astro     Mobile     CLI     Studio     AI Agents
                │
                ▼
          Public APIs
                │
                ▼
             Aurii Core
                │
                ▼
          PostgreSQL

Every client communicates with Core using supported APIs.

No client has privileged access.

⸻

API Rule

Studio must never access the database directly.

Studio must never bypass validation.

Studio must never implement business logic independently.

Every operation performed in Studio should be reproducible through the public API.

⸻

Benefits

This separation enables:

* custom administration interfaces
* command-line tooling
* automation
* server-to-server integrations
* AI agents
* mobile applications
* third-party SDKs
* future desktop applications

without changing Core.

⸻

Data Import

Large datasets should be imported directly into Core.

Examples include:

* government datasets
* statistical data
* product catalogs
* tax records
* logistics data

Imports should not require Studio.

Studio may expose import functionality, but Core performs the actual work.

⸻

AI Integration

AI agents communicate with Core using the same APIs as any other client.

Examples include:

* asking questions
* generating documents
* enriching metadata
* classifying content
* semantic search
* workflow automation

AI should never receive privileged internal access.

⸻

Extensibility

Because Core is independent, multiple clients may coexist.

Examples include:

* Aurii Studio
* Custom editorial tools
* Internal administration panels
* Astro applications
* Mobile apps
* CLI utilities
* MCP servers
* Future desktop software

Core should not require changes to support new clients.

⸻

Non-goals

Core is not responsible for:

* page layouts
* visual editing
* frontend rendering
* component libraries
* application-specific business logic
* website generation

Those responsibilities belong to applications built on top of Core.

⸻

Alternatives Considered

Studio as the primary product

Rejected.

This would encourage coupling between UI and platform logic and reduce long-term flexibility.

⸻

Separate APIs for Studio

Rejected.

Maintaining private APIs would duplicate functionality and weaken the API-first philosophy.

⸻

Embed Core inside Studio

Rejected.

Core should remain independently deployable and usable in environments where no graphical interface exists.

⸻

Consequences

Positive

* Clear separation of concerns.
* Easier testing.
* Easier automation.
* Consistent APIs.
* Better AI support.
* Better scalability.
* Simpler integrations.
* Independent evolution of clients.

Negative

* Requires stronger API discipline.
* Some features may take longer because they must first exist in Core.
* Studio development depends on Core capabilities.

⸻

Implementation Principles

When implementing new functionality, contributors should ask:

1. Does this belong in Core?
2. Can another client reuse this?
3. Can this be exposed through the public API?
4. Would an AI agent use the same implementation?
5. Is Studio merely consuming existing functionality?

If the answer to any of these questions is “no”, the implementation should be reconsidered.

⸻

Decision Summary

Aurii Core is the platform.

Studio is only one possible client.

All business logic, validation, storage, querying and platform capabilities originate in Core.

Every future application—including Studio, CLI tools, AI agents and custom frontends—must build upon the same foundation.