# FEATURE-CATALOG Status

## Current State

- Small release: `SR-MVP-01`
- Artifact state: `SPEC_READY`
- Review status: `APPROVED_2026-09-14`
- Project state: `ARCHITECTURE_READY`
- Phase: Dia 1 concluído

## Completed

- Product PRD 1.0 approved.
- Architecture 1.0 approved.
- Catalog domain model created.
- Feature requirements and acceptance criteria derived.
- Feature Spec created.
- Architecture, data, security and Prisma decisions accepted in ADR-001 through ADR-003.
- Feature requirements, acceptance criteria, domain decisions and Feature Spec approved by the human on 2026-09-14.

## Hard Blockers Before Implementation

### Node runtime

- Evidence: local Node.js is 22.14.0; Prisma 8 RC requires Node.js 24.11+ on the Node 24 line.
- Impact: scaffold and dependency validation cannot safely begin.
- Minimum unblock: install/select Node.js 24.11+ and verify `node --version`.

### Supabase baseline

- Evidence: project `olkadbgumpiybehslobk` is not visible to the connected management account.
- Impact: existing schema, grants, RLS, migrations and extensions are unknown.
- Minimum unblock: authorize access and execute read-only baseline before schema work.

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

Await the explicit `dia 2` command. Dia 2 must validate its entry, build the validation Context Pack and address the environment blockers required to produce trustworthy RED tests.
