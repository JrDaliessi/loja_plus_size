# FEATURE-CATALOG Status

## Current State

- Small release: `SR-MVP-01`
- Artifact state: `BLOCKED`
- Review status: `DAY_2_PARTIAL_RED_2026-09-14`
- Project state: `ARCHITECTURE_READY`
- Phase: Dia 2 em execução

## Completed

- Product PRD 1.0 approved.
- Architecture 1.0 approved.
- Catalog domain model created.
- Feature requirements and acceptance criteria derived.
- Feature Spec created.
- Architecture, data, security and Prisma decisions accepted in ADR-001 through ADR-003.
- Feature requirements, acceptance criteria, domain decisions and Feature Spec approved by the human on 2026-09-14.
- Node.js 24.21.0 selected without removing the system Node.js 22 installation.
- Reproducible pnpm workspace and test runner created with exact dependency pins.
- Test plan, 20/20 acceptance-criteria matrix and deterministic fixtures created.
- Type-check and dependency audit passed.
- RED confirmed: 4 suites, 21 failed tests and 7 explicit infrastructure `todo` tests.

## Hard Blockers Before Implementation

### Supabase baseline

- Evidence: project `olkadbgumpiybehslobk` is not visible to the connected management account.
- Impact: existing schema, grants, RLS, migrations and extensions are unknown.
- Minimum unblock: authorize access and execute read-only baseline before schema work.

### Isolated PostgreSQL test target

- Evidence: local PostgreSQL 13 and 17 services are running, but require an unavailable credential; Docker is absent.
- Impact: uniqueness, concurrency, cursor and rollback scenarios cannot become trustworthy RED tests.
- Minimum unblock: authorize a Supabase development branch after cost confirmation or provide secure access to a disposable local database.

### Prisma 8 compatibility

- Evidence: Prisma 8 remains RC and lacks capabilities commonly used in Prisma 7.
- Impact: persistence and migration APIs require a bounded spike.
- Minimum unblock: verify/pin exact packages and pass the spike defined by ADR-003.

## Approved Decisions

1. ADR-001, ADR-002 and ADR-003 are accepted.
2. SKU uses uppercase canonicalization and becomes immutable after activation.
3. Barcode is optional and unique when present.
4. A product can have multiple categories with one primary category.
5. The minimum publication policy is approved.
6. Minimal staff authorization is a prerequisite for admin mutations.

## Next Action

Authorize the target Supabase project and an isolated PostgreSQL test target. Then complete the seven pending integration tests and the `VALIDATION_READY` gate. Functional implementation remains prohibited.
