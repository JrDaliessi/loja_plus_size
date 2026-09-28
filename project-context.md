# Project Context

project: Plus Store
project_state: OPERATING
active_capabilities: [product, software]
active_artifact: FEATURE-AWS-API-DEPLOY
artifact_state: BLOCKED
phase: Dia 7 concluído — SR-INFRA-API-01-RC1 auditado e bloqueado
last_release: SR-WEB-PREVIEW-01
last_release_candidate: SR-INFRA-API-01-RC1

## Current Goal

Desbloquear com segurança o ambiente AWS não produtivo sem apresentar o
candidato local como serviço implantado.

## Blockers

1. Validar identidade, conta e `sa-east-1` por AWS MCP/CLI read-only aprovado.
2. Selecionar Supabase não produtivo com credenciais e dados sintéticos próprios.
3. Aprovar estimativa, budget, alertas e teto de escala.
4. Escolher IaC e revisar políticas/inventário antes da primeira mutação.
5. Autorizar separadamente deployment, smoke CloudWatch e rollback remoto.

## Active Risks

- ECS/Fargate, ALB, IPv4, logs, scans e Secrets Manager geram custo.
- IAM/Secrets incorretos podem expor credenciais ou ampliar privilégios.
- Staging não pode reutilizar o Supabase principal por conveniência.
- Rate limit é por task até WAF/store distribuído; ver `DEBT-RATE-001`.
- Paginação profunda mantém `DEBT-PERF-001`; dependências mantêm duas dívidas LOW.
- A Vercel continua demonstrativa e não aponta para uma API AWS inexistente.

## Current Context

- brief: `project-brief.md`
- product requirements: `docs/product/prd.md`
- architecture: `architecture.md`, `docs/adr/ADR-005-aws-ecs-express-mode.md`
- active artifact: `docs/features/FEATURE-AWS-API-DEPLOY/`
- requirements/spec: `feature-prd.md`, `feature-spec.md`
- final evidence: `day7-evidence.md`, `release-readiness.md`, `rollback-plan.md`
- candidate: `docs/releases/SR-INFRA-API-01-release-candidate.md` (`BLOCKED`)
- infrastructure: `docs/infrastructure/aws.md`, `aws-hardening.yaml`,
  `aws-runbook.md`, `supabase.md`
- implementation: `apps/api`, `.github/workflows/api-deploy.yml`
- quality: `quality-gates.md`, `docs/technical-debt.md`
- CI baseline: API Quality `36425538715`; Image Verification `36425538719`
- repository: `https://github.com/JrDaliessi/loja_plus_size.git`; PR #13 merged
  as `51d81f4`; active branch `codex/aws-api-release-readiness`
- source map: `docs/sources/source-map.md`

## Next Action

Configurar o acesso AWS MCP/read-only e validar identidade, conta e região após
aprovação explícita. Não executar OIDC de deploy nem criar recurso nessa ação.

## History

Não carregar automaticamente. Ver `docs/history/`, `docs/releases/` e as
evidências versionadas do artefato.
