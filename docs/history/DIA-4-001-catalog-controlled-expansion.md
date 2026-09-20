---
id: DIA-4-001
date: 2026-09-20
phase: Dia 4
artifact: FEATURE-CATALOG
state: IN_PROGRESS
derived_from:
  - docs/features/FEATURE-CATALOG/feature-spec.md
  - docs/features/FEATURE-CATALOG/test-plan.md
  - docs/history/DIA-3-001-catalog-minimum-green.md
---

# Dia 4 — Catalog Controlled Expansion

## Objective

Expandir o núcleo GREEN da `SR-MVP-01` com contratos HTTP, persistence real,
identidade Supabase e mídia verificável, sem promover mudanças remotas.

## Delivered

- NestJS 12 com rotas versionadas de criação, ativação, arquivamento e listagem;
- Zod 4 como fonte única do request contract e JSON Schema OpenAPI;
- envelope de erro estável e correlation ID em sucesso/erro;
- repository Prisma com mapeamento, keyset pagination e transação por contexto;
- identidade Supabase via `getClaims` e allowlist de permissões em `app_metadata`;
- upload assinado sem upsert, paths controlados e verificação de conclusão;
- composition root com configuração validada, segredos somente por ambiente;
- bundle Node ESM via esbuild, necessário para o client Prisma TypeScript gerado.

## Validation

| Gate | Evidence |
|---|---|
| RED/GREEN | 38 contratos Dia 4 falharam por comportamento ausente e depois passaram |
| Regression | 11 suites, 66 tests passed |
| Coverage | 81.48% statements, 63.63% branches, 85.54% functions, 83.11% lines |
| Static | Prisma generate, type-check, ESLint and build passed |
| Runtime | public list returned 200; protected create without bearer returned 401 |
| Supply chain | production and full audits: zero known vulnerabilities |
| Remote safety | Supabase project `olkadbgumpiybehslobk` was not mutated |

## Decisions and Controls

- NestJS 12 is ESM; Jest was aligned to VM modules instead of downgrading.
- O build usa esbuild porque o TypeScript gerado pelo Prisma preserva imports
  locais sem extensão que não iniciam diretamente no Node ESM após `tsc` puro.
- O backend usa publishable key para verificação Auth; secret/service role não é
  aceito pela configuração materializada.
- A mídia usa novos paths em vez de sobrescrita para evitar corrida e cache stale.

## Remaining Risks

- conexão PostgreSQL remota ainda depende de secret manager;
- permissões reais de staff ainda não foram configuradas no Supabase Auth;
- bucket e policies de Storage ainda não existem no projeto principal;
- migration/advisors/rollback remotos permanecem bloqueados;
- o incidente de rejeição de JWT do Supabase requer revalidação antes do deploy.

## Next Action

Solicitar aprovação explícita para o Dia 5 — Refinement, Refactoring and
Hardening. Não promover schema ou Storage automaticamente.
