---
id: REL-CAT-DAY7-001
feature: FEATURE-CATALOG
small_release: SR-MVP-01
phase: day-7
status: READY_FOR_RELEASE
date: 2026-09-20
derived_from:
  - docs/features/FEATURE-CATALOG/feature-spec.md
  - docs/features/FEATURE-CATALOG/experience-validation.md
  - quality-gates.md
affects:
  - docs/releases/SR-MVP-01-catalog-release-candidate.md
---

# FEATURE-CATALOG — Release Readiness

## Decision

The source artifact is `READY_FOR_RELEASE`. It is not `RELEASED`: no migration,
backend deployment, Auth configuration, Storage resource or application data has
been promoted to the principal Supabase project.

## Final Gate

| Gate | Evidence | Result |
|---|---|---|
| Requirements and traceability | 20/20 acceptance criteria mapped; `CAT-*` and `CAT-EXP-*` contracts | PASS |
| Architecture | domain/application remain independent; NestJS, Prisma and Supabase stay in adapters | PASS |
| Automated validation | 16 suites, 80 tests; coverage thresholds satisfied | PASS |
| Static/build | type-check, lint and build | PASS |
| Supply chain | production and complete audits | PASS — zero known vulnerabilities |
| Fresh migration | two migrations applied to an empty PostgreSQL 17 database | PASS |
| Migration idempotency | second `migrate deploy` reported no pending migrations | PASS |
| Database constraints | 10 PKs, 12 FKs, 18 checks and 32 indexes in the isolated target | PASS |
| FK indexing | catalog query found zero unindexed FK columns | PASS |
| RLS and grants | RLS enabled on 10/10 tables; zero `PUBLIC`/`anon`/`authenticated` table grants | PASS |
| OpenAPI experience | Swagger HTML, OpenAPI JSON, auth, pagination and outcomes | PASS |
| Secrets | tracked-file scan found zero JWT/secret-key patterns | PASS |
| Remote Supabase identity | project `olkadbgumpiybehslobk`, region `sa-east-1`, PostgreSQL 17 | PASS |
| Remote advisors | security and performance returned zero findings | INCONCLUSIVE FOR PROMOTION — database is inactive |
| Remote migration/table drift | connection timed out because project status is `INACTIVE` | BLOCKED FOR PROMOTION |
| Recovery | additive-schema rollback and promotion recovery documented | PASS FOR CANDIDATE |

## PostgreSQL Review

The schema follows the selected Supabase/PostgreSQL practices:

- externally visible product IDs are time-ordered UUIDv7 values generated in the
  application;
- every foreign-key access path has an index, including leftmost composite keys;
- public listing uses keyset pagination and the
  `(status, created_at, id)` composite index;
- optional barcode and primary-category rules use partial unique indexes;
- short interactive transactions are bounded to 2 seconds of acquisition wait
  and 5 seconds of execution;
- commercial tables live in private schema `app`, have RLS enabled and are not
  granted to Data API roles.

`DEBT-PERF-001` remains accepted at medium severity: Prisma's `OR` expression
uses the correct index but filters preceding entries for deep cursors. It must be
resolved before storefront-scale traffic or when representative data is
available.

## Remote Promotion Blockers

1. Reactivate the Supabase project through an explicitly authorized account action.
2. Provide pooled runtime and direct migration connections through a secret manager.
3. Validate staff permissions against live Supabase Auth.
4. Apply the reviewed migrations and rerun table/grant/RLS checks plus advisors.
5. Create and validate the private Storage bucket/policies in their own approved release.
6. Configure request body limits, rate limiting and production observability before public API exposure.

None of these blockers prevents starting a separately approved web discovery
slice, but the web preview must not pretend that the remote catalog API is live.
