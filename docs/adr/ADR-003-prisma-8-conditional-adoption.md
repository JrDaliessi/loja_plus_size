---
id: ADR-003
status: superseded
date: 2026-09-14
affects: [apps/api, database, migrations, testing, ci]
derived_from: [project-stack.md, human-decision-2026-09-13]
superseded_by: ADR-004
---

# ADR-003 — Adoção condicionada do Prisma 8 RC

> **SUPERADO EM 2026-09-15 POR ADR-004.** Mantido como evidência da decisão e
> do spike originais; não governa novas implementações.

## Context

A stack aprovada exige Prisma 8. Em 2026-09-14, a documentação oficial ainda o classifica como Release Candidate e informa ausência de recursos relevantes: a maioria dos nested writes, atomic `increment`, configuração de transaction isolation levels, `$extends`, filtros JSON e códigos de erro no estilo `P2002`.

A linha Node.js 24 também exige pelo menos 24.11 para o Prisma 8 atual. O projeto usa Node.js 24.21.0; o Node 22 global permanece instalado sem ser removido.

## Decision

Manter Prisma 8 como decisão do projeto, com condições:

1. Fixar versões exatas do CLI `prisma` e da biblioteca PostgreSQL `@prisma/orm-postgres` no scaffold.
2. Não assumir `@prisma/client`, comandos ou estrutura do Prisma 7.
3. Encapsular Prisma em adapters de infraestrutura.
4. Executar spike do `SR-MVP-01` para CRUD, constraints, transações e mapeamento de erros.
5. Não depender de recurso ausente na RC.
6. Usar SQL explícito somente com revisão, testes e rastreabilidade quando necessário.
7. Criar novo ADR e obter aprovação humana antes de migrar para Prisma 7 ou trocar ORM.

## Release Pin Baseline

A verificação do registro npm em 2026-09-14 confirmou:

- CLI `prisma`: `8.0.0-rc.15`;
- PostgreSQL library `@prisma/orm-postgres`: `8.0.0-rc.11`;
- CLI engine transitivo pinado pelo próprio CLI: `@prisma/cli-engine@0.4.0`;
- PostgreSQL driver exigido pelo probe: `pg@8.22.0`.

Esses valores são evidência temporal, não autorização para instalar. As versões devem ser consultadas novamente e pinadas sem intervalo no início do scaffold.

O spike concluído está em `docs/features/FEATURE-CATALOG/prisma8-spike.md`.
Ele confirmou CRUD, transação e migration marker, mas também registrou duas
divergências da RC: ausência de `deleteCount()` na coleção testada e unique
violation materializada como `SqlQueryError`/`sqlState 23505`.

## Consequences

### Positive

- respeita a stack aprovada;
- adapters limitam impacto de mudanças da RC;
- migrations e queries podem ser avaliadas no modelo novo desde o início.

### Risks and Costs

- API e comandos podem mudar antes da GA prevista para outubro de 2026;
- exemplos de Prisma 7 podem ser incompatíveis;
- ausências atuais podem exigir SQL ou revisão da decisão;
- atualização controlada da RC será trabalho explícito.

## Validation Gate

- Node.js `>=24.11` ativo;
- versões oficiais atuais verificadas e fixadas;
- lockfile versionado;
- spike cobre conexão Supabase, leitura, escrita, unique violation, transação e migration;
- suíte prova que domain/application não dependem de tipos Prisma;
- rollback e recuperação da migration testados.

## Approval

Aceito pelo humano em 2026-09-14. O aceite confirma o uso condicionado e não autoriza instalar sem o spike e os pins exatos.

## Official Reference

`https://www.prisma.io/docs/prisma-orm/release-status`
