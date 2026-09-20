# Project Context

project: Plus Store
project_state: OPERATING
active_capabilities: [product, software]
active_artifact: FEATURE-CATALOG
artifact_state: QUALITY_VALIDATION
phase: Dia 6 concluído — aguardando aprovação para Dia 7
last_release: none

## Current Goal

Obter aprovação humana para o Dia 7 da `SR-MVP-01` e executar o gate final sem promover migrations, Storage ou deploy remoto sem autorização específica.

## Blockers

- Nenhum bloqueio duro impede a avaliação de qualidade local do Dia 7.
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

Solicitar aprovação explícita para o Dia 7. Não aplicar migration no Supabase principal nem criar bucket/policies de Storage sem autorização específica.

## History

Não carregar automaticamente. Ver `docs/history/` e `docs/releases/`.
