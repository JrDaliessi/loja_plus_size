# Project Toolchain

## Estado verificado em 2026-09-20

| Ferramenta | Exigido | Encontrado | Estado |
|---|---:|---:|---|
| Node.js | linha 24 LTS | 24.21.0 via `pnpm env`; 22.14.0 permanece como default do sistema | disponível quando `PNPM_HOME` precede o PATH |
| pnpm | linha atual compatível | 11.19.0 | disponível |
| Git | versão suportada | 2.48.1 | disponível |
| Repositório Git | inicializado | sim | disponível |
| Branch principal | `main` | `main` | disponível |
| Remote `origin` | GitHub | `https://github.com/JrDaliessi/loja_plus_size.git` | configurado |
| Supabase project ref | `olkadbgumpiybehslobk` | acesso MCP confirmado | baseline somente leitura concluído |
| PostgreSQL de testes | 17+ isolado | 17.4 em `127.0.0.1:55432/plus_store_day2_test` | validado |
| Prisma CLI | 7 estável pinada | `7.10.0` | validado com Node 24.21.0 |
| Prisma Client/adapter PostgreSQL | 7 estável pinada | `@prisma/client 7.10.0`, `@prisma/adapter-pg 7.10.0`, `pg 8.23.0` | CRUD, P2002 e transação validados |
| ESLint | estável compatível com Node 24 | `eslint 10.10.0`, `@eslint/js 10.0.1`, `typescript-eslint 8.70.0` | lint verde |
| NestJS/OpenAPI | estável atual | `@nestjs/core 12.0.3`, `@nestjs/swagger 12.0.1` | HTTP e OpenAPI validados |
| Supabase JS | estável atual | `@supabase/supabase-js 2.116.0` | adapter `getClaims` e Storage validados localmente |
| Express rate limit | estável atual | `express-rate-limit 8.7.0` | catálogo público validado por cliente atrás de proxy confiável |
| Zod | estável atual | `4.6.5` | request e JSON Schema sincronizados |
| esbuild | estável atual | `0.28.2` | bundle Node ESM executável validado |
| GitHub Actions | actions oficiais fixadas por SHA | checkout `v7.0.1`, pnpm/setup `v2.1.0` | pipeline API materializado |
| Docker Actions | versões fixadas por SHA | setup-buildx `v4.1.0`, build-push `v7.4.0` | build/smoke verdes no run `36320602513` |
| Trivy Action | versão fixada por SHA | `0.35.0` | scan/SBOM verdes no run `36320602513` |
| AWS credentials Action | versão fixada por SHA | `v6.3.0` | OIDC read-only manual; não executado |

## Ferramentas planejadas

- Gerenciamento: pnpm Workspaces.
- Orquestração: Turborepo.
- Qualidade: ESLint e TypeScript strict materializados; Prettier entra apenas quando houver gate de formatação aprovado.
- Frontend: Next.js CLI e shadcn CLI apenas após versões fixadas.
- Backend: NestJS 12 materializado sem scaffold monolítico; composição permanece fora do domínio.
- Banco: Prisma 7 CLI, `@prisma/adapter-pg`, Supabase CLI e SQL revisado.
- E2E: Playwright.
- CI: GitHub Actions.
- Container: Docker/BuildKit multi-stage, scanner e SBOM, após testes RED do Dia 2.
- AWS: CLI v2 e AWS MCP somente quando necessários; primeira conexão read-only.
- Runtime remoto: ECR + ECS Express Mode/Fargate em `sa-east-1`.
- Autenticação CI: GitHub OIDC; access keys permanentes são proibidas.
- IaC: decisão humana pendente entre Terraform, CDK ou configuração exportável.

## Política de dependências

- Fixar versões concretas no bootstrap técnico e commitar `pnpm-lock.yaml`.
- Verificar documentação/changelog antes de usar Next.js, Prisma ou Supabase.
- Não executar `latest` sem registrar no lockfile a versão resolvida.
- Não adicionar Redis, BullMQ, Stripe, Typesense ou Meilisearch antes do backlog correspondente.
- Não armazenar segredos no Git; fornecer somente `.env.example` sem valores sensíveis.
- Overrides transitivos atuais: `deepmerge-ts 8.0.0`, `lodash 4.18.1`,
  `mysql2 3.23.1` e `pg 8.23.0`; todos exigem regressão e auditoria ao mudar
  Prisma.
- Scripts de instalação permitidos somente para dependências justificadas:
  `@swc/core`, `esbuild`, `unrs-resolver`, `prisma` e `@prisma/engines`.

## Comandos-alvo dos quality gates

Comandos já materializados no workspace:

```text
pnpm lint
pnpm type-check
pnpm test
pnpm test:coverage
pnpm build
```

O entrypoint HTTP já possui testes de integração via NestJS/Supertest e smoke do
bundle; um comando E2E separado entra apenas quando houver ambiente externo.

`test:coverage` aplica thresholds globais de 80% para statements, lines e
functions e 60% para branches. `.github/workflows/api-quality.yml` reproduz os
gates com Node 24.21.0, pnpm 11.19.0 e PostgreSQL 17 isolado.

Turborepo deverá declarar dependências e outputs corretos, permitir dry-run e evitar cache em tarefas persistentes ou mutáveis.

## Runtime selecionado

- Node.js `24.21.0` foi instalado por `pnpm env` após autorização humana.
- `.node-version` fixa a versão do projeto.
- `package.json` exige a linha Node 24 e `.npmrc` aplica `engine-strict=true`.
- O Node 22.14.0 global não foi removido; comandos automatizados devem selecionar o runtime do `PNPM_HOME`.
- O pnpm do projeto permanece fixado em `11.19.0`.

## Pré-requisitos remanescentes

- validar identidade/conta/região AWS em modo read-only antes de qualquer mutação;
- selecionar alvo Supabase não produtivo e fornecer `DATABASE_URL` pooled pelo Secrets Manager;
- aprovar estimativa de custo, budget, retenção e limites de escala;
- decidir o mecanismo de IaC antes do primeiro ambiente AWS durável;
- criar bucket/policies de Storage somente na release autorizada;
- reauditar a árvore completa e os overrides transitivos em toda atualização do Prisma.
