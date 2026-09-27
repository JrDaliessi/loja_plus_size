# Test Plan — FEATURE-AWS-API-DEPLOY

Status: `IN_PROGRESS`; Dia 4 local GREEN e validação no runner Linux pendente.

## Objective

Validar a implantação em camadas, começando por contratos locais determinísticos
e deixando mutações AWS apenas para o gate remoto aprovado.

## Test Layers

1. **Application HTTP:** liveness e readiness com probe injetável.
2. **Runtime:** bind em `0.0.0.0:$PORT` e shutdown idempotente.
3. **Container contract:** versões fixadas, usuário não-root e contexto limpo.
4. **Database integration:** `SELECT 1` limitado pelo pool/timeout em PostgreSQL
   isolado; nunca no Supabase principal durante RED/GREEN local.
5. **CI security:** GitHub OIDC, scan e SBOM sem access keys permanentes.
6. **Static governance:** sem migrations no startup, segredos ou alvo produtivo
   em staging.
7. **Remote AWS:** identidade/custo/IAM/inventário antes da mutação; depois
   health, logs, smoke, canary, rollback e teardown.

## RED Suite

Arquivo:
`apps/api/src/features/deployment/tests/red/aws-deployment.red.spec.ts`.

| ID | Contrato | Estado esperado no Dia 2 |
|---|---|---|
| `AWS-HEALTH-001` | liveness 200 sem probe externo | RED — rota ausente |
| `AWS-HEALTH-002` | readiness 200 após probe | RED — rota ausente |
| `AWS-HEALTH-003` | readiness 503 genérico em falha | RED — rota ausente |
| `AWS-HEALTH-004` | probe parado falha dentro do timeout | RED — adapter ausente |
| `AWS-NET-001` | bind explícito em `0.0.0.0` | RED — bind não explícito |
| `AWS-LIFE-001` | shutdown concorrente executa uma vez | RED — seam/handler ausente |
| `AWS-IMG-001` | imagem pinada e não-root | RED — Dockerfile ausente |
| `AWS-IMG-002` | build context exclui segredos/estado | RED — `Dockerfile.dockerignore` ausente |
| `AWS-IMG-003` | build remove outputs antigos antes do bundle | RED — limpeza ausente |
| `AWS-CI-001` | OIDC, scan e SBOM | RED — workflow de deploy ausente |
| `AWS-CI-002` | build/smoke sem publicar imagem | RED — workflow ausente |
| `AWS-CI-003` | OIDC somente leitura, manual e protegido | RED — workflow ausente |
| `AWS-CI-004` | proíbe keys, push ECR e deploy ECS | RED — workflow ausente |
| `AWS-OBS-001` | log estruturado por allowlist | RED — telemetry ausente |
| `AWS-OBS-002` | telemetry instalada no entrypoint | RED — integração ausente |
| `AWS-MIG-001` | migration e `DIRECT_URL` fora do startup | GREEN guard |

## PostgreSQL/Supabase Rules

- health usa uma única consulta barata e não cria conexão por request;
- runtime usa pooler; tamanho do pool deve respeitar o plano e o máximo de tasks;
- timeout do probe é menor que o timeout do ALB e não possui retry longo;
- transaction pooling não pode depender de prepared statements nomeados;
- conexão idle/idle-in-transaction deve ser limitada no ambiente apropriado;
- nenhum teste do Dia 2 altera projeto Supabase remoto.

## Remote Gate Prerequisites

- conta, principal e região confirmados read-only;
- Supabase staging separado;
- orçamento e teto de tasks aprovados;
- ferramenta de IaC decidida;
- inventário/teardown e IAM revisados;
- autorização humana específica.

## Commands

```text
pnpm run type-check
pnpm run test:aws:red
```

O baseline do Dia 2 observou oito REDs e um guard verde. A escalada de contexto
do Dia 3 acrescentou `AWS-HEALTH-004`, corrigiu o path do ignore do Docker e,
após inspecionar o pacote, acrescentou `AWS-IMG-003` para impedir outputs
obsoletos. O GREEN local passa a cobrir dez comportamentos, preservando
`AWS-CI-001` para a expansão controlada.

No Dia 4, `AWS-CI-001..004` falharam pela ausência correta do workflow e
`AWS-OBS-001..002` falharam pela ausência da telemetry. Os 16 contratos locais
ficaram GREEN. A construção e o scan reais da imagem permanecem pendentes no
runner Linux, sem falso aceite local.
