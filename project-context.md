# Project Context

project: Plus Store
project_state: OPERATING
active_capabilities: [product, software]
active_artifact: FEATURE-WEB-PREVIEW
artifact_state: IN_PROGRESS
phase: Dia 4 concluído — expansão controlada e regressão integral validadas
last_release: none

## Current Goal

Aguardar aprovação para o hardening da `SR-WEB-PREVIEW-01` no Dia 5,
preservando o recorte demonstrativo e a ausência de integração remota.

## Blockers

- Não há bloqueio duro para o Dia 5 da preview web.
- O Supabase principal continua `INACTIVE`, bloqueando somente promoção remota
  do catálogo, Auth, migrations e Storage; a preview não depende desses recursos.

## Active Risks

- Escopo amplo exige preservar a sequência MVP → V6.
- Dados de medidas corporais e CRM exigem minimização e controles LGPD.
- Estoque, pagamento e webhooks exigem idempotência, consistência e rollback.
- Overrides transitivos de segurança devem ser reavaliados em toda atualização do Prisma e removidos quando o upstream incorporar os patches.
- Provedor de frete e hospedagem do backend ainda não foram selecionados.
- O CTA documentado com texto branco sobre `#8B5CF6` tem contraste calculado de 4,23:1; exige tratamento no gate de acessibilidade para texto normal.
- Conteúdo e assets demonstrativos podem ser confundidos com catálogo real se o
  disclosure, a ausência de preço/estoque e o `noindex` não forem preservados.
- Os quatro PNGs de origem da preview totalizam 6,745,439 bytes; `next/image`
  otimiza a entrega, mas `DEBT-WEB-001` registra a redução do artefato no Dia 5.
- Criar `apps/web` desativa o ignore atual da Vercel; o primeiro push de
  implementação já precisa compilar.
- A página de status do Supabase ainda registrava em 2026-09-20 um incidente de rejeição de JWT; a integração Auth remota precisa ser revalidada após resolução.
- A paginação keyset usa o índice correto, mas o predicate `OR` emitido pelo Prisma filtrou 5.000 entradas em um cursor intermediário com 10.000 registros; ver `DEBT-PERF-001`.

## Current Context

- brief: `project-brief.md`
- requirements: `docs/product/prd.md` (`1.0`, `REQUIREMENTS_APPROVED`)
- architecture: `architecture.md` (`1.0`, `APPROVED`)
- active artifact: `docs/features/FEATURE-WEB-PREVIEW/`
- active requirements: `docs/features/FEATURE-WEB-PREVIEW/feature-prd.md`
- active specification: `docs/features/FEATURE-WEB-PREVIEW/feature-spec.md`
- active validation: `docs/features/FEATURE-WEB-PREVIEW/test-plan.md`,
  `docs/features/FEATURE-WEB-PREVIEW/test-matrix.md`,
  `docs/features/FEATURE-WEB-PREVIEW/red-evidence.md`
- browser plan: `docs/features/FEATURE-WEB-PREVIEW/browser-verification.md`
- GREEN evidence: `docs/features/FEATURE-WEB-PREVIEW/green-evidence.md`
- Dia 4 evidence: `docs/features/FEATURE-WEB-PREVIEW/day4-evidence.md`
- asset provenance: `docs/features/FEATURE-WEB-PREVIEW/asset-provenance.md`
- previous artifact: `docs/features/FEATURE-CATALOG/` (`READY_FOR_RELEASE`)
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

Aguardar comando/aprovação humana para executar o Dia 5 da
`FEATURE-WEB-PREVIEW`. Não fazer merge, promover produção, reativar Supabase,
aplicar migration ou criar Storage automaticamente.

## History

Não carregar automaticamente. Ver `docs/history/` e `docs/releases/`.
