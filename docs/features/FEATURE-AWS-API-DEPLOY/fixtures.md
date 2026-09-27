# Fixtures — FEATURE-AWS-API-DEPLOY

Todas as fixtures são sintéticas. Elas não autorizam conexão externa.

## Runtime Environment

```ini
DATABASE_URL=postgresql://test_user:test_password@127.0.0.1:55432/plus_store_aws_test
SUPABASE_URL=https://example.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_test_only_not_a_real_key
SUPABASE_STORAGE_BUCKET=product-media-test
PORT=3101
NODE_ENV=production
DATABASE_POOL_MAX=5
DATABASE_POOL_CONNECTION_TIMEOUT_MS=3000
DATABASE_POOL_IDLE_TIMEOUT_MS=10000
DATABASE_POOL_MAX_LIFETIME_SECONDS=300
API_ALLOWED_ORIGINS=https://loja-plus-size.vercel.app
API_RATE_LIMIT_WINDOW_MS=60000
API_RATE_LIMIT_MAX=60
API_TRUST_PROXY_HOPS=1
API_SWAGGER_ENABLED=false
```

`DIRECT_URL` não faz parte da task/runtime fixture.

## Readiness Outcomes

| Fixture | Probe | HTTP esperado |
|---|---|---|
| `database-ready` | resolve uma vez dentro do timeout | `200 {"status":"ready"}` |
| `database-unavailable` | rejeita com detalhe sensível sintético | `503 {"status":"unavailable"}` sem detalhe |
| `database-timeout` | não resolve dentro do limite | `503` dentro do orçamento do ALB |

## AWS Planning Fixture

```yaml
account_id: "000000000000"
region: sa-east-1
environment: staging
repository: JrDaliessi/loja_plus_size
image_digest: sha256:0000000000000000000000000000000000000000000000000000000000000000
minimum_tasks: pending_human_approval
maximum_tasks: pending_human_approval
monthly_budget_brl: pending_human_approval
```

O account ID e o digest são placeholders deliberadamente inválidos.

## Secret Scanner Corpus

- valores `AKIA...`, private keys, JWTs e connection strings reais devem falhar;
- nomes de variáveis e placeholders sintéticos devem passar;
- logs de erro do readiness usam allowlist, nunca interpolação da exceção.
