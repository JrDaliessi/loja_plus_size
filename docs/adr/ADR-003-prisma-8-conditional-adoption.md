---
id: ADR-003
status: proposed
date: 2026-09-14
affects: [apps/api, database, migrations, testing, ci]
derived_from: [project-stack.md, human-decision-2026-09-13]
---

# ADR-003 — Adoção condicionada do Prisma 8 RC

## Context

A stack aprovada exige Prisma 8. Em 2026-09-14, a documentação oficial ainda o classifica como Release Candidate e informa ausência de recursos relevantes: a maioria dos nested writes, atomic `increment`, configuração de transaction isolation levels, `$extends`, filtros JSON e códigos de erro no estilo `P2002`.

A linha Node.js 24 também exige pelo menos 24.11 para o Prisma 8 atual. O ambiente local permanece em Node.js 22.14.0.

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

A documentação oficial consultada em 2026-09-14 listava:

- CLI `prisma`: `8.0.0-rc.13`;
- PostgreSQL library `@prisma/orm-postgres`: `8.0.0-rc.9`.

Esses valores são evidência temporal, não autorização para instalar. As versões devem ser consultadas novamente e pinadas sem intervalo no início do scaffold.

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

Pendente de aprovação humana no encerramento do Dia 1B. A aprovação aceita o uso condicionado, não o risco de instalar sem o spike.

## Official Reference

`https://www.prisma.io/docs/prisma-orm/release-status`
