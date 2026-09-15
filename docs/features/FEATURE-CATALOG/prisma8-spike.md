---
id: PRISMA-001
feature: FEATURE-CATALOG
status: superseded
date: 2026-09-14
derived_from: [ADR-003, FSPEC-CAT001]
---

# Prisma 8 RC — Spike do Dia 2

> **EVIDÊNCIA HISTÓRICA:** este spike foi substituído pelo Prisma 7 estável em
> 2026-09-15, conforme ADR-004. Não governa a implementação atual.

## Objetivo e isolamento

Validar a stack aprovada sem implementar o catálogo. O spike usa somente o
PostgreSQL 17 local `plus_store_day2_test` em `127.0.0.1:55432`. Os modelos
genéricos `User`/`Post` são descartáveis e não pertencem ao domínio da loja.

## Pins verificados

| Pacote | Versão | Uso |
|---|---:|---|
| `prisma` | `8.0.0-rc.15` | CLI de desenvolvimento |
| `@prisma/orm-postgres` | `8.0.0-rc.11` | runtime PostgreSQL |
| `@prisma/cli-engine` | `0.4.0` | dependência transitiva exata declarada pelo CLI |
| `pg` | `8.22.0` | driver direto exigido pelo probe |
| `dotenv` | `17.4.2` | carregamento do config gerado |

O lockfile registra versões concretas. Scripts transitivos de `esbuild`,
`msgpackr-extract` e `workerd` permanecem bloqueados porque o CLI e o runtime
passaram no spike sem executá-los.

## Evidências executadas

| Verificação | Resultado |
|---|---|
| Node.js | `24.21.0` |
| `prisma --version` | `8.0.0-rc.15` |
| probe PostgreSQL | PASS |
| emissão de contrato | PASS; JSON e tipos emitidos |
| `db init --dry-run` | 5 operações aditivas previstas |
| `db init` | 5/5 operações aplicadas no banco local e assinatura criada |
| create + read | PASS |
| unique violation | PASS; `sqlState=23505`, constraint preservada |
| rollback transacional | PASS |
| migration status | PASS; marker igual ao contrato |
| novo dry-run | PASS; zero operações pendentes |
| type-check do spike | PASS |
| auditoria de produção | PASS; zero vulnerabilidades conhecidas |

## Achados da RC

1. `deleteCount()` está documentado, mas não foi exposto pela coleção testada no
   runtime `8.0.0-rc.11`.
2. A violação única chegou como `SqlQueryError` com `sqlState`, `constraint` e
   `table`; `isStructuredError()` não a reconheceu. O adapter deve mapear o shape
   observado sem depender de `P2002` ou `instanceof`.
3. O scaffold inicial usa `SERIAL`; isso não autoriza esse padrão no catálogo.
   O contrato real seguirá IDs opacos e a decisão de schema aprovada.
4. O CLI de desenvolvimento traz peers conflitantes e quatro advisories altos
   em dependências transitivas de Composer (`hono`, `@hono/node-server` e
   `lodash`). Esses pacotes não entram na árvore de produção; `pnpm audit
   --prod --audit-level high` ficou verde.
5. O scaffold RC ainda gerou import direto de `@prisma/cli-engine`; ele foi
   atualizado para o entrypoint público atual `prisma/config`.

## Decisão operacional

Prisma 8 permanece **condicionado**, conforme ADR-003. O runtime fica isolado em
infrastructure; domain/application não importam tipos Prisma. SQL explícito é
permitido somente quando uma lacuna da RC for demonstrada, revisada e coberta
por teste. O risco transitivo do CLI deve ser reavaliado antes de cada release e
não pode ser promovido a dependência de produção.

## Reprodução

```text
pnpm db:test:start
pnpm type-check:prisma8-spike
pnpm spike:prisma8
pnpm db:test:stop
```

Definir `DATABASE_URL` apenas no processo local ou gerenciador de segredos.
Nunca apontar o spike para o projeto Supabase principal.
