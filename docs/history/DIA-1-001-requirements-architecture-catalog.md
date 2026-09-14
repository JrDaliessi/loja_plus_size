# Dia 1 — Requirements, Architecture and Catalog Specification

## Record

- ID: `DIA-1-001`
- Date: 2026-09-14
- Project transition: `FOUNDATION_READY` → `REQUIREMENTS_READY` → `ARCHITECTURE_READY`
- Active artifact transition: `DISCOVERY` → `REQUIREMENTS_READY` → `SPEC_READY`
- Small release: `SR-MVP-01`
- Capability: `product`, `software`

## Authoritative Inputs

- `project-brief.md`
- `loja_plus_size_ideia_completa.md`
- `stack_loja_plus_size_completa.md`
- `design_system_purple_noir_loja_plus_size.md`
- `project-stack.md`
- `project-toolchain.md`

## Approved Outputs

- Product PRD 1.0 in `docs/product/prd.md`.
- Architecture 1.0 in `architecture.md`.
- ADR-001, ADR-002 and ADR-003 with status `accepted`.
- Catalog domain model in `docs/domain/catalog.md`.
- Feature PRD and Feature Spec in `docs/features/FEATURE-CATALOG/`.

## Human Decisions

The human approved the Dia 1B package on 2026-09-14, including:

1. monorepo with explicit Next.js/NestJS boundaries;
2. backend-only commercial data boundary and proposed non-exposed Supabase schema, subject to the real baseline;
3. conditional Prisma 8 RC adoption, exact version pins and compatibility spike;
4. uppercase/case-insensitive SKU policy and immutability after activation;
5. optional, normalized and unique barcode when present;
6. multiple categories with one primary category;
7. catalog publication policy;
8. staff authorization before administrative mutations are exposed.

## Validation Evidence

- Required Dia 1B artifacts exist and are non-empty.
- Feature PRD contains 18 unique requirements and 20 unique acceptance criteria.
- Domain model contains 12 unique invariants.
- Architecture, feature and control-document states are synchronized.
- `git diff --check` completed without whitespace errors.
- No supplied Supabase credential was persisted in the repository.

## Remaining Blockers

- Node.js 22.14.0 must be replaced/selected as 24.11+ before the current Prisma 8 RC scaffold.
- Supabase management access is required for the read-only baseline before schema or migration work.
- Exact Prisma 8 package versions and necessary capabilities require the bounded spike in ADR-003.
- Authorization scenarios must be defined in the Dia 2 validation contract before protected endpoints.

## Next Action

Await the explicit `dia 2` command. Dia 2 will validate its entry and produce the validation strategy and RED tests before any functional implementation.
