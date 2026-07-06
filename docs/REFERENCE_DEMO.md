# Reference Demo Project

> **For AI agents:** This is the canonical demo for validating Aurii features. Read this before adding new capabilities. Also see the **Reference Demo Project** section in `AGENTS.md`.

---

## Overview

The Norwegian public reference dataset proves the full Aurii loop against **real open data** from multiple independent sources:

```
Kartverket + Bring + UDIR + Brreg  →  import  →  storage  →  query  →  API  →  SDK  →  Studio / apps/geo
```

| Component | Path |
|-----------|------|
| Dataset (schemas, imports, snapshots) | `demo/norwegian-geo/` |
| Dataset survey & strategy | `docs/Public Reference Datasets.md` |
| Import script | `bun run import:norwegian-geo` |
| Refresh from live APIs | `bun run fetch:norwegian-geo` |
| Core integration tests | `packages/core/src/__tests__/vertical-slice.test.ts` |
| Public reference datasets test | `packages/core/src/__tests__/public-reference-datasets.test.ts` |
| Route feasibility tests | `packages/core/src/__tests__/geo-website-routes.test.ts` |
| Live API import test | `packages/core/src/__tests__/norwegian-geo-import.test.ts` |
| SDK vertical slice | `packages/sdk/src/__tests__/vertical-slice.test.ts` |
| Public website demo | `apps/geo` |
| Phase 3 relational tests | `packages/core/src/__tests__/phase-3-relational.test.ts` |

---

## Dataset

| Schema | Records | Natural key | Relationships |
|--------|---------|-------------|---------------|
| `county` | 15 | `id` | — |
| `municipality` | 357 | `id` | `countyId` → `county` (reference) |
| `postal-code` | 5,122 | `code` | `municipalityId` → `municipality` (reference) |
| `school` | ~5,683 | `id` | `municipalityId`, `countyId` → geography |
| `kindergarten` | ~5,541 | `id` | `municipalityId`, `countyId` → geography |
| `hospital` | ~115 | `id` | `municipalityId` → `municipality` |
| `public-holiday` | 84 | `id` | — (national calendar) |

Dataset ID: **`norwegian-geo`**

Sources:
- Counties & municipalities: [Kartverket/GeoNorge](https://ws.geonorge.no/kommuneinfo/v1/)
- Postal codes: [Bring](https://www.bring.no/tjenester/adressetjenester/postnummer)
- Schools & kindergartens: [UDIR NSR/NBR](https://www.udir.no/om-udir/data/nxr/)
- Hospitals: [Brønnøysundregistrene](https://data.brreg.no/enhetsregisteret/api)
- Public holidays: [Nager.Date](https://date.nager.at) (see `docs/Public Reference Datasets.md`)

---

## Quick commands

```bash
# Import into SQLite (local dev)
bun run import:norwegian-geo

# Import into PostgreSQL (after docker compose up)
AURII_STORAGE=postgres \
  DATABASE_URL=postgres://aurii:aurii@localhost:5432/aurii \
  bun run import:norwegian-geo

# Run all integration tests
bun run test

# Run geo website demo
cd apps/geo && bun run dev    # http://localhost:4322
cd apps/geo && bun run build  # 373 static pages

# Studio
# Open http://localhost:4321/login → dataset: norwegian-geo
```

---

## When adding a new feature

Use this checklist:

1. **Does it affect import?** → Extend `demo/norwegian-geo/imports/` or add a test in `vertical-slice.test.ts`
2. **Does it affect query?** → Add cases to `geo-website-routes.test.ts` using real county/municipality IDs
3. **Does it affect the API/SDK?** → Extend `packages/sdk/src/__tests__/vertical-slice.test.ts`
4. **Does it affect public consumers?** → Update `apps/geo` to exercise the feature
5. **Does it affect Studio?** → Verify against dataset `norwegian-geo` in the import wizard or entity browser

### Test IDs (stable)

| Entity | ID | Name |
|--------|-----|------|
| County | `03` | Oslo |
| Municipality | `0301` | Oslo |
| Postal code | `0001` | Oslo |

### Example validation queries

```bash
cd packages/core

bun run cli query 'from municipality where countyId == "03"' --dataset norwegian-geo
bun run cli query 'from municipality join county on municipality.countyId = county.id where municipality.id == "0301"' --dataset norwegian-geo
bun run cli query 'count municipality where countyId == "03"' --dataset norwegian-geo
bun run cli query 'from postal-code where code == "0001"' --dataset norwegian-geo
```

---

## Website routes (`apps/geo`)

| Route | Count | Description |
|-------|-------|-------------|
| `/` | 1 | County index |
| `/fylker/[id]` | 15 | County + municipalities |
| `/kommuner/[id]` | 357 | Municipality + postal codes |

Build validates all routes resolve. See `apps/geo/README.md`.

---

## What not to use this for

- Performance benchmarking at scale (dataset is small by design)
- Features explicitly deferred to Phase 4+ (RBAC, plugins, AI, full-text search, dot-notation traversal)
- Domain-specific Core hacks — behaviour belongs in schemas, imports, or demo apps

---

## Maintaining the demo

Refresh data periodically from authoritative sources:

```bash
bun run fetch:norwegian-geo
bun run import:norwegian-geo
bun run test
cd apps/geo && bun run build
```

Commit updated snapshots in `demo/norwegian-geo/data/` when Kartverket or Bring publish changes.
