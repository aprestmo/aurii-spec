# AI

> Artificial Intelligence is a native capability of Aurii.
>
> AI is not a feature.
> AI is not an assistant.
> AI is an execution layer that helps users and applications understand, create and transform structured knowledge.
>
> AI never replaces the Runtime.
>
> AI augments the Runtime.

---

# Purpose

Modern software should not merely store information.

It should understand it.

Aurii integrates AI directly into the platform so that every Entity, Schema, Query and Pipeline can benefit from intelligent assistance.

The purpose of AI is to reduce complexity for humans without sacrificing transparency or control.

---

# Philosophy

AI should never become another application inside Aurii.

Instead, AI should be available everywhere.

Examples:

- while defining Schemas
- while importing data
- while writing Queries
- while building Pipelines
- while editing Entities
- while searching
- while generating documentation
- while building APIs

AI should feel like part of the platform.

Not a separate product.

---

# AI Principles

Every AI capability must follow five principles.

## Assist

AI assists.

Humans decide.

---

## Explain

AI explains why it reached a conclusion.

Reasoning should be inspectable whenever practical.

---

## Review

Users can review every meaningful suggestion.

Nothing important should happen silently.

---

## Learn

AI should learn from the project's Schemas and knowledge model.

Not from hidden implementation details.

---

## Respect Permissions

AI should never gain access to information that the requesting user cannot access.

Permission checks always happen before AI receives context.

---

# AI Is A Consumer Of Runtime

AI never bypasses Core.

Instead:

```
User

↓

AI

↓

Runtime

↓

Query Language

↓

Entities

↓

Result
```

The Runtime remains authoritative.

---

# Knowledge

AI reasons about knowledge.

Knowledge consists of:

- Entities
- Schemas
- Relationships
- Metadata
- History
- Capabilities

This gives AI a structured understanding of the platform.

---

# AI Context

Context should come from the platform itself.

Examples include:

- Schema descriptions
- Field documentation
- Entity relationships
- Capability definitions
- Query history
- Project documentation

Developers should not manually recreate context that already exists in Aurii.

---

# AI Capabilities

Examples include:

## Schema Design

AI may:

- propose Schemas
- suggest field types
- detect relationships
- identify validation rules

---

## Entity Creation

AI may:

- extract structured information
- classify content
- populate metadata
- generate summaries
- suggest tags

---

## Import Assistance

AI may:

- detect formats
- infer mappings
- recognize duplicate data
- identify encoding problems
- recommend transformations

---

## Query Assistance

Users should be able to ask:

> Show every municipality with declining population since 2020.

AI converts intent into Query Language.

---

## Pipeline Assistance

AI may:

- suggest workflow steps
- optimize Pipelines
- detect unnecessary transformations
- recommend reusable components

---

## Documentation

AI should generate:

- documentation
- examples
- migration guides
- API descriptions

Documentation should remain editable by humans.

---

## Search

AI complements traditional search.

Instead of keyword matching only,

users should also search semantically.

Example:

> Find municipalities similar to Oslo in population growth.

---

# AI Providers

Aurii should never depend on a single AI vendor.

Providers should be pluggable.

Examples:

- OpenAI
- Anthropic
- Google Gemini
- Mistral
- Ollama
- Local models

The Runtime communicates through provider interfaces.

---

# Models

Different tasks require different models.

Examples:

- reasoning
- summarization
- embeddings
- translation
- OCR
- speech recognition

The Runtime chooses or allows configuration.

Applications should not depend on model names.

---

# Embeddings

Embeddings are derived data.

They are never the canonical representation.

Canonical knowledge always remains:

- Entities
- Schemas
- Relationships

Embeddings may be regenerated at any time.

---

# Retrieval

AI should retrieve context through Query Language.

Never by scanning the database directly.

Benefits include:

- permissions
- consistency
- version awareness
- structured knowledge

---

# Agents

Agents are specialized consumers of Runtime.

Examples:

- Documentation Agent
- Import Agent
- Schema Agent
- Migration Agent
- QA Agent
- Editorial Agent

Agents differ by responsibilities.

Not by architecture.

---

# MCP

Aurii should integrate naturally with the Model Context Protocol (MCP).

Aurii may expose:

- Query tools
- Entity tools
- Schema tools
- Import tools
- Pipeline tools

Aurii may also consume external MCP servers.

Examples:

- GitHub
- PostgreSQL
- Penpot
- Figma
- Slack

MCP should become the preferred integration model for AI.

---

# Memory

AI should distinguish between:

- project knowledge
- user context
- conversation history
- platform knowledge

These are different concerns.

They should not be mixed implicitly.

---

# Human Approval

Operations that modify the platform should require approval unless explicitly configured otherwise.

Examples:

- Schema changes
- Entity deletion
- Imports
- Pipeline execution
- Publishing

AI may prepare.

Humans approve.

---

# Observability

Every AI operation should record:

- provider
- model
- prompt
- retrieved context
- execution time
- cost
- output

Projects should understand how AI reaches conclusions.

---

# Security

AI inherits Runtime permissions.

AI never receives:

- hidden Entities
- private Schemas
- restricted Assets

Security always precedes intelligence.

---

# Future

The long-term vision is not an AI chatbot.

The vision is an AI-native platform.

Every capability of Aurii should be understandable, discoverable and executable through AI.

Eventually, developers should be able to build complete applications by describing intent rather than implementation.

The Runtime remains deterministic.

AI becomes the interface.

---

# Guiding Principle

AI should increase understanding.

Never reduce transparency.

If users trust the Runtime,

they should also trust every AI capability built upon it.