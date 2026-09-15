# FEATURE-CATALOG Status

## Current State

- Small release: `SR-MVP-01`
- Artifact state: `VALIDATION_READY`
- Review status: `DAY_2_CORRECTED_2026-09-15`
- Project state: `ARCHITECTURE_READY`
- Phase: Dia 2 concluído; aguardando aprovação do Dia 3

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

## Next Action

Obtain explicit approval for Dia 3. Until then, functional implementation and Supabase migrations remain prohibited.
