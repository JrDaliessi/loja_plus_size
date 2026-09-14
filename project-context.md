# Project Context

project: Plus Store
project_state: REQUIREMENTS_READY
active_capabilities: [product, software]
active_artifact: FEATURE-CATALOG
artifact_state: REQUIREMENTS_READY
phase: Dia 1B executado — arquitetura e spec em revisão humana
last_release: none

## Current Goal

Obter aprovação humana da arquitetura, ADRs, modelo de domínio e Feature PRD/Spec da `SR-MVP-01`.

## Blockers

- HARD: Node.js local é 22.14.0; o Prisma 8 RC atual exige Node.js 24.11+ na linha 24 antes do scaffold.
- DECISION: Prisma 8 permanece RC; confirmar o pin exato no início da implementação.
- HARD antes de banco/migrations: o projeto Supabase `olkadbgumpiybehslobk` não está autorizado na conexão atual.

## Active Risks

- Escopo amplo exige preservar a sequência MVP → V6.
- Dados de medidas corporais e CRM exigem minimização e controles LGPD.
- Estoque, pagamento e webhooks exigem idempotência, consistência e rollback.
- Provedor de frete e hospedagem do backend ainda não foram selecionados.
- O CTA documentado com texto branco sobre `#8B5CF6` tem contraste calculado de 4,23:1; exige tratamento no gate de acessibilidade para texto normal.

## Current Context

- brief: `project-brief.md`
- requirements: `docs/product/prd.md` (`1.0`, `REQUIREMENTS_APPROVED`)
- architecture: `architecture.md` (`0.1-draft`, aguardando aprovação)
- active artifact: `docs/features/FEATURE-CATALOG/`
- relevant ADRs: `docs/adr/ADR-001-web-api-boundaries.md`, `docs/adr/ADR-002-supabase-data-boundary.md`, `docs/adr/ADR-003-prisma-8-conditional-adoption.md`
- quality gates: `quality-gates.md`
- stack: `project-stack.md`
- toolchain: `project-toolchain.md`
- repository: `https://github.com/JrDaliessi/loja_plus_size.git` (`origin`, branch `main`)
- infrastructure: `docs/infrastructure/supabase.md`
- sources: `docs/sources/source-map.md`
- design system: `design_system_purple_noir_loja_plus_size.md`

## Next Action

Revisar e aprovar o pacote do Dia 1B. Após aprovação, marcar `ARCHITECTURE_READY`/`SPEC_READY` e solicitar autorização explícita para o Dia 2.

## History

Não carregar automaticamente. Ver `docs/history/` e `docs/releases/`.
