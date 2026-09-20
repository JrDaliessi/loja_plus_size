---
id: DIA-3-001
date: 2026-09-20
phase: Dia 3
artifact: FEATURE-CATALOG
state: IN_PROGRESS
derived_from:
  - docs/features/FEATURE-CATALOG/feature-prd.md
  - docs/features/FEATURE-CATALOG/feature-spec.md
  - docs/features/FEATURE-CATALOG/test-plan.md
---

# Dia 3 — Catalog Minimum Validated Execution

## Objective

Implementar o menor incremento capaz de satisfazer o contrato RED aprovado para
a `SR-MVP-01`, preservando as fronteiras domain/application/infrastructure e sem
promover mudanças ao Supabase principal.

## Delivered

- invariantes de SKU, preço, barcode, tamanho, mídia e publicação;
- transições de ativação e arquivamento e eventos versionados em UTC;
- casos de uso mínimos com autorização antes de acesso ao repository;
- paginação por cursor e projeção pública por allowlist;
- tradução estável de conflito Prisma `P2002`;
- schema Prisma 7 para catálogo no schema PostgreSQL privado `app`;
- migrations aditivas com constraints, índices, RLS e revogação de privilégios;
- harness PostgreSQL portátil entre Windows e ambientes UTF-8;
- quality gates de lint e build materializados no Turborepo.

## Validation

| Gate | Evidence |
|---|---|
| Tests | 5 suites, 28 tests passed, zero todo |
| Database | 7 PostgreSQL contracts passed, including concurrent uniqueness and rollback |
| Coverage | 81.93% statements, 62.76% branches, 90.32% functions, 80.15% lines |
| Prisma | generate, validate and migrate status passed; 2 migrations applied locally |
| Static | type-check, ESLint and build passed |
| Supply chain | production and full audits: zero known vulnerabilities |
| Remote safety | Supabase project `olkadbgumpiybehslobk` was not mutated |

## Decisions and Controls

- A base de testes antiga continha objetos históricos fora do catálogo. Em vez
  de apagá-los, foi criado `plus_store_day3_migrate`, banco local dedicado ao
  histórico Prisma.
- O schema `app` permanece fora da Data API; `PUBLIC`, `anon` e `authenticated`
  não recebem privilégios. RLS foi habilitada como defesa em profundidade.
- A integração remota permanece bloqueada até conexão por secrets, preview
  autorizado, advisors e plano de rollback.

## Remaining Risks

- ainda não existem adapters concretos de Prisma, NestJS, Supabase Auth e Storage;
- contratos HTTP/OpenAPI/Zod ainda não foram materializados;
- overrides transitivos do Prisma continuam exigindo reauditoria em upgrades;
- `glob@10.5.0` deprecated permanece como dívida baixa na árvore de cobertura Jest.
- previews da Vercel ficam intencionalmente ignorados enquanto `apps/web` não
  existir; o guard em `vercel.json` deixa de ignorá-los automaticamente quando
  a aplicação web for materializada.

## Next Action

Solicitar aprovação explícita para o Dia 4 — Controlled Expansion. Não promover
migration nem Storage ao Supabase principal automaticamente.
