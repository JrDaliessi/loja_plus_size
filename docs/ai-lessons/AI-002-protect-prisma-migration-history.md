---
id: AI-002
title: Protect Prisma migration history on Supabase
status: ACTIVE
date: 2026-09-26
related_context:
  - docs/adr/ADR-002-supabase-data-boundary.md
  - docs/infrastructure/supabase-promotion-2026-09-26.md
affects:
  - apps/api/prisma/migrations/
  - apps/api/src/features/catalog/tests/red/catalog-postgres.red.spec.ts
---

# AI-002 — proteger o histórico do Prisma no Supabase

## Falha

A verificação inicial estava concentrada nas tabelas comerciais do schema
privado `app`. Após a primeira promoção, o Prisma materializou sua tabela de
histórico em `public`, schema exposto pela Data API do Supabase por padrão.

## Causa

Foi assumido incorretamente que revogar o acesso ao schema comercial cobriria
toda tabela criada pelo fluxo de migration. O PostgreSQL local também não
reproduzia os grants padrão que o Supabase concede aos papéis `anon` e
`authenticated`, portanto o risco não aparecia no gate local anterior.

## Impacto

`public._prisma_migrations` ficou temporariamente legível e mutável pelos papéis
da Data API após as duas primeiras migrations. Nenhum dado comercial existia,
mas adulterar o histórico poderia comprometer futuras promoções.

## Detecção e correção

O advisor pós-promoção e uma consulta explícita de privilégios detectaram o
problema. `CAT-SEC-009` reproduziu o estado inseguro em RED; a migration
`20260926214500_secure_prisma_migration_history` habilitou RLS e revogou todos
os privilégios públicos/Data API. O teste e a auditoria remota passaram depois.

## Prevenção

- toda implantação limpa deve inspecionar também tabelas auxiliares em `public`;
- RLS e privilégios de `_prisma_migrations` fazem parte do gate permanente;
- advisors devem ser executados após, não apenas antes, de migrations;
- um scan limitado ao schema de aplicação nunca é evidência suficiente de
  isolamento no Supabase;
- mudanças de localização da tabela de migrations exigem atualização simultânea
  do teste, da migration de hardening e da documentação.
