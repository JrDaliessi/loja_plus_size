# FEATURE-AWS-API-DEPLOY Status

## Current State

- Small release: `SR-INFRA-API-01`
- Artifact state: `BLOCKED`
- Project state: `OPERATING`
- Phase: Dia 7 concluído em 2026-09-28; release candidate auditado e bloqueado

## Completed

- requisitos e 17 critérios de aceite definidos e aprovados;
- AWS ECS Express Mode/Fargate em `sa-east-1` selecionado no ADR-005;
- fronteiras Vercel → AWS → Supabase registradas;
- contratos de container, health, SIGTERM, pool, secrets, IAM/OIDC, logs, custo,
  rollback e teardown especificados;
- migrations no startup e compartilhamento casual do Supabase principal
  explicitamente proibidos;
- alternativas e custos operacionais documentados;
- inspeção do schema/migrations não encontrou uso de `ltree`, `pgcrypto`,
  `btree_gist` ou operadores customizados afetados pelo changelog PostgreSQL do
  Supabase de 2026-09-25.
- matriz liga 17/17 requisitos e critérios a validações primárias;
- fixtures sintéticas cobrem runtime, readiness, alvo AWS inválido e scanner;
- o baseline do Dia 2 materializou nove contratos executáveis;
- RED observado no Node.js 24.21.0: oito falhas corretas e um guard verde;
- type-check da API passou no runtime pinado;
- nenhum banco remoto, recurso AWS, container ou deployment foi acessado;
- liveness, readiness, timeout, bind e shutdown mínimos implementados;
- Dockerfile multi-stage não-root e ignore específico do contexto criados;
- build passou e o pacote runtime contém somente bundle, sourcemap e metadata;
- 10/10 contratos do slice local e 81/81 testes de regressão passaram;
- smoke HTTP confirmou `0.0.0.0:3101`, health verde e encerramento limpo;
- `AWS-CI-001` permaneceu RED ao fim do Dia 3 e abriu o slice do Dia 4;
- workflow de imagem implementado com build, smoke, Trivy e CycloneDX;
- OIDC definido apenas para disparo manual, ambiente protegido e role read-only;
- logs estruturados por allowlist e correlação foram integrados ao entrypoint;
- 16/16 contratos locais e 97/97 testes completos da API passaram;
- YAML, sete action pins e ausência de keys/push/deploy foram validados.
- PR #11 criado com três commits organizados na branch
  `codex/aws-api-deployment`;
- primeiro scan bloqueou quatro vulnerabilidades HIGH corrigíveis do npm
  embarcado na imagem runtime;
- contrato RED/GREEN e commit `1391c95` removeram npm/corepack do estágio final;
- build, smoke, Trivy e SBOM passaram no run `36320602513`;
- API Quality passou no run `36320602528`;
- o job OIDC foi explicitamente ignorado (`skipped`) pelo gatilho do PR.
- pool PostgreSQL explícito e limitado a cinco conexões por task;
- configuração de produção falha sem origens HTTPS explícitas e bloqueia
  Swagger público;
- CORS por allowlist e rate limit do catálogo por cliente/proxy foram validados;
- task futura aceita tráfego somente do security group do ALB;
- IAM, custos, digest imutável, rollback e teardown foram materializados em
  `docs/infrastructure/aws-hardening.yaml`;
- 8/8 contratos do Dia 5, 105/105 regressões e smoke do bundle ficaram verdes.
- build, smoke, Trivy e SBOM passaram no run `36356216865`;
- qualidade da API passou no run `36356216882`; OIDC permaneceu `skipped`.
- health e respostas `429` receberam `Cache-Control: no-store`;
- telemetria agora precede o rate limiter e preserva correlação de rejeições;
- preflight CORS permitido/negado e correlação insegura foram validados;
- smoke da imagem passou a verificar headers operacionais;
- runbook seguro de smoke, diagnóstico, rollback e teardown foi criado;
- 9/9 contratos do Dia 6 e 114/114 regressões ficaram verdes localmente.
- imagem, smoke, Trivy e SBOM passaram no run `36386913042`;
- API Quality passou no run `36386912961`; Vercel passou e OIDC ficou `skipped`.
- PR #13 foi integrado como `51d81f4`;
- workflows da `main` passaram nos runs `36425538715` e `36425538719`;
- auditoria final classificou 17 critérios em 7 PASS, 6 PARTIAL e 4 BLOCKED;
- release readiness, rollback e `SR-INFRA-API-01-RC1` foram materializados;
- nenhum ambiente remoto foi tratado como evidência por existir apenas no plano.

## Decisions

1. Vercel permanece no frontend.
2. ECS Express Mode/Fargate hospeda a API; Supabase continua dados/Auth/Storage.
3. Região inicial é `sa-east-1`.
4. AWS MCP será configurado somente quando necessário e começa read-only.
5. IaC permanece decisão humana aberta antes do primeiro ambiente durável.

## Blockers

### Antes de deploy remoto

- conta, perfil, região e identidade AWS ainda não foram validados;
- ambiente Supabase não produtivo ainda não foi selecionado;
- orçamento, limites de escala e estimativa de custo não foram aprovados;
- ferramenta de IaC ainda não foi escolhida.

## Evidence

- requisitos: `feature-prd.md`
- especificação: `feature-spec.md`
- decisão: `../../adr/ADR-005-aws-ecs-express-mode.md`
- contexto: `context.yaml`
- plano de testes: `test-plan.md`
- matriz: `test-matrix.md`
- fixtures: `fixtures.md`
- RED: `red-evidence.md`
- GREEN: `green-evidence.md`
- Dia 4: `day4-evidence.md`
- Dia 5: `day5-evidence.md`
- Dia 6: `day6-evidence.md`
- Dia 7: `day7-evidence.md`
- release readiness: `release-readiness.md`
- rollback: `rollback-plan.md`
- release candidate: `../../releases/SR-INFRA-API-01-release-candidate.md`

## Next Action

Resolver, nesta ordem, identidade AWS read-only, Supabase não produtivo,
FinOps/escala e decisão de IaC. Somente depois solicitar autorização separada
para criar o ambiente e completar os critérios remotos.
