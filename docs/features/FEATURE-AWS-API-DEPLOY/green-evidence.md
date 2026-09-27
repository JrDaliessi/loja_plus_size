# GREEN Evidence — FEATURE-AWS-API-DEPLOY Day 3

Data: 2026-09-27  
Runtime: Node.js `24.21.0`  
Scope: implementação mínima local, sem AWS ou Supabase remoto

## Implemented

- `GET /health/live` sem acesso a dependência externa;
- `GET /health/ready` com probe injetável e resposta genérica `503` em falha;
- probe PostgreSQL com timeout de 1 segundo e `SELECT 1` pelo Prisma existente;
- bind explícito em `0.0.0.0:$PORT`;
- shutdown idempotente, fechando Nest e Prisma uma única vez;
- Dockerfile multi-stage com Node 24.21.0, pnpm 11.19.0 e usuário não-root;
- `Dockerfile.dockerignore` alinhado ao contexto raiz do monorepo;
- build limpa `dist/` antes de produzir o bundle;
- pacote runtime restringido a `dist` e dependências de produção.

## Automated Evidence

```text
Day 3 slice: 10 passed, 1 skipped (AWS-CI-001)
Catalog regression: 81 passed, 81 total
Type-check: passed
Lint: passed
Build: passed — dist/main.js 86.6 kB
```

O teste completo da feature apresenta `10 passed / 1 failed`: a única falha é
`AWS-CI-001`, deliberadamente preservada para o Dia 4, quando entram OIDC,
scanner e SBOM.

## Runtime Smoke

Ambiente sintético:

- banco: `127.0.0.1:55432/plus_store_day2_test`;
- Supabase URL/key: placeholders não reais;
- porta: `3101`.

Resultados:

```text
GET /health/live  -> 200 {"status":"ok"}
GET /health/ready -> 200 {"status":"ready"}
listener          -> 0.0.0.0:3101
after Ctrl+C      -> zero listeners
```

As três migrations já estavam aplicadas somente no PostgreSQL local. Uma
tentativa inicial de regressão foi interrompida antes da execução porque o
ambiente continha `DIRECT_URL` remoto; a execução válida sobrescreveu o alvo
explicitamente com `127.0.0.1`.

## Packaging Evidence

`pnpm pack --dry-run` lista somente:

```text
dist/main.js
dist/main.js.map
package.json
```

A primeira inspeção revelou testes/outputs antigos em `dist`; o novo contrato
`AWS-IMG-003` falhou antes da correção e passou depois que o build recebeu
limpeza determinística.

## Honest Limitations

- Docker CLI/daemon não está instalado neste host; a imagem não foi construída
  nem executada localmente.
- `pnpm deploy` não pôde concluir no sandbox porque tentou consultar o registry;
  o pacote foi validado por `pack --dry-run`.
- SIGINT foi exercitado no Windows; SIGTERM real deve ser comprovado no runner
  Linux/container.
- workflow OIDC/scan/SBOM continua RED e pertence ao Dia 4.
- nenhum scanner, ECR, ECS, IAM, Secrets Manager ou CloudWatch foi acionado.

## Conclusion

O slice local está GREEN e a regressão existente permaneceu verde. A feature
continua `IN_PROGRESS` até a validação real da imagem e da cadeia CI/container.
