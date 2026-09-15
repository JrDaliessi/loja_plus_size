---
id: ADR-004
status: accepted
date: 2026-09-15
affects: [apps/api, database, migrations, testing, ci]
derived_from: [ADR-003, prisma-release-status-2026-09-15, human-decision-2026-09-15]
supersedes: ADR-003
---

# ADR-004 — Adoção do Prisma 7 estável

## Context

O Prisma 8 permanece Release Candidate e ainda pode mudar antes da versão
final. A documentação oficial mantém Prisma 7 suportado para produção. O spike
do Dia 2 também comprovou divergências e dependências vulneráveis na linha RC.

Como nenhuma migration de Catálogo foi criada ou aplicada, a troca antes do
Dia 3 possui custo baixo e reduz risco para estoque, pedidos e pagamentos.

## Decision

1. Adotar Prisma ORM `7.10.0`, última versão estável da linha 7 verificada em
   2026-09-15.
2. Fixar `prisma`, `@prisma/client` e `@prisma/adapter-pg` em `7.10.0`, sem
   intervalos semver.
3. Fixar `pg` em `8.23.0`.
4. Usar `DIRECT_URL` para CLI/migrations e `DATABASE_URL` pooled no runtime.
5. Manter Prisma encapsulado em adapters de infraestrutura.
6. Mapear violações conhecidas pelo código Prisma, como `P2002`, e pelo campo
   afetado, sem vazar tipos Prisma para domain/application.
7. Reavaliar Prisma 8 somente após GA, maturação inicial, auditoria limpa e um
   plano de migração aprovado em novo ADR.
8. Manter overrides transitivos auditados enquanto necessários:
   `deepmerge-ts 8.0.0`, `lodash 4.18.1`, `mysql2 3.23.1` e `pg 8.23.0`.

## Validation Evidence

- Node.js `24.21.0` selecionado;
- Prisma CLI e Client `7.10.0` confirmados;
- migration isolada criada, revisada e aplicada em PostgreSQL 17;
- spike validou CRUD, `P2002`, transação interativa, rollback e cleanup;
- Client e aplicação passaram no type-check;
- auditorias de produção e desenvolvimento: zero vulnerabilidades conhecidas;
- peer dependencies: zero conflitos;
- 28 testes de Catálogo permanecem RED por comportamento/schema ausente.

## Consequences

### Positive

- stack suportada para produção;
- API e migrations maduras;
- nested writes, isolation levels e erros conhecidos disponíveis;
- menor risco de retrabalho durante o MVP.

### Costs

- o spike Prisma 8 deixa de ser ativo;
- uma futura migração para Prisma 8 exigirá trabalho planejado;
- overrides transitivos devem ser removidos quando o upstream incorporar os
  patches, sempre após regressão.

## Approval

Aprovado pelo humano em 2026-09-15 ao autorizar a recomendação de adotar a
versão estável mais atual e instalar as dependências necessárias.

## Official References

- `https://www.prisma.io/docs/prisma-orm/release-status`
- `https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/postgresql`
- `https://www.prisma.io/docs/orm/v7/reference/system-requirements`
