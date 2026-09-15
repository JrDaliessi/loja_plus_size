# Project Context

project: Plus Store
project_state: ARCHITECTURE_READY
active_capabilities: [product, software]
active_artifact: FEATURE-CATALOG
artifact_state: VALIDATION_READY
phase: Dia 2 concluído — aguardando aprovação para Dia 3
last_release: none

## Current Goal

Obter decisão humana sobre o risco residual do CLI Prisma 8 RC e, se aceito, iniciar o Dia 3 da `SR-MVP-01` com implementação mínima GREEN.

## Blockers

- Nenhum bloqueio duro impede implementação local do Dia 3.
- Antes de integração/deploy remoto, o backend ainda precisa receber uma conexão PostgreSQL Supabase por gerenciador de segredos.
- Antes de mídia remota, o bucket e as policies de Storage precisam de autorização e validação próprias.

## Active Risks

- Escopo amplo exige preservar a sequência MVP → V6.
- Dados de medidas corporais e CRM exigem minimização e controles LGPD.
- Estoque, pagamento e webhooks exigem idempotência, consistência e rollback.
- O CLI Prisma `8.0.0-rc.15` possui quatro advisories altos apenas na árvore de desenvolvimento; a árvore de produção está sem vulnerabilidades conhecidas.
- Prisma 8 RC divergiu da documentação em `deleteCount()` e no shape do erro de unicidade; ver o spike registrado.
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
- Supabase baseline: `docs/infrastructure/supabase-baseline-2026-09-14.md`
- Prisma 8 spike: `docs/features/FEATURE-CATALOG/prisma8-spike.md`
- sources: `docs/sources/source-map.md`
- design system: `design_system_purple_noir_loja_plus_size.md`

## Next Action

Revisar o risco residual do CLI Prisma 8 RC e solicitar aprovação explícita para o Dia 3. Não aplicar migration no Supabase principal antes dessa aprovação.

## History

Não carregar automaticamente. Ver `docs/history/` e `docs/releases/`.
