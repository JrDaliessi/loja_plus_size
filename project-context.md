# Project Context

project: Plus Store
project_state: OPERATING
active_capabilities: [product, software]
active_artifact: FEATURE-CATALOG
artifact_state: READY_FOR_RELEASE
phase: Dia 7 concluído — release candidate sem promoção remota
last_release: none

## Current Goal

Revisar o release candidate da `SR-MVP-01` e, após decisão humana, definir a primeira small release demonstrável em `apps/web` para preview na Vercel.

## Blockers

- O projeto Supabase principal está `INACTIVE`; isso bloqueia migration, Auth e validação remota.
- Antes de integração/deploy remoto, o backend ainda precisa receber uma conexão PostgreSQL Supabase por gerenciador de segredos.
- Antes de mídia remota, o bucket e as policies de Storage precisam de autorização e validação próprias.

## Active Risks

- Escopo amplo exige preservar a sequência MVP → V6.
- Dados de medidas corporais e CRM exigem minimização e controles LGPD.
- Estoque, pagamento e webhooks exigem idempotência, consistência e rollback.
- Overrides transitivos de segurança devem ser reavaliados em toda atualização do Prisma e removidos quando o upstream incorporar os patches.
- Provedor de frete e hospedagem do backend ainda não foram selecionados.
- O CTA documentado com texto branco sobre `#8B5CF6` tem contraste calculado de 4,23:1; exige tratamento no gate de acessibilidade para texto normal.
- A página de status do Supabase ainda registrava em 2026-09-20 um incidente de rejeição de JWT; a integração Auth remota precisa ser revalidada após resolução.
- A paginação keyset usa o índice correto, mas o predicate `OR` emitido pelo Prisma filtrou 5.000 entradas em um cursor intermediário com 10.000 registros; ver `DEBT-PERF-001`.

## Current Context

- brief: `project-brief.md`
- requirements: `docs/product/prd.md` (`1.0`, `REQUIREMENTS_APPROVED`)
- architecture: `architecture.md` (`1.0`, `APPROVED`)
- active artifact: `docs/features/FEATURE-CATALOG/`
- validation: `docs/features/FEATURE-CATALOG/test-plan.md`, `docs/features/FEATURE-CATALOG/test-matrix.md`, `docs/features/FEATURE-CATALOG/fixtures.md`
- experience validation: `docs/features/FEATURE-CATALOG/experience-validation.md`
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
- Prisma 7 spike: `docs/features/FEATURE-CATALOG/prisma7-spike.md`
- superseded Prisma 8 evidence: `docs/features/FEATURE-CATALOG/prisma8-spike.md`
- sources: `docs/sources/source-map.md`
- design system: `design_system_purple_noir_loja_plus_size.md`

## Next Action

Revisar/mesclar o PR #6 e iniciar o discovery de uma small release `apps/web`
demonstrável na Vercel. Não reativar o Supabase, aplicar migration ou criar
Storage sem autorização específica.

## History

Não carregar automaticamente. Ver `docs/history/` e `docs/releases/`.
