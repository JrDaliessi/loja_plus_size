# Project Toolchain

## Estado verificado em 2026-09-14

| Ferramenta | Exigido | Encontrado | Estado |
|---|---:|---:|---|
| Node.js | 24.11+ na linha 24 para o Prisma 8 RC atual | 24.21.0 via `pnpm env`; 22.14.0 permanece como default do sistema | disponível quando `PNPM_HOME` precede o PATH |
| pnpm | linha atual compatível | 11.19.0 | disponível |
| Git | versão suportada | 2.48.1 | disponível |
| Repositório Git | inicializado | sim | disponível |
| Branch principal | `main` | `main` | disponível |
| Remote `origin` | GitHub | `https://github.com/JrDaliessi/loja_plus_size.git` | configurado |
| Supabase project ref | `olkadbgumpiybehslobk` | acesso MCP confirmado | baseline somente leitura concluído |
| PostgreSQL de testes | 17+ isolado | 17.4 em `127.0.0.1:55432/plus_store_day2_test` | validado |
| Prisma CLI | 8 RC pinada | `8.0.0-rc.15` | spike validado; risco dev documentado |
| Prisma PostgreSQL runtime | 8 RC pinada | `8.0.0-rc.11` | CRUD/transação validados |

## Ferramentas planejadas

- Gerenciamento: pnpm Workspaces.
- Orquestração: Turborepo.
- Qualidade: ESLint, Prettier, TypeScript strict, testes e build.
- Frontend: Next.js CLI e shadcn CLI apenas após versões fixadas.
- Backend: Nest CLI somente se o scaffold gerado respeitar a arquitetura aprovada.
- Banco: Prisma 8 CLI, Supabase CLI e SQL revisado.
- E2E: Playwright.
- CI: GitHub Actions.

## Política de dependências

- Fixar versões concretas no bootstrap técnico e commitar `pnpm-lock.yaml`.
- Verificar documentação/changelog antes de usar Next.js, Prisma ou Supabase.
- Não executar `latest` sem registrar no lockfile a versão resolvida.
- Não adicionar Redis, BullMQ, Stripe, Typesense ou Meilisearch antes do backlog correspondente.
- Não armazenar segredos no Git; fornecer somente `.env.example` sem valores sensíveis.

## Comandos-alvo dos quality gates

Os nomes finais serão materializados junto ao scaffold:

```text
pnpm lint
pnpm type-check
pnpm test
pnpm test:e2e
pnpm build
```

Turborepo deverá declarar dependências e outputs corretos, permitir dry-run e evitar cache em tarefas persistentes ou mutáveis.

## Runtime selecionado

- Node.js `24.21.0` foi instalado por `pnpm env` após autorização humana.
- `.node-version` fixa a versão do projeto.
- `package.json` exige a linha Node 24 e `.npmrc` aplica `engine-strict=true`.
- O Node 22.14.0 global não foi removido; comandos automatizados devem selecionar o runtime do `PNPM_HOME`.
- O pnpm do projeto permanece fixado em `11.19.0`.

## Pré-requisitos remanescentes

- fornecer a conexão PostgreSQL do backend pelo gerenciador de segredos antes de integração/deploy remoto;
- criar bucket/policies de Storage somente na release autorizada;
- reauditar a árvore de desenvolvimento do CLI Prisma antes do release.
