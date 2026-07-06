# @aurii/studio — Phase 2

> Aurii Studio is a client of the Aurii Runtime. It consumes the public HTTP API and nothing else.

An Astro application providing:

- **Dashboard** — entity counts, field coverage per schema, import history
- **Import Wizard** — upload → analyze → schema → mapping → dry run → import
- **Entity Browser** — browse, filter, and query entities
- **Schemas** — inspect registered schemas
- **Login** — API URL + token when the API requires authentication

## Quick start

```bash
# Start the Core API first (from packages/core)
bun run cli serve

# Then start Studio
bun install
bun run dev        # http://localhost:4321
```

Production build:

```bash
bun run build      # static output in dist/
bun run preview
```

## Configuration

Studio stores its connection settings in the browser (localStorage):

| Key             | Meaning                                    |
|-----------------|--------------------------------------------|
| `aurii.apiUrl`  | Core API base URL (default localhost:3000) |
| `aurii.token`   | Bearer token if the API requires auth      |
| `aurii.dataset` | Active dataset (switcher in the sidebar)   |

Visit `/login` to change the connection.

## Import Wizard

The wizard walks through six steps:

1. **Upload** — drag-and-drop CSV or JSON
2. **Preview** — detected format, delimiter, columns, inferred types
3. **Schema** — accept the generated schema or use an existing one
4. **Mapping** — map source columns to schema fields, choose transforms
5. **Dry run** — full validation, nothing written, per-row errors shown
6. **Import** — the real run, with result summary

Nothing is written to storage before step 6.
