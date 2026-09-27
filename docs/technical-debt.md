# Technical Debt

## Active

### DEBT-RATE-001 — Distribuir o rate limit antes da escala horizontal

- Severity: `MEDIUM`
- Capability: `software`
- Affects: `FEATURE-AWS-API-DEPLOY`, catálogo público
- Problem: o limiter atual usa memória por task; com mais de uma task o limite
  agregado deixa de ser global.
- Current control: `desired_tasks: 1`, limite por cliente, proxy confiável e teto
  documentado; o controle já reduz abuso casual sem criar infraestrutura extra.
- Risk of delay: escala horizontal pode multiplicar o volume aceito pelo número
  de tasks e reinícios perdem contadores locais.
- Recommended phase: antes de aumentar `desired_tasks` ou abrir operação
  comercial.
- Resolution criterion: WAF ou store distribuído aprovado aplica limite global,
  possui teste multi-instância e preserva fail-closed/observabilidade.

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

### DEBT-CI-001 — Replace transitive Node.js 20 cache action

- Severity: `LOW`
- Capability: `software`
- Affects: API Image Verification workflow only.
- Problem: Trivy Action 0.35.0 invokes an `actions/cache` revision that still
  targets Node.js 20; GitHub currently forces it to Node.js 24 and emits a warning.
- Current control: the Trivy Action is pinned by full SHA, the runner completed
  build/scan/SBOM successfully, and no deprecated runtime enters the API image.
- Risk of delay: a future runner may stop applying the compatibility fallback.
- Recommended phase: update when Trivy publishes a compatible pinned revision.
- Resolution criterion: the image verification run completes without a Node.js 20
  action warning and preserves the same scan/SBOM gates.

## Resolved

### DEBT-WEB-001 — Optimize source preview images

- Resolved: `2026-09-21`, Dia 5.
- Result: visually reviewed WebPs reduced 6,745,439 bytes to 307,958 bytes
  (`95.43%`) while preserving dimensions, responsive rendering and all gates.
- Evidence: `docs/features/FEATURE-WEB-PREVIEW/day5-evidence.md` and
  `docs/features/FEATURE-WEB-PREVIEW/asset-provenance.md`.
