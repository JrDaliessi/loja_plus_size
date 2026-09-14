# FEATURE-CATALOG Status

## Current State

- Small release: `SR-MVP-01`
- Artifact state: `REQUIREMENTS_READY`
- Review status: `PENDING_HUMAN_APPROVAL`
- Project state: `REQUIREMENTS_READY`
- Phase: Dia 1B

## Completed

- Product PRD 1.0 approved.
- Architecture draft created.
- Catalog domain model created.
- Feature requirements and acceptance criteria derived.
- Feature Spec created.
- Architecture, data, security and Prisma decisions recorded as proposed ADRs.

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

### Human decision

- Evidence: architecture, ADRs and feature-specific policies are marked proposed.
- Impact: Dia 2 cannot be authorized until review.
- Minimum unblock: approve or correct the Dia 1B package.

## Pending Decisions

1. Approve ADR-001, ADR-002 and ADR-003.
2. Approve SKU canonicalization and immutability after activation.
3. Approve optional/unique barcode policy.
4. Approve multiple categories with one primary category.
5. Approve minimum publication policy.
6. Approve minimal staff authorization as prerequisite for admin mutations.

## Next Action

Review and approve the Dia 1B package. After approval, mark architecture `ARCHITECTURE_READY`, feature `SPEC_READY`, and request explicit authorization for Dia 2.
