ADR-0008 — Self-Hosted First Architecture

Status: Accepted
Date: 2026-07-04
Decision Makers: Aurii Project
Supersedes: None

⸻

Context

Many modern developer platforms begin as cloud services.

Self-hosting is often introduced later as an enterprise feature or omitted entirely.

This approach creates several limitations:

* vendor lock-in
* regulatory challenges
* limited deployment flexibility
* dependence on proprietary infrastructure
* unpredictable operating costs

Aurii is intended to serve organizations ranging from individuals and startups to enterprises, media companies and public institutions.

Many of these require complete control over where their data is stored and processed.

⸻

Problem Statement

If Aurii is designed primarily as a cloud platform:

* architecture becomes tightly coupled to cloud providers
* deployment assumptions become difficult to change
* self-hosting becomes a secondary experience
* integrations may depend on proprietary services
* regulatory compliance becomes harder

Aurii should instead assume that every installation owns and operates its own infrastructure.

Cloud offerings should be built on the same architecture—not require a different one.

⸻

Decision

Aurii adopts a Self-Hosted First architecture.

The reference implementation of the platform is a fully self-hosted deployment.

Every core capability must function without requiring Aurii-operated cloud services.

⸻

Principles

Platform Independence

Aurii should run on infrastructure owned by the customer.

Examples include:

* local development
* virtual machines
* Docker
* Kubernetes
* on-premises servers
* private cloud
* public cloud

Deployment target should not affect platform capabilities.

⸻

No Mandatory SaaS

Core functionality must never depend on:

* proprietary APIs
* hosted authentication
* hosted storage
* hosted search
* hosted AI services

Cloud services may be supported through adapters but must remain optional.

⸻

Open Infrastructure

Aurii should prefer open technologies whenever practical.

Current architectural direction includes:

* PostgreSQL
* Docker
* OCI containers
* S3-compatible storage
* OpenID Connect
* OAuth 2.0

The platform should avoid unnecessary dependence on proprietary ecosystems.

⸻

Deployment Simplicity

A production installation should require as few services as practical.

The minimum deployment should remain understandable and maintainable.

Example deployment:

Aurii Core
PostgreSQL
Object Storage (optional)
Reverse Proxy

Additional capabilities should be additive rather than mandatory.

⸻

European Data Residency

Aurii should support organizations with strict regulatory requirements.

Examples include:

* GDPR
* public sector
* healthcare
* finance
* media organizations

The platform should make it straightforward to ensure that all data remains within the customer’s chosen jurisdiction.

Aurii itself should not require external processing of customer data.

⸻

Cloud Strategy

A managed Aurii Cloud may exist in the future.

However:

* Cloud uses the same Core.
* Cloud exposes the same APIs.
* Cloud supports the same schemas.
* Cloud should not provide exclusive platform capabilities.

The managed service is a deployment model—not a different product.

⸻

Storage Providers

Object storage should be provider-independent.

Supported providers may include:

* local filesystem
* MinIO
* Amazon S3
* Cloudflare R2
* Backblaze B2
* other S3-compatible services

Storage selection should be configuration, not architecture.

⸻

Authentication Providers

Authentication should remain replaceable.

Examples include:

* OpenID Connect
* Microsoft Entra ID
* Authentik
* Keycloak
* Auth0
* Google Workspace
* GitHub
* local authentication (optional)

No provider should become mandatory.

⸻

AI Providers

AI integrations should follow the same philosophy.

Supported providers may include:

* OpenAI
* Anthropic
* Google
* Mistral
* Ollama
* local inference servers

Switching providers should not require application changes.

⸻

Operational Philosophy

Aurii should be operable by a small engineering team.

Operational complexity should remain proportional to deployment size.

Default deployments should favor:

* observability
* reliability
* maintainability
* straightforward upgrades
* backup and restore

⸻

Non-goals

Aurii is not intended to:

* become dependent on a proprietary cloud platform
* require internet connectivity for core functionality
* require vendor-managed infrastructure
* optimize exclusively for hyperscale cloud deployments

Cloud-native deployment remains supported, but not mandatory.

⸻

Alternatives Considered

Cloud-First

Rejected.

This introduces unnecessary vendor dependence and weakens the self-hosting experience.

⸻

Separate Self-Hosted Edition

Rejected.

Maintaining multiple platform editions increases engineering cost and fragments the ecosystem.

⸻

Enterprise-only Self Hosting

Rejected.

Self-hosting is a core design principle, not a premium feature.

⸻

Consequences

Positive

* Complete customer ownership.
* Easier regulatory compliance.
* No vendor lock-in.
* Greater deployment flexibility.
* Long-term platform independence.
* Consistent architecture across deployments.

Negative

* Some cloud conveniences must be implemented by operators.
* Deployment documentation becomes an important part of the project.
* Managed services may require additional operational tooling.

⸻

Relationship to Other ADRs

This ADR builds upon:

* ADR-0001 — Platform Vision
* ADR-0002 — Core as the Content Lake
* ADR-0003 — Schema-First Architecture
* ADR-0004 — Query Language as a Platform Abstraction
* ADR-0005 — API-First Architecture
* ADR-0006 — Unified Data Model
* ADR-0007 — AI-Native Platform

Self-hosting is a deployment characteristic of the same platform described in the previous ADRs, not an alternative implementation.

⸻

Decision Summary

Aurii is designed as a self-hosted-first platform.

Every core capability must function independently of Aurii-operated cloud services.

A future managed cloud offering should be built from the same Core, expose the same APIs and follow the same architectural principles as every self-hosted deployment.