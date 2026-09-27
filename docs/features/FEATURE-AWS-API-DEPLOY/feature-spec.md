---
id: FSPEC-AWSAPI001
feature: FEATURE-AWS-API-DEPLOY
status: SPEC_READY
version: 1.0
date: 2026-09-26
requirements_covered: FPRD-AWSAPI001-RQ-001..017
---

# Feature Spec — API NestJS na AWS

## Architecture Impact

```text
Vercel / Next.js
       │ HTTPS
       ▼
AWS ECS Express Mode — sa-east-1
  ALB/TLS → Fargate task → NestJS container
             │                ├─ CloudWatch logs/alarms
             │                └─ Secrets Manager + IAM
             ▼
Supabase não produtivo — São Paulo
  PostgreSQL pooled / Auth / Storage conforme release própria
```

ECS Express Mode cria e gerencia a composição inicial de ECS/Fargate, load
balancer, HTTPS, health check, autoscaling e observabilidade. O inventário dos
recursos subjacentes continua obrigatório.

## Affected Modules

- `apps/api/src/main.ts`: bind explícito e shutdown idempotente;
- `apps/api/src/shared/health/`: casos de uso/ports e apresentação HTTP;
- `apps/api/src/shared/config/`: validação de timeout e metadados não secretos;
- `apps/api/Dockerfile` e `apps/api/Dockerfile.dockerignore`, usando a raiz do
  monorepo como contexto de build;
- `.github/workflows/`: build/scan e, após aprovação, deploy por OIDC;
- `docs/infrastructure/aws.md`: runbook, custos, IAM, inventário e teardown.

## Container Contract

1. Multi-stage build com versões fixadas pelo repositório.
2. Contexto mínimo; `.env*`, Git, testes, caches e arquivos locais não entram.
3. Runtime contém somente o bundle e dependências indispensáveis, executa como
   UID/GID não-root e possui filesystem somente leitura quando compatível.
4. `NODE_ENV=production`; nenhum valor de ambiente é copiado no build.
5. `node dist/main.js` é o único processo da aplicação.
6. Arquitetura inicial `x86_64`; `ARM64` só entra após validar Prisma/native
   dependencies e comparar custo em nova decisão operacional.

## Runtime and Health Contracts

- `HOST` efetivo: `0.0.0.0`; `PORT` vem do ambiente.
- `GET /health/live`: `200 { "status": "ok" }`, sem I/O externo.
- `GET /health/ready`: executa consulta mínima (`SELECT 1`) pela mesma camada
  Prisma/adapter usada pelo runtime, com timeout curto e sem retry longo.
- falha de readiness retorna `503` e corpo genérico; stack, host, credencial e
  SQL nunca são serializados.
- ALB usa `/health/ready`; o intervalo não pode saturar o pool.
- sinais `SIGTERM`/`SIGINT` convergem para um único shutdown: marcar draining,
  fechar HTTP/Nest, desconectar Prisma e sair dentro do timeout da task.

## Data and Migration Contract

- runtime: `DATABASE_URL` pooled do ambiente correspondente;
- operação/CI aprovada: `DIRECT_URL` somente no job de migration;
- startup não chama `prisma migrate deploy`, `db push` ou SQL mutável;
- migrations são uma etapa separada, com status, backup/recuperação e aprovação;
- staging exige Supabase separado ou branch aprovada, sem dados reais;
- PostgreSQL, Auth e Storage não serão duplicados na AWS nesta release.

## AWS Resource Contract

| Recurso | Contrato |
|---|---|
| Região | `sa-east-1` |
| ECR | repositório privado, scan, tags imutáveis e lifecycle policy |
| ECS Express Mode | serviço Fargate com URL HTTPS, health check e rollback |
| Compute | dimensionamento inicial e limites aprovados após medição da imagem |
| Scaling | mínimo/máximo explícitos; máximo padrão amplo não é aceito silenciosamente |
| Secrets Manager | valores runtime; rotação/owner documentados |
| IAM | execution role, infrastructure role e deploy role separadas |
| GitHub | OIDC com `sub` restrito ao repositório/branch/environment |
| CloudWatch | JSON, retenção limitada, alarme de 5xx/unhealthy/deployment failure |
| Cost | Budget/alerta, tags `project`, `environment`, `owner`, `managed-by` |

## Public Edge Policy

- produção permite somente origens Vercel aprovadas quando o browser chamar a
  API diretamente; preview não recebe wildcard com credenciais;
- endpoints administrativos permanecem protegidos pelo contrato Supabase Auth;
- listagem pública recebe rate limit antes da integração comercial;
- Swagger fica desabilitado ou protegido em produção até decisão explícita;
- headers e erros não identificam framework ou detalhes internos.

## CI/CD Sequence

```text
lint/type-check/test/build
→ build container sem secrets
→ smoke local + health + SIGTERM
→ scanner + SBOM
→ push ECR por OIDC (após aprovação)
→ deploy por digest
→ aguardar estabilidade/health
→ smoke correlacionado
→ promover ou rollback
```

O mecanismo de IaC (`Terraform`, `CDK` ou configuração ECS exportável) será
escolhido por decisão humana antes do primeiro ambiente durável. Console manual
sem registro não atende ao gate de release.

## Observability

- logs JSON com timestamp, level, service, environment, revision e
  `correlationId`;
- allowlist de campos; Authorization, cookies, connection strings, tokens, PII e
  corpos sensíveis são redigidos;
- alarmes mínimos: target unhealthy, 5xx, deployment failure e custo;
- smoke usa correlation ID conhecido para provar o caminho ponta a ponta;
- Sentry continua planejado e não é pré-requisito para o primeiro smoke.

## Rollback and Teardown

- manter ao menos a última imagem saudável endereçável por digest;
- falha de health/smoke aciona rollback da revisão, sem migration destrutiva;
- mudanças de banco incompatíveis exigem expand/contract e plano próprio;
- runbook lista recursos, dependências e ordem de remoção;
- teardown deve preservar logs/evidência necessária e nunca remover Supabase ou
  Vercel fora do escopo.

## Validation Strategy for Day 2

1. Derivar matriz 17/17 requisito → critério → teste/evidência.
2. Escrever REDs para bind/PORT, liveness, readiness, timeout e SIGTERM.
3. Criar teste de contrato que proíba migration no startup e segredo no contexto
   de imagem.
4. Criar smoke de container isolado com PostgreSQL de testes existente.
5. Definir scanner/SBOM e validação de Dockerfile não-root.
6. Definir testes estáticos de workflow OIDC/IAM sem publicar imagem.
7. Definir checklist remoto, custo, rollback e teardown sem criar recursos.

## Definition of Done

- 17/17 ACs verdes e rastreados;
- pipeline obrigatório verde e imagem escaneada;
- alvo Supabase isolado, custo e limites aprovados;
- deploy remoto estável, observável e reversível;
- documentação, inventário, evidências e contexto atualizados;
- integração Vercel permanece uma small release separada.
