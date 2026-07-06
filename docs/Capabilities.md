# Capabilities

> Capabilities define what an Entity can do.
>
> Schemas describe what an Entity is.
>
> Capabilities describe how an Entity behaves.
>
> Together they define the platform.

---

# Purpose

Most platforms mix structure and behavior.

An Article is publishable because developers hardcoded publishing.

A Product supports localization because someone implemented localization.

An Image supports variants because the Asset module says so.

Aurii takes a different approach.

Behavior is declarative.

Schemas declare capabilities.

Core implements capabilities.

Applications consume capabilities.

---

# Philosophy

A Schema answers:

> What is this?

Capabilities answer:

> What can it do?

Those are different questions.

Keeping them separate keeps Core generic.

---

# Declarative Behavior

Instead of writing application code like:

```ts
if (entity.type === "article") {
    enablePublishing();
}
```

Aurii should express intent.

```yaml
capabilities:

- publish

- version

- workflow

- localization
```

Core understands capabilities.

Applications never inspect entity types.

---

# The Capability Model

```
Schema

↓

Capabilities

↓

Core Runtime

↓

Applications
```

Every application observes the same behavior.

---

# Categories

Capabilities fall into categories.

## Lifecycle

Examples:

```
create

update

delete

archive

restore

publish

schedule
```

---

## Versioning

Examples:

```
drafts

revisions

history

compare

rollback
```

---

## Localization

Examples:

```
localized

fallback

translation

locale inheritance
```

---

## Workflow

Examples:

```
review

approval

editorial workflow

publish gates
```

---

## Search

Examples:

```
searchable

autocomplete

facets

boosting
```

---

## AI

Examples:

```
summarize

generate metadata

extract entities

semantic search

classification
```

---

## Assets

Examples:

```
thumbnails

variants

transcoding

metadata extraction
```

---

## Collaboration

Examples:

```
comments

presence

real-time editing

mentions
```

---

## Security

Examples:

```
ownership

sharing

auditing

retention
```

---

## Automation

Examples:

```
webhooks

events

scheduled tasks

notifications
```

---

# Capabilities Are Composable

Capabilities should compose naturally.

Example:

```
Article

Capabilities

Publish

Version

Workflow

Localization

Search
```

Another Schema may choose:

```
Municipality

Capabilities

Version

Search

API

Nothing else.
```

Nothing is hardcoded.

---

# Capabilities Are Optional

No capability should be mandatory.

Projects should remain lightweight.

Small installations may only use:

```
CRUD

Search
```

Enterprise installations may use:

```
Workflow

Localization

AI

Publishing

Automation

Audit

Retention
```

The platform grows with the user.

---

# Plugins

Plugins contribute capabilities.

Examples:

```
Digital Signatures

↓

Capability

----------------

Geospatial

↓

Capability

----------------

Commerce

↓

Capability
```

Core does not need to know them beforehand.

---

# Runtime

Capabilities execute inside Core.

Schemas declare them.

Core enforces them.

Applications consume them.

No application should implement capability logic independently.

---

# API

Capabilities become visible through APIs.

Example:

```
GET Entity

↓

Capabilities

↓

publish

archive

restore

compare
```

Applications adapt automatically.

---

# Studio

Studio should never contain hardcoded assumptions.

Instead:

```
Capability

↓

UI Component

↓

Toolbar

↓

Action
```

Adding a new capability automatically enables new UI.

---

# AI

AI should understand capabilities.

Instead of asking:

"What is an article?"

AI should ask:

"What capabilities does this Entity have?"

Capabilities explain behavior.

Schemas explain structure.

Together they explain intent.

---

# Examples

## News Article

Capabilities:

```
publish

workflow

version

localization

search

comments
```

---

## Municipality

Capabilities:

```
search

version

api
```

---

## Asset

Capabilities:

```
variants

metadata

transcoding

search
```

---

## Company

Capabilities:

```
search

history

imports

api
```

---

# Capability Registry

Projects maintain a registry.

```
Capability

↓

Definition

↓

Implementation

↓

Documentation
```

Capabilities become discoverable.

Plugins extend the registry.

---

# Why Capabilities Matter

Without Capabilities:

Applications ask:

"What kind of Entity is this?"

With Capabilities:

Applications ask:

"What can this Entity do?"

The second question scales indefinitely.

---

# Guiding Principle

Schemas define structure.

Capabilities define behavior.

Core executes behavior.

Applications observe behavior.

Every new feature should first be considered a Capability before becoming hardcoded functionality.