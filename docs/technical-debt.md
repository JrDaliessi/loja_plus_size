# Technical Debt

## Active

### DEBT-PERF-001 — Optimize deep catalog cursor predicates

- Severity: `MEDIUM`
- Capability: `software`
- Affects: `FEATURE-CATALOG`, public catalog pagination
- Problem: Prisma expresses the two-column cursor boundary as an `OR` predicate.
- Evidence: with 10,000 local `ACTIVE` products, PostgreSQL used
  `products_status_created_at_id_idx`, returned 21 rows in 0.862 ms, but filtered
  5,000 index entries for a midpoint cursor.
- Current control: bounded pages, opaque `(created_at, id)` cursor and the correct
  composite index keep results deterministic; no production dataset exists yet.
- Risk of delay: latency grows with page depth even though OFFSET is not used.
- Recommended phase: before `SR-MVP-03` storefront traffic or when representative
  data is available.
- Resolution criterion: compare a row-value predicate or another Prisma-compatible
  strategy with `EXPLAIN (ANALYZE, BUFFERS)` and show bounded scanned rows without
  weakening adapter isolation or result consistency.

### DEBT-DEP-001 — Remove deprecated transitive glob 10.5.0

- Severity: `LOW`
- Capability: `software`
- Affects: Jest coverage toolchain only.
- Problem: the coverage dependency tree still contains deprecated `glob@10.5.0`.
- Current control: production and full audits report no known vulnerabilities;
  dependency versions and lockfile are pinned.
- Risk of delay: maintenance noise and eventual incompatibility in test tooling.
- Recommended phase: next compatible Jest/test-exclude release.
- Resolution criterion: dependency installation contains no deprecated version and
  the complete regression remains green without an unsafe override.
