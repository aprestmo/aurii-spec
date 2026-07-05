# Aurii

> A composable content and data platform built for the next generation of applications.

---

## What is Aurii?

Aurii is a schema-first, API-first and AI-first platform for storing, managing, enriching and delivering structured content and data.

Aurii is **not** a traditional CMS.

It is a platform for building systems that happen to manage content.

At its core, Aurii provides a flexible Content Lake capable of powering everything from websites and newsrooms to public datasets, internal business systems, documentation platforms, APIs, AI applications and print workflows.

The goal is simple:

> Store data once. Use it everywhere.

---

# Vision

Modern organizations manage much more than pages and articles.

They manage products, customers, maps, media assets, datasets, taxonomies, events, AI-generated content, analytics, structured documents and countless integrations.

Traditional CMS platforms were designed around publishing web pages.

Aurii is designed around managing information.

Everything is modeled as data.

Everything is queryable.

Everything is reusable.

---

# Philosophy

Aurii is built around a few fundamental principles.

## Schema First

Every dataset begins with a schema.

Schemas define:

- structure
- validation
- relationships
- permissions
- editing capabilities
- APIs
- search
- AI understanding

Schemas are the foundation of the platform.

---

## API First

Everything inside Aurii is available through APIs.

The Studio itself communicates with Core exclusively through public APIs.

If something cannot be accessed through an API, it probably does not belong inside Core.

---

## AI First

Artificial Intelligence is not an add-on.

AI is part of the platform.

AI should assist with:

- schema creation
- data modeling
- validation
- import
- search
- transformation
- enrichment
- automation

The human always remains in control.

---

## Data Before Presentation

Content should never depend on a frontend.

Instead:

```
Data

↓

API

↓

Frontend
```

A website is simply one consumer.

A mobile app is another.

A print workflow is another.

An AI agent is another.

---

## Composable

Aurii is built as independent engines.

Every subsystem should be replaceable.

Every feature should be reusable.

Avoid tightly coupled functionality.

---

## Open by Design

Aurii should embrace open standards whenever possible.

Examples include:

- JSON
- OpenAPI
- OAuth
- OpenID Connect
- S3
- PostgreSQL
- Markdown
- GraphQL (optional)
- RSS
- XML

Vendor lock-in should never be required.

---

# What can Aurii build?

Aurii should be capable of powering systems such as:

- Headless CMS
- News publishing
- Documentation platforms
- Public data portals
- Internal business systems
- Customer portals
- Product catalogs
- AI knowledge bases
- Geographic information systems
- Print production
- Digital archives
- Media asset management
- Event systems
- Live coverage
- Public APIs

All using the same Core.

---

# Core Architecture

Aurii is composed of several independent engines.

```
                    Studio

                      │

        ┌─────────────┴─────────────┐

        │                           │

      REST                      Query API

        │                           │

        └─────────────┬─────────────┘

                      │

                    Core

──────────────────────────────────────────

Schemas

Datasets

Documents

Assets

Imports

Connectors

Pipelines

Search

Events

Permissions

AI

──────────────────────────────────────────

                PostgreSQL
```

Core is the product.

Studio is one client.

---

# Technology

The initial implementation uses:

Frontend

- Astro

Backend

- Bun
- Elysia

Language

- TypeScript

Database

- PostgreSQL
- JSONB

Infrastructure

- Docker
- Coolify
- S3 compatible object storage

Hosting

Self-hosted by default.

Cloud deployments should also be possible.

---

# Why Aurii?

Many existing CMS platforms assume that websites are the primary product.

Aurii assumes that structured information is the primary product.

Websites are simply one output.

This distinction influences every architectural decision.

---

# Import Philosophy

Importing data is a core capability.

Import is not simply uploading a CSV.

Aurii should understand incoming information.

Supported sources include:

- CSV
- Excel
- JSON
- XML
- APIs
- Databases
- Cloud storage
- Git repositories
- Google Sheets
- AI extracted documents

Every import should be:

- analyzable
- repeatable
- auditable
- versioned
- resumable

---

# AI Philosophy

AI should augment—not replace—the user.

AI may suggest:

- schemas
- field types
- mappings
- relationships
- validation rules
- import strategies
- search queries

Every suggestion should be reviewable.

Nothing important should happen automatically without user approval.

---

# Documentation

The project documentation is organized as follows:

```
docs/

README.md

VISION.md

CONSTITUTION.md

ARCHITECTURE.md

DOMAIN_MODEL.md

CORE.md

SCHEMA_ENGINE.md

IMPORT_ENGINE.md

QUERY_ENGINE.md

API.md

AI.md

AGENTS.md
```

Each document builds upon the previous one.

Together they form the complete Aurii Specification.

---

# Development Principles

When contributing to Aurii:

- Keep Core generic.
- Avoid application-specific features.
- Prefer composition over inheritance.
- Prefer configuration over hardcoding.
- Build reusable primitives.
- Design APIs before interfaces.
- Keep business logic out of the UI.
- Think in datasets instead of pages.
- Think in schemas instead of forms.
- Think in APIs instead of components.

---

# Long-term Goal

Aurii aims to become a complete platform for structured information.

Not merely a CMS.

Not merely a database.

Not merely an API.

Aurii should become the foundation upon which entirely new classes of applications can be built.

---

## Status

Aurii is currently in active design and development.

The architecture is intentionally being designed before large-scale implementation begins.

This specification serves as the project's source of truth.

As implementation progresses, code should follow the specification—not the other way around.