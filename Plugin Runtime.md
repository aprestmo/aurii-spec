# Plugin Runtime

> Plugins extend Aurii.
>
> Core provides the platform.
>
> Plugins provide specialization.

---

# Purpose

Aurii should never attempt to solve every problem inside Core.

Instead, Core should provide a stable runtime that plugins can extend.

The goal is simple:

Core remains small.

The platform becomes powerful.

---

# Philosophy

Core should contain only generic functionality.

Anything that is:

- domain specific
- organization specific
- industry specific
- experimental

should preferably exist as a plugin.

Plugins are not second-class citizens.

They are part of the platform architecture.

---

# Core Owns The Runtime

Plugins never replace Core.

Core owns:

- Entity lifecycle
- Schema execution
- Query execution
- Pipeline execution
- Security
- Transactions
- Events

Plugins extend behavior.

They do not redefine Core.

---

# Plugins Are Resources

Every plugin is itself an Entity.

A plugin contains:

- identity
- version
- author
- permissions
- dependencies
- documentation
- capabilities
- configuration

Plugins become discoverable resources.

---

# Extension Points

Core exposes extension points.

Plugins register themselves.

```
Core

↓

Extension Point

↓

Plugin

↓

Capability
```

Core never knows which plugins exist.

---

# Plugin Lifecycle

```
Install

↓

Validate

↓

Register

↓

Initialize

↓

Execute

↓

Update

↓

Disable

↓

Uninstall
```

Every step should be observable.

---

# Plugin Categories

Plugins may contribute different capabilities.

---

## Field Types

Examples:

- Money
- Color
- Markdown
- Rich Text
- Geolocation
- Measurement
- AI Prompt
- JSON Schema

Field types become available in Schema Language.

---

## Capabilities

Examples:

- Publishing
- Workflow
- Localization
- Comments
- Digital Signatures
- Scheduling
- Retention

Schemas simply declare them.

Core executes them through plugins.

---

## Pipeline Steps

Plugins may add new Pipeline Steps.

Examples:

- Translate
- OCR
- Face Detection
- SAP Export
- AI Classification

No changes to Core required.

---

## Query Functions

Plugins may extend Query Language.

Examples:

```
distance()

semanticSearch()

containsAny()

geoWithin()
```

Query Language evolves without changing Core.

---

## Import Sources

Plugins may introduce new importers.

Examples:

- Salesforce
- HubSpot
- Notion
- Shopify
- Airtable

The Import Engine discovers them automatically.

---

## Connectors

Plugins may provide external integrations.

Examples:

- Slack
- Teams
- Discord
- Azure
- AWS
- Stripe

Connectors become reusable resources.

---

## Asset Processors

Plugins may process assets.

Examples:

- Image Optimization
- Video Transcoding
- Audio Analysis
- OCR
- Thumbnail Generation

Assets remain generic.

Plugins provide behavior.

---

## AI Providers

AI should be pluggable.

Examples:

- OpenAI
- Anthropic
- Gemini
- Mistral
- Local LLMs

Core should depend on AI capabilities.

Never on specific vendors.

---

## Studio Extensions

Plugins may extend Studio.

Examples:

- custom editors
- dashboards
- inspector panels
- sidebar tools
- widgets

Studio discovers extensions dynamically.

---

# Plugin Manifest

Every plugin declares itself.

Example:

```yaml
id: ai-openai

version: 1.0.0

provides:

- ai-provider

- summarize

- embeddings

requires:

- ai-runtime

permissions:

- outbound-http
```

The manifest is declarative.

---

# Dependency Management

Plugins may depend on:

- Core versions
- Capabilities
- Other plugins

Dependencies should be explicit.

Circular dependencies should be rejected.

---

# Isolation

Plugins execute inside controlled boundaries.

They should not access internal Core state directly.

Interaction happens through stable interfaces.

This protects platform stability.

---

# Permissions

Plugins should request permissions.

Examples:

- filesystem
- outbound http
- storage
- secrets
- AI providers

Projects decide what plugins may access.

---

# Configuration

Configuration belongs to plugins.

Core stores configuration.

Core does not interpret it.

Plugins own their own settings.

---

# Versioning

Plugins evolve independently.

Projects choose when to upgrade.

Breaking changes should never happen silently.

---

# Distribution

Plugins should be installable from multiple sources.

Examples:

- Local directory
- Git repository
- Organization registry
- Official marketplace
- Private marketplace

The distribution mechanism should remain open.

---

# Marketplace

Aurii may provide a plugin marketplace.

The marketplace is not required for the platform.

Organizations should always be able to install plugins manually.

No vendor lock-in.

---

# Discovery

Core maintains a Plugin Registry.

The registry answers questions like:

- Which plugins are installed?
- Which capabilities exist?
- Which field types are available?
- Which Pipeline Steps are registered?
- Which AI providers are configured?

Everything becomes discoverable.

---

# Events

Plugins may publish and consume Events.

Example:

```
Entity Published

↓

Plugin

↓

Generate PDF

↓

Publish Event
```

Plugins integrate through events instead of direct dependencies.

---

# Failure Handling

A plugin should never compromise Core.

Plugin failures should:

- be isolated
- be logged
- expose diagnostics
- avoid corrupting data

Core remains stable.

---

# Why Plugin Runtime Exists

Without plugins:

Core grows forever.

Every feature becomes permanent.

Every organization requests custom functionality.

Eventually the platform becomes impossible to maintain.

With Plugin Runtime:

Core stays generic.

Organizations extend the platform.

Innovation happens outside Core.

Everyone benefits.

---

# Guiding Principle

Before adding functionality to Core, ask:

> Can this be implemented as a plugin?

If the answer is yes,

it probably should be.

Core should become smaller over time.

Plugins should become more powerful over time.