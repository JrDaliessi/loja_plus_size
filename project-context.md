# Project Context

project: Plus Store
project_state: OPERATING
active_capabilities: [product, software]
active_artifact: FEATURE-AWS-API-DEPLOY
artifact_state: IN_PROGRESS
phase: Dia 4 da implantação AWS concluído — runner Linux GREEN
last_release: SR-WEB-PREVIEW-01
last_release_candidate: SR-WEB-PREVIEW-01-RC1

## Current Goal

Preparar o gate humano do Dia 5 para hardening de imagem, IAM, pool, custo e
rollback, preservando a proibição de deploy remoto e execução OIDC.

## Blockers

- Antes de deploy remoto: validar conta/perfil/região AWS, escolher um Supabase
  não produtivo, aprovar custos/limites e decidir o mecanismo de IaC.
- Nenhum recurso AWS ou custo foi criado; AWS MCP ainda não está configurado.

## Active Risks

- Escopo amplo exige preservar a sequência MVP → V6.
- Dados de medidas corporais e CRM exigem minimização e controles LGPD.
- Estoque, pagamento e webhooks exigem idempotência, consistência e rollback.
- Overrides transitivos de segurança devem ser reavaliados em toda atualização do Prisma e removidos quando o upstream incorporar os patches.
- ECS/Fargate, ALB, CloudWatch e tráfego geram custo mesmo com baixa utilização.
- IAM/Secrets mal configurados podem expor credenciais ou ampliar privilégios.
- Conectar staging ao Supabase principal violaria isolamento de ambientes.
- Conteúdo e assets demonstrativos podem ser confundidos com catálogo real se o
  disclosure, a ausência de preço/estoque e o `noindex` não forem preservados.
- A preview demonstrativa está publicada em `https://loja-plus-size.vercel.app`
  pelo deployment `dpl_jQHa6UPru2CMbYZfXp8Q6kPLL7v4`.
- A página de status do Supabase ainda registrava em 2026-09-20 um incidente de rejeição de JWT; a integração Auth remota precisa ser revalidada após resolução.
- A paginação keyset usa o índice correto, mas o predicate `OR` emitido pelo Prisma filtrou 5.000 entradas em um cursor intermediário com 10.000 registros; ver `DEBT-PERF-001`.
- Os advisors remotos reportam somente findings informativos: tabelas com RLS e
  sem policies, coerentes com deny-by-default, e índices ainda sem uso no banco vazio.

## Current Context

- brief: `project-brief.md`
- requirements: `docs/product/prd.md` (`1.0`, `REQUIREMENTS_APPROVED`)
- architecture: `architecture.md` (`1.0`, `APPROVED`)
- active artifact: `docs/features/FEATURE-AWS-API-DEPLOY/` (`IN_PROGRESS`)
- active requirements: `docs/features/FEATURE-AWS-API-DEPLOY/feature-prd.md`
- active specification: `docs/features/FEATURE-AWS-API-DEPLOY/feature-spec.md`
- active validation: `docs/features/FEATURE-AWS-API-DEPLOY/test-plan.md`,
  `docs/features/FEATURE-AWS-API-DEPLOY/test-matrix.md`,
  `docs/features/FEATURE-AWS-API-DEPLOY/red-evidence.md`,
  `docs/features/FEATURE-AWS-API-DEPLOY/green-evidence.md`,
  `docs/features/FEATURE-AWS-API-DEPLOY/day4-evidence.md`
- active status: `docs/features/FEATURE-AWS-API-DEPLOY/status.md`
- previous release: `docs/releases/SR-WEB-PREVIEW-01.md`
- release candidate: `docs/releases/SR-MVP-01-catalog-release-candidate.md`
- release readiness: `docs/features/FEATURE-CATALOG/release-readiness.md`
- rollback: `docs/features/FEATURE-CATALOG/rollback-plan.md`
- implementation: `apps/api/src/features/catalog/`, `apps/api/src/shared/health/`,
  `apps/api/src/shared/runtime/`, `apps/api/src/main.ts`, `apps/api/src/app.module.ts`,
  `apps/api/src/shared/observability/`, `apps/api/Dockerfile`,
  `.github/workflows/api-deploy.yml`
- database schema: `apps/api/prisma/schema.prisma`, `apps/api/prisma/migrations/`
- relevant ADRs: `docs/adr/ADR-001-web-api-boundaries.md`, `docs/adr/ADR-002-supabase-data-boundary.md`, `docs/adr/ADR-004-prisma-7-stable-adoption.md`, `docs/adr/ADR-005-aws-ecs-express-mode.md`
- quality gates: `quality-gates.md`
- technical debt: `docs/technical-debt.md`
- CI: `.github/workflows/api-quality.yml`
- stack: `project-stack.md`
- toolchain: `project-toolchain.md`
- repository: `https://github.com/JrDaliessi/loja_plus_size.git` (`origin`, branch `codex/aws-api-deployment`, PR `#11`)
- infrastructure: `docs/infrastructure/supabase.md`, `docs/infrastructure/aws.md`
- Supabase baseline: `docs/infrastructure/supabase-baseline-2026-09-14.md`
- Supabase revalidation: `docs/infrastructure/supabase-revalidation-2026-09-26.md`
- Supabase promotion: `docs/infrastructure/supabase-promotion-2026-09-26.md`
- active AI lessons: `docs/ai-lessons/AI-002-protect-prisma-migration-history.md`,
  `docs/ai-lessons/AI-003-docker-build-context-contract.md`
- Prisma 7 spike: `docs/features/FEATURE-CATALOG/prisma7-spike.md`
- superseded Prisma 8 evidence: `docs/features/FEATURE-CATALOG/prisma8-spike.md`
- sources: `docs/sources/source-map.md`
- design system: `design_system_purple_noir_loja_plus_size.md`

## Next Action

Aguardar comando humano para iniciar o Dia 5. Manter
`validate-aws-identity` sem execução até aprovação própria.

## History

Não carregar automaticamente. Ver `docs/history/` e `docs/releases/`.
