---
id: SR-MVP-01-RC1
small_release: SR-MVP-01
feature: FEATURE-CATALOG
status: READY_FOR_RELEASE
date: 2026-09-20
pull_request: https://github.com/JrDaliessi/loja_plus_size/pull/6
---

# SR-MVP-01 — Catalog Release Candidate

## Objective

Establish product, category, variant/SKU and media contracts as the source of
truth required by later inventory, storefront and administration releases.

## Included

- catalog domain rules and application use cases;
- private PostgreSQL `app` schema, constraints, indexes, RLS and revocations;
- Prisma persistence and bounded transaction adapters;
- Supabase Auth claim validation and private Storage upload contracts;
- versioned NestJS REST/OpenAPI presentation;
- CI with PostgreSQL 17, coverage thresholds, build and dependency audits;
- API-consumer experience validation through Swagger and OpenAPI JSON.

## Excluded

- `apps/web`, Purple Noir UI and Vercel preview;
- inventory availability;
- complete admin CRUD;
- remote database migration or backend deployment;
- live Auth staff provisioning;
- Storage bucket/policies and product media objects.

## Evidence

- 20/20 acceptance criteria traced to tests;
- 16 suites and 80 tests passed;
- 82.65% statements, 67.32% branches, 84.09% functions and 84.19% lines;
- type-check, lint, build and dependency audits passed;
- [GitHub Actions run 35539866962](https://github.com/JrDaliessi/loja_plus_size/actions/runs/35539866962) passed for release-candidate commit `f2f2a16` in 1m00s;
- fresh and idempotent migration deployment passed in isolated PostgreSQL 17;
- RLS enabled on all 10 commercial tables, with no public/Data API grants;
- zero missing FK indexes;
- [release readiness](../features/FEATURE-CATALOG/release-readiness.md);
- [rollback plan](../features/FEATURE-CATALOG/rollback-plan.md).

## Risks and Debt

- `DEBT-PERF-001` — medium: deep cursor predicate scans preceding index entries;
- `DEBT-DEP-001` — low: deprecated transitive test-only `glob@10.5.0`;
- remote staff permissions, Storage and secure database connections remain pending;
- principal Supabase project was `INACTIVE` during the final read-only check.

## Release Decision

The repository artifact is ready for review and merge. Promotion to a remote
environment remains a separate, explicitly authorized operation. Therefore this
record is a release candidate and `last_release` remains `none` until promotion
evidence exists.
