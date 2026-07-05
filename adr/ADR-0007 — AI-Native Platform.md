ADR-0007 — AI-Native Platform

Status: Accepted
Date: 2026-07-04
Decision Makers: Aurii Project
Supersedes: None

⸻

Context

Artificial Intelligence is rapidly becoming a primary interface for interacting with software.

Most existing platforms have added AI as an external feature:

* AI writing assistants
* AI search
* AI tagging
* AI plugins
* AI chatbots

These capabilities are typically implemented outside the platform’s core architecture.

Aurii is being designed after the emergence of modern LLMs and AI agents.

Rather than treating AI as an optional feature, the platform should assume that AI will become one of its primary consumers.

⸻

Problem Statement

Adding AI as a layer on top of an existing platform creates several limitations:

* duplicated APIs
* inconsistent permissions
* fragmented context
* limited automation
* poor observability
* vendor lock-in
* brittle integrations

AI systems should not require privileged access or special platform behavior.

⸻

Decision

Aurii is an AI-native platform.

AI is considered a first-class consumer of Core, alongside Studio, SDKs, CLI tools and custom applications.

Core must expose everything required for AI through the same public interfaces used by every other client.

⸻

Principles

AI is a Client

AI agents are clients of Core.

They should authenticate, authorize and interact with the platform exactly like any other consumer.

AI does not receive hidden capabilities.

⸻

AI Consumes Schemas

Schemas provide structured context for AI.

Examples include:

* field names
* descriptions
* validation rules
* relationships
* allowed values
* document purpose

AI should derive understanding from schemas rather than reverse engineering documents.

⸻

AI Uses Public APIs

AI should interact through:

* REST APIs
* Query Language
* SDKs
* MCP
* future protocols

AI should never communicate directly with the database.

⸻

AI Respects Permissions

Permission evaluation is performed by Core.

AI must never access documents beyond the permissions of the authenticated identity it represents.

Authorization rules are identical for humans and machines.

⸻

AI Responsibilities

Aurii should support AI-assisted capabilities such as:

* document generation
* summarization
* metadata enrichment
* translation
* classification
* tagging
* relationship suggestions
* duplicate detection
* semantic search
* workflow automation

These are platform capabilities—not editor-specific features.

⸻

Model Independence

Aurii should remain independent of any individual AI provider.

Examples include:

* OpenAI
* Anthropic
* Google
* Mistral
* local models
* future providers

Model providers should be replaceable through adapters.

Core must never depend on proprietary APIs from a single vendor.

⸻

MCP Support

Aurii should expose capabilities through the Model Context Protocol (MCP) where appropriate.

Examples include:

* querying documents
* reading schemas
* creating content
* updating documents
* searching assets
* executing workflows

MCP is an integration mechanism—not a replacement for platform APIs.

⸻

Embeddings

Semantic representations should be treated as platform data.

Embeddings should support:

* multiple providers
* multiple models
* versioning
* regeneration
* metadata

Embeddings belong to documents but are not the documents themselves.

⸻

Retrieval

AI retrieval should prioritize:

* permission-aware access
* schema awareness
* semantic relevance
* structured responses
* deterministic query execution

Retrieval should be built upon the Query Language rather than bypassing it.

⸻

Automation

AI agents should be able to participate in workflows.

Examples include:

* approving content
* enriching metadata
* validating imports
* generating summaries
* creating translations
* suggesting relationships

Workflow execution remains governed by Core.

⸻

Observability

AI interactions should be observable.

Examples include:

* prompts
* responses
* execution time
* model selection
* token usage
* failures
* audit logs

Observability should support debugging, governance and cost management.

⸻

Human Oversight

Aurii should enable human review where appropriate.

Generated content should be traceable.

Applications may require approval before AI-generated changes become visible.

The platform should support both fully automated and human-in-the-loop workflows.

⸻

Non-goals

Aurii is not intended to:

* become an LLM provider
* train foundation models
* depend on a specific AI vendor
* replace workflow or editorial decision-making

Its role is to provide a secure, structured platform for AI-assisted operations.

⸻

Alternatives Considered

AI as a Plugin

Rejected.

AI would become fragmented and inconsistent across applications.

⸻

Vendor-specific Integration

Rejected.

The platform must remain independent of any individual AI ecosystem.

⸻

Separate AI APIs

Rejected.

AI should consume the same platform APIs as every other client.

⸻

Consequences

Positive

* Consistent AI integrations.
* Vendor independence.
* Better security.
* Unified permissions.
* Reusable AI capabilities.
* Future-proof architecture.
* Easier automation.

Negative

* Core APIs must be designed with AI consumers in mind.
* Additional infrastructure may be required for embeddings and inference.
* AI governance becomes part of the platform architecture.

⸻

Relationship to Other ADRs

This ADR builds upon:

* ADR-0001 — Platform Vision
* ADR-0002 — Core as the Content Lake
* ADR-0003 — Schema-First Architecture
* ADR-0004 — Query Language as a Platform Abstraction
* ADR-0005 — API-First Architecture
* ADR-0006 — Unified Data Model

AI consumes the same schemas, APIs and query language as every other client of Core.

⸻

Decision Summary

Aurii is designed as an AI-native platform.

AI is treated as a first-class client—not as a plugin or an afterthought.

All AI capabilities operate through Core, respect platform permissions, consume schemas, and remain independent of any specific model provider or vendor.