# Project Context

project: Plus Store
project_state: ARCHITECTURE_READY
active_capabilities: [product, software]
active_artifact: FEATURE-CATALOG
artifact_state: BLOCKED
phase: Dia 2 em execução — RED unitário confirmado, integração bloqueada
last_release: none

## Current Goal

Desbloquear o baseline Supabase e um PostgreSQL isolado para concluir os sete testes de integração pendentes da `SR-MVP-01`.

## Blockers

- HARD: o projeto Supabase `olkadbgumpiybehslobk` continua ausente da conexão atual; baseline, Storage e Data API não podem ser validados.
- HARD: PostgreSQL 13/17 existe localmente, mas exige credencial indisponível; não há Docker nem branch Supabase isolada autorizada para testes destrutivos/concorrentes.
- HARD antes de persistence: Prisma 8 permanece RC; CLI `8.0.0-rc.15` e adapter `@prisma/orm-postgres@8.0.0-rc.11` ainda exigem spike conjunto.

## Active Risks

- Escopo amplo exige preservar a sequência MVP → V6.
- Dados de medidas corporais e CRM exigem minimização e controles LGPD.
- Estoque, pagamento e webhooks exigem idempotência, consistência e rollback.
- Provedor de frete e hospedagem do backend ainda não foram selecionados.
- O CTA documentado com texto branco sobre `#8B5CF6` tem contraste calculado de 4,23:1; exige tratamento no gate de acessibilidade para texto normal.

## Current Context

- brief: `project-brief.md`
- requirements: `docs/product/prd.md` (`1.0`, `REQUIREMENTS_APPROVED`)
- architecture: `architecture.md` (`1.0`, `APPROVED`)
- active artifact: `docs/features/FEATURE-CATALOG/`
- validation: `docs/features/FEATURE-CATALOG/test-plan.md`, `docs/features/FEATURE-CATALOG/test-matrix.md`, `docs/features/FEATURE-CATALOG/fixtures.md`
- relevant ADRs: `docs/adr/ADR-001-web-api-boundaries.md`, `docs/adr/ADR-002-supabase-data-boundary.md`, `docs/adr/ADR-003-prisma-8-conditional-adoption.md`
- quality gates: `quality-gates.md`
- stack: `project-stack.md`
- toolchain: `project-toolchain.md`
- repository: `https://github.com/JrDaliessi/loja_plus_size.git` (`origin`, branch `main`)
- infrastructure: `docs/infrastructure/supabase.md`
- sources: `docs/sources/source-map.md`
- design system: `design_system_purple_noir_loja_plus_size.md`

## Next Action

Adicionar a conta conectada ao projeto Supabase e escolher um banco de testes isolado. Depois executar baseline read-only, completar os sete testes de integração e revalidar o gate do Dia 2.

## History

Não carregar automaticamente. Ver `docs/history/` e `docs/releases/`.
