# Technical Debt

## Active

### DEBT-WEB-001 — Optimize source preview images

- Severity: `LOW`
- Capability: `software`
- Affects: `FEATURE-WEB-PREVIEW`, repository and deployment artifact size.
- Problem: the four approved 1122x1402 PNG source assets total 6,745,439 bytes.
- Current control: `next/image` serves responsive optimized variants, all images
  declare dimensions and `sizes`, and browser verification showed successful
  loading without layout overflow.
- Risk of delay: unnecessary repository and deployment transfer weight even
  though runtime delivery is optimized.
- Recommended phase: Dia 5 hardening, after visual approval is stable.
- Resolution criterion: lossless or visually reviewed WebP/AVIF source variants
  materially reduce bytes while hashes/provenance, tests and browser quality
  remain valid.

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
