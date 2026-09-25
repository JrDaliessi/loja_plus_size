# Project Context

project: Plus Store
project_state: OPERATING
active_capabilities: [product, software]
active_artifact: FEATURE-CATALOG
artifact_state: READY_FOR_RELEASE
phase: pós-release — readiness remoto do catálogo
last_release: SR-WEB-PREVIEW-01
last_release_candidate: SR-WEB-PREVIEW-01-RC1

## Current Goal

Desbloquear com segurança a promoção remota da `SR-MVP-01` sem alterar o
Supabase enquanto o projeto permanecer inativo.

## Blockers

- `SR-WEB-PREVIEW-01` foi publicada e validada em produção.
- O Supabase principal está `INACTIVE`; schema e migrations retornaram timeout
  na revalidação read-only de 2026-09-25.
- A promoção remota do catálogo, Auth, RLS e Storage permanece bloqueada até
  reativação e nova inspeção somente leitura.

## Active Risks

- Escopo amplo exige preservar a sequência MVP → V6.
- Dados de medidas corporais e CRM exigem minimização e controles LGPD.
- Estoque, pagamento e webhooks exigem idempotência, consistência e rollback.
- Overrides transitivos de segurança devem ser reavaliados em toda atualização do Prisma e removidos quando o upstream incorporar os patches.
- Provedor de frete e hospedagem do backend ainda não foram selecionados.
- Conteúdo e assets demonstrativos podem ser confundidos com catálogo real se o
  disclosure, a ausência de preço/estoque e o `noindex` não forem preservados.
- A preview demonstrativa está publicada em `https://loja-plus-size.vercel.app`
  pelo deployment `dpl_jQHa6UPru2CMbYZfXp8Q6kPLL7v4`.
- A página de status do Supabase ainda registrava em 2026-09-20 um incidente de rejeição de JWT; a integração Auth remota precisa ser revalidada após resolução.
- A paginação keyset usa o índice correto, mas o predicate `OR` emitido pelo Prisma filtrou 5.000 entradas em um cursor intermediário com 10.000 registros; ver `DEBT-PERF-001`.

## Current Context

- brief: `project-brief.md`
- requirements: `docs/product/prd.md` (`1.0`, `REQUIREMENTS_APPROVED`)
- architecture: `architecture.md` (`1.0`, `APPROVED`)
- active artifact: `docs/features/FEATURE-CATALOG/` (`READY_FOR_RELEASE`)
- active requirements: `docs/features/FEATURE-CATALOG/feature-prd.md`
- active specification: `docs/features/FEATURE-CATALOG/feature-spec.md`
- active validation: `docs/features/FEATURE-CATALOG/test-plan.md`,
  `docs/features/FEATURE-CATALOG/test-matrix.md`
- active status: `docs/features/FEATURE-CATALOG/status.md`
- previous release: `docs/releases/SR-WEB-PREVIEW-01.md`
- release candidate: `docs/releases/SR-MVP-01-catalog-release-candidate.md`
- release readiness: `docs/features/FEATURE-CATALOG/release-readiness.md`
- rollback: `docs/features/FEATURE-CATALOG/rollback-plan.md`
- implementation: `apps/api/src/features/catalog/`, `apps/api/src/main.ts`, `apps/api/src/app.module.ts`
- database schema: `apps/api/prisma/schema.prisma`, `apps/api/prisma/migrations/`
- relevant ADRs: `docs/adr/ADR-001-web-api-boundaries.md`, `docs/adr/ADR-002-supabase-data-boundary.md`, `docs/adr/ADR-004-prisma-7-stable-adoption.md`
- quality gates: `quality-gates.md`
- technical debt: `docs/technical-debt.md`
- CI: `.github/workflows/api-quality.yml`
- stack: `project-stack.md`
- toolchain: `project-toolchain.md`
- repository: `https://github.com/JrDaliessi/loja_plus_size.git` (`origin`, branch `main`)
- infrastructure: `docs/infrastructure/supabase.md`
- Supabase baseline: `docs/infrastructure/supabase-baseline-2026-09-14.md`
- Supabase revalidation: `docs/infrastructure/supabase-revalidation-2026-09-25.md`
- Prisma 7 spike: `docs/features/FEATURE-CATALOG/prisma7-spike.md`
- superseded Prisma 8 evidence: `docs/features/FEATURE-CATALOG/prisma8-spike.md`
- sources: `docs/sources/source-map.md`
- design system: `design_system_purple_noir_loja_plus_size.md`

## Next Action

Solicitar ao proprietário a reativação do Supabase. Depois repetir baseline
read-only e somente então preparar decisão humana sobre migrations, Auth, RLS e
Storage da `SR-MVP-01`.

## History

Não carregar automaticamente. Ver `docs/history/` e `docs/releases/`.
