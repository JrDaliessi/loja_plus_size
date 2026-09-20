# DIA-5-001 — Catalog Refinement and Hardening

## Metadata

- Date: 2026-09-20
- Capability: software
- Artifact: `FEATURE-CATALOG`
- Small release: `SR-MVP-01`
- Input state: `IN_PROGRESS`
- Output state: `HARDENING`
- Derived from: Dia 4 implementation, `FSPEC-CAT001`, ADR-001, ADR-002 and ADR-004

## Scope

Refine the catalog adapters and transport boundaries without adding product
behavior or changing the approved domain contracts. Remote Supabase mutations
were explicitly outside scope.

## TDD Evidence

Ten new tests were first executed RED and failed for the intended reasons:

- cross-project or incomplete Supabase claims were accepted;
- oversized bearer tokens reached the identity provider;
- thrown Storage and Prisma failures escaped adapter boundaries;
- Storage reconciliation started 25 simultaneous requests;
- interactive transactions had no explicit timeout;
- malformed route UUIDs reached the application service;
- arbitrary oversized correlation IDs were echoed.

After the minimum implementation, the new tests and the full regression became
GREEN.

## Changes

- Bound verified Supabase identity to issuer, authenticated audience and session.
- Limited bearer token length before provider access.
- Normalized thrown Storage and persistence failures.
- Limited media reconciliation concurrency to ten requests.
- Limited Prisma interactive transaction acquisition/execution time.
- Validated route identifiers and bounded correlation IDs at the HTTP edge.
- Added enforced coverage thresholds and an API GitHub Actions workflow with
  immutable action SHAs and isolated PostgreSQL 17.
- Centralized active technical debt in `docs/technical-debt.md`.

## Performance Evidence

With 10,000 temporary local products, the public keyset predicate used
`products_status_created_at_id_idx` and returned 21 rows in 0.862 ms. PostgreSQL
still filtered 5,000 entries at the midpoint because of the Prisma-generated
`OR` predicate. The dataset was removed immediately and the finding was recorded
as `DEBT-PERF-001`; no speculative raw SQL was introduced.

## Quality Evidence

- Test suites: 15 passed.
- Tests: 76 passed, zero skipped/todo.
- Fresh migration bootstrap: both migrations applied to an empty isolated database.
- Coverage: 82.65% statements, 67.32% branches, 84.09% functions, 84.19% lines.
- Lint and type-check: passed.
- Build: passed.
- Production and full audits: zero known vulnerabilities.
- Supabase principal project mutated: no.

## Remaining Risks

- Remote database credentials, migration promotion and Storage configuration
  still require separate authorization and an environment manager.
- Supabase staff permission setup and live Auth verification remain pending.
- Deep cursor performance must be revisited before storefront-scale traffic.
- The deprecated test-only `glob@10.5.0` remains a low-severity upstream debt.

## Next Action

Request explicit approval for Dia 6. Do not promote migrations or create remote
Storage resources as part of that approval alone.
