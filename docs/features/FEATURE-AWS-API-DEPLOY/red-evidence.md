# RED Evidence — FEATURE-AWS-API-DEPLOY

Data: 2026-09-26  
Runtime: Node.js `24.21.0`  
Suite: `aws-deployment.red.spec.ts`

## Result

```text
Test Suites: 1 failed, 1 total
Tests:       8 failed, 1 passed, 9 total
```

## Expected Failures Observed

| Test | Evidence | Classification |
|---|---|---|
| `AWS-HEALTH-001` | `/health/live` retornou 404, esperado 200 | comportamento ausente |
| `AWS-HEALTH-002` | `/health/ready` retornou 404, esperado 200 | comportamento ausente |
| `AWS-HEALTH-003` | falha de readiness retornou 404, esperado 503 genérico | comportamento ausente |
| `AWS-NET-001` | `main.ts` usa `listen(config.port)` sem host explícito | comportamento ausente |
| `AWS-LIFE-001` | módulo `api-lifecycle` não existe | seam idempotente ausente |
| `AWS-IMG-001` | `apps/api/Dockerfile` não existe | artefato ausente |
| `AWS-IMG-002` | `apps/api/.dockerignore` não existe | artefato ausente |
| `AWS-CI-001` | `.github/workflows/api-deploy.yml` não existe | artefato ausente |

## Passing Guard

`AWS-MIG-001` passou: o startup não contém `DIRECT_URL`, `prisma migrate`,
`migrate deploy` ou `db push`.

## Configuration Evidence

- a suíte compilou e executou no runtime pinado;
- o type-check específico da API passou no Node.js `24.21.0`;
- fixtures são sintéticas e nenhum PostgreSQL/Supabase remoto foi acessado;
- nenhuma falha decorreu de Jest, SWC, imports existentes ou configuração de
  ambiente;
- nenhuma infraestrutura AWS, imagem ou custo foi criado.

## Interpretation

O RED é válido: cada falha aponta para comportamento ou artefato explicitamente
ausente e previsto na spec. O Dia 3 deve implementar apenas o mínimo para tornar
esses contratos verdes, sem adicionar deployment remoto.

## Day 3 Context Escalation

Antes da implementação, foi adicionado `AWS-HEALTH-004` para comprovar timeout
do probe e o contrato `AWS-IMG-002` passou a apontar para
`apps/api/Dockerfile.dockerignore`. O motivo é que o build usa a raiz do
monorepo como contexto; ver `docs/ai-lessons/AI-003-docker-build-context-contract.md`.

O dry-run do pacote também revelou outputs antigos em `dist/`. `AWS-IMG-003`
foi adicionado em RED para exigir limpeza determinística antes do bundle.
