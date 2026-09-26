---
id: SUPA-PROMOTE-2026-09-26
project_ref: olkadbgumpiybehslobk
status: COMPLETE
date: 2026-09-26
derived_from:
  - docs/infrastructure/supabase-revalidation-2026-09-26.md
  - apps/api/prisma/migrations/
affects:
  - docs/features/FEATURE-CATALOG/release-readiness.md
  - docs/releases/SR-MVP-01-catalog-release-candidate.md
---

# Supabase — promoção do schema do catálogo

## Escopo autorizado

O humano autorizou primeiro a promoção das duas migrations revisadas do catálogo
e, após a auditoria pós-promoção, autorizou separadamente a migration de
hardening do histórico do Prisma. O mecanismo canônico permaneceu Prisma
Migrate; nenhum segundo sistema de migrations foi utilizado.

Ficaram fora do escopo:

- provisionamento de usuários ou permissões no Supabase Auth;
- criação de bucket, policy ou objeto no Storage;
- implantação pública do backend NestJS;
- inserção de dados comerciais;
- configuração de observabilidade ou rate limiting em produção.

## Migrations aplicadas

| Ordem | Migration | Resultado |
|---:|---|---|
| 1 | `20260915052838_catalog_initial` | aplicada |
| 2 | `20260915053138_catalog_updated_at_defaults` | aplicada |
| 3 | `20260926214500_secure_prisma_migration_history` | aplicada |

A terceira migration tem SHA-256
`6DD6EF4A1F174A6258655848D37C568F0931FE4903CE0D2316E8BE92AA306CAC`.
O `prisma migrate status` final confirmou o schema remoto atualizado e as três
entradas concluídas, sem rollback.

## Finding pós-promoção e correção

A inspeção imediatamente após as duas primeiras migrations encontrou
`public._prisma_migrations` com RLS desabilitada e privilégios de
`SELECT`, `INSERT`, `UPDATE` e `DELETE` para `anon` e `authenticated`. O advisor
de segurança classificou o caso como `rls_disabled_in_public`.

O contrato `CAT-SEC-009` foi criado antes da correção e observado em RED no
PostgreSQL isolado. A migration de hardening então:

1. habilitou RLS em `public._prisma_migrations`;
2. revogou todos os privilégios de `PUBLIC`;
3. revogou explicitamente os privilégios de `anon` e `authenticated`.

O mesmo teste passou em GREEN antes da promoção e a consulta remota confirmou
RLS ativa e todos os quatro privilégios negados para os dois papéis.

## Estado remoto verificado

- 10/10 tabelas comerciais no schema privado `app` com RLS habilitada;
- zero grants comerciais para `PUBLIC`, `anon` ou `authenticated`;
- zero acesso de `anon`/`authenticated` ao histórico do Prisma;
- 10 chaves primárias, 12 chaves estrangeiras, 18 checks e 32 índices;
- zero buckets de Storage e zero dados comerciais promovidos;
- zero findings de severidade `ERROR` nos advisors de segurança;
- 11 findings informativos `rls_enabled_no_policy`, coerentes com o desenho
  deny-by-default sem acesso direto da Data API;
- 11 findings informativos `unused_index`, esperados enquanto o banco está
  vazio e sem tráfego representativo.

Os findings informativos não autorizam remover RLS ou índices. Eles deverão ser
reavaliados quando políticas explícitas ou dados representativos forem
introduzidos.

## Quality gates

- catálogo PostgreSQL: 8/8 testes;
- API: 16 suítes, 81 testes;
- web: 10 arquivos, 28 testes;
- type-check, lint e builds API/web: aprovados;
- auditorias completa e de produção: zero vulnerabilidades conhecidas;
- varredura de segredos em arquivos versionados: sem credenciais detectadas.

## Decisão de estado

O schema remoto do catálogo está promovido e protegido. A feature permanece
`READY_FOR_RELEASE`, não `RELEASED`, porque backend, Auth de staff, Storage e
observabilidade pública ainda não foram implantados e validados.
