# Project Context

project: Plus Store
project_state: REQUIREMENTS_READY
active_capabilities: [product, software]
active_artifact: ARCHITECTURE
artifact_state: DISCOVERY
phase: Dia 1A aprovado — Dia 1B autorizado
last_release: none

## Current Goal

Definir a arquitetura proporcional, o domínio inicial e os contratos da `SR-MVP-01` sem iniciar implementação.

## Blockers

- HARD: Node.js local é 22.14.0; a stack aprovada exige Node.js 24 antes do scaffold.
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
- architecture: `architecture.md` (a criar após requisitos aprovados)
- active artifact: `docs/product/`
- relevant ADRs: none
- quality gates: `quality-gates.md`
- stack: `project-stack.md`
- toolchain: `project-toolchain.md`
- repository: `https://github.com/JrDaliessi/loja_plus_size.git` (`origin`, branch `main`)
- infrastructure: `docs/infrastructure/supabase.md`
- sources: `docs/sources/source-map.md`
- design system: `design_system_purple_noir_loja_plus_size.md`

## Next Action

Executar o Dia 1B com arquitetura, ADRs necessários, domínio e feature PRD/spec de `SR-MVP-01`; depois solicitar aprovação antes do Dia 2.

## History

Não carregar automaticamente. Ver `docs/history/` e `docs/releases/`.
