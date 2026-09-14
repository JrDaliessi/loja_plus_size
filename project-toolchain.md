# Project Toolchain

## Estado verificado em 2026-09-13

| Ferramenta | Exigido | Encontrado | Estado |
|---|---:|---:|---|
| Node.js | 24.11+ para o Prisma 8 RC atual | 22.14.0 | BLOQUEADO para scaffold |
| pnpm | linha atual compatível | 11.19.0 | disponível |
| Git | versão suportada | 2.48.1 | disponível |
| Repositório Git | inicializado | sim | disponível |
| Branch principal | `main` | `main` | disponível |
| Remote `origin` | GitHub | `https://github.com/JrDaliessi/loja_plus_size.git` | configurado |
| Supabase project ref | `olkadbgumpiybehslobk` | informado | endpoint e chave pública conhecidos; gestão sem permissão |

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

## Desbloqueio mínimo

Instalar/selecionar Node.js 24.11+ e confirmar `node --version` antes de gerar o monorepo. A mudança do runtime da máquina é externa ao repositório e requer ação ou autorização humana específica.
