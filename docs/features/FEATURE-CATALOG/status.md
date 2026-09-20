# FEATURE-CATALOG Status

## Current State

- Small release: `SR-MVP-01`
- Artifact state: `QUALITY_VALIDATION`
- Review status: `DAY_6_COMPLETE_2026-09-20`
- Project state: `OPERATING`
- Phase: Dia 6 concluído; aguardando aprovação do Dia 7

## Completed

- Product PRD 1.0 approved.
- Architecture 1.0 approved.
- Catalog domain model created.
- Feature requirements and acceptance criteria derived.
- Feature Spec created.
- Architecture, data and security decisions accepted in ADR-001/ADR-002; Prisma 7 stable adoption accepted in ADR-004, superseding ADR-003.
- Feature requirements, acceptance criteria, domain decisions and Feature Spec approved by the human on 2026-09-14.
- Node.js 24.21.0 selected without removing the system Node.js 22 installation.
- Reproducible pnpm workspace and test runner created with exact dependency pins.
- Test plan, 20/20 acceptance-criteria matrix and deterministic fixtures created.
- Type-check and dependency audit passed.
- RED confirmed: 4 suites, 21 failed tests and 7 explicit infrastructure `todo` tests.
- Supabase baseline read-only completed with an empty commercial surface and zero advisor findings.
- PostgreSQL 17 isolated locally in `plus_store_day2_test`; seven integration `todo` cases became executable RED tests.
- Prisma 8 spike preserved as superseded historical evidence.
- Prisma 7.10.0 spike completed for migration, Client generation, CRUD, P2002, transaction rollback and cleanup.
- Production and full dependency audits passed with zero known vulnerabilities.
- Final RED evidence: 5 suites, 28 failed tests, zero `todo`; every failure reaches an approved missing behavior/schema contract.
- Domain, application, public projection and persistence-error contracts implemented with no NestJS or Prisma types crossing inward boundaries.
- Minimal authorization denies mutation before repository access and keeps write/publish permissions distinct.
- Prisma catalog schema and two additive migrations materialized for the private `app` schema.
- PostgreSQL constraints protect slug, SKU, product+color+size and optional barcode uniqueness, including concurrent writes.
- `anon`, `authenticated` and `PUBLIC` receive no access to the commercial schema; RLS is enabled as defense in depth.
- Final GREEN evidence: 5 suites, 28 tests passed, zero `todo`.
- Prisma generate/validate/migrate status, lint, type-check and build passed with Node.js 24.21.0.
- Test coverage: 81.93% statements, 62.76% branches, 90.32% functions and 80.15% lines.
- Production and full dependency audits passed with zero known vulnerabilities after ESLint tooling was pinned.
- The Supabase principal project was not mutated during Dia 3.
- NestJS 12 routes now expose create, activate, archive and public-list behavior
  with stable HTTP status/error contracts and correlation IDs.
- Zod 4 request validation and generated OpenAPI JSON Schema share one source.
- The concrete Prisma repository maps catalog records, uses two-column keyset
  pagination and shares the interactive transaction through AsyncLocalStorage.
- Supabase identity validation uses `getClaims`; only approved permissions from
  `app_metadata` are accepted and `user_metadata` is ignored.
- The Storage adapter issues non-upsert signed uploads for server-controlled
  image paths and verifies object completion without creating remote resources.
- The runtime composition validates environment variables and rejects
  non-publishable Supabase keys.
- The esbuild Node ESM bundle started successfully against PostgreSQL 17 local;
  public listing returned 200 and an admin request without bearer returned 401.
- Final Dia 4 evidence: 11 suites, 66 tests passed, zero todo; 81.48% statements,
  63.63% branches, 85.54% functions and 83.11% lines.
- Type-check, lint, build and production/full audits are green.
- The Supabase principal project was not mutated during Dia 4.
- Dia 5 added issuer/audience/session validation for Supabase claims and rejects
  oversized bearer tokens before provider access.
- Route UUIDs and correlation identifiers are now bounded at the HTTP boundary;
  invalid values fail closed without reaching application services.
- Storage provider exceptions are normalized and reconciliation is limited to ten
  concurrent requests.
- Prisma read failures are normalized, interactive transactions use a 2-second
  acquisition wait and 5-second execution timeout, and existing P2002 mappings remain intact.
- GitHub Actions now runs migrations against isolated PostgreSQL 17, lint,
  type-check, coverage thresholds, build and both dependency audits.
- The first remote execution passed on PR #6 in 1m07s.
- Both catalog migrations were applied from an empty local database before the
  final 76-test regression, matching the CI bootstrap sequence.
- Final Dia 5 evidence: 15 suites, 76 tests passed; 82.65% statements, 67.32%
  branches, 84.09% functions and 84.19% lines.
- A 10,000-row `EXPLAIN (ANALYZE, BUFFERS)` used the catalog composite index and
  completed in 0.862 ms, but exposed a deep-cursor scan recorded as `DEBT-PERF-001`.
- The Supabase principal project was not mutated during Dia 5.
- Day 6 validated the API-consumer experience without expanding the approved
  backend-only scope into `apps/web`.
- OpenAPI now marks all admin operations with bearer authentication, documents
  bounded public pagination inputs and lists relevant success/failure outcomes.
- Swagger UI and OpenAPI JSON are covered as navigable and machine-readable
  artifacts by `CAT-EXP-004`.
- Day 6 RED was observed for three missing documentation contracts before the
  controller metadata was corrected.
- Final Day 6 evidence: 16 suites, 80 tests passed; 82.65% statements, 67.32%
  branches, 84.09% functions and 84.19% lines.
- Type-check, lint, build and production/full audits are green.
- Visual accessibility, responsive layout, SEO and PWA remain deferred to the
  first applicable web releases; they were not marked as approved.
- The Supabase principal project was not mutated during Dia 6.

## Resolved Blockers

### Supabase baseline — resolved

- Evidence: direct MCP access, metadata, SQL baseline, extensions, migrations, Edge Functions and advisors all succeeded.
- Result: `public` is empty, `app` is absent, and there are no commercial grants, policies or buckets.

### Isolated PostgreSQL test target — resolved

- Evidence: a dedicated PostgreSQL 17 cluster runs locally on port `55432`, database `plus_store_day2_test`.
- Result: all seven database/security contracts execute and fail because the approved `app.*` schema is not implemented yet.

### Prisma stability — resolved

- Evidence: exact stable pins, reviewed migration, generated Client, CRUD, P2002, transaction rollback and cleanup were validated.
- Result: zero known vulnerabilities and zero peer conflicts after audited transitives were pinned.

## Prerequisites Before Remote Integration

- provide the backend database connection through a secure environment manager;
- create and validate the Storage bucket/policies only in an approved release;
- re-audit Prisma and remove transitives overrides when upstream packages incorporate the patches.

## Approved Decisions

1. ADR-001, ADR-002 and ADR-004 are active; ADR-003 is superseded.
2. SKU uses uppercase canonicalization and becomes immutable after activation.
3. Barcode is optional and unique when present.
4. A product can have multiple categories with one primary category.
5. The minimum publication policy is approved.
6. Minimal staff authorization is a prerequisite for admin mutations.

## Remaining Expansion Work

- migration review against an authorized preview environment and Supabase advisors before remote promotion.
- real staff permissions in Supabase Auth and end-to-end verification after the
  current JWT rejection incident is resolved;
- creation/review of the private Storage bucket and policies in an authorized environment;
- remaining admin commands and queries from the Feature Spec in later approved increments.

## Next Action

Obtain explicit approval for Dia 7. Remote Supabase migrations and Storage mutations remain prohibited until separately authorized.
