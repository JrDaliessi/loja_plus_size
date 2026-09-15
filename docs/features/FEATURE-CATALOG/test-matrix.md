# FEATURE-CATALOG Traceability and Test Matrix

## Matrix

| Acceptance criterion | Requirements | Primary test | Layer | Secondary evidence | Estado inicial |
|---|---|---|---|---|---|
| `FPRD-CAT001-AC-001` | RQ-001, RQ-012 | `CAT-APP-001` | application | repository create call | `RED_CONFIRMED` |
| `FPRD-CAT001-AC-002` | RQ-001, RQ-003 | `CAT-APP-002` | application | `CAT-DB-001` unique slug | `RED_CONFIRMED` |
| `FPRD-CAT001-AC-003` | RQ-005 | `CAT-DOM-001` | domain | explicit order fixture | `RED_CONFIRMED` |
| `FPRD-CAT001-AC-004` | RQ-006, RQ-007 | `CAT-DOM-002` | domain | `CAT-DB-002` concurrent unique constraint | `RED_CONFIRMED` |
| `FPRD-CAT001-AC-005` | RQ-007 | `CAT-DOM-003` | domain | `CAT-DB-003` global unique constraint | `RED_CONFIRMED` |
| `FPRD-CAT001-AC-006` | RQ-008 | `CAT-DOM-004` | domain | exact decimal cases | `RED_CONFIRMED` |
| `FPRD-CAT001-AC-007` | RQ-008 | `CAT-DOM-005` | domain | `CAT-DB-004` partial unique barcode | `RED_CONFIRMED` |
| `FPRD-CAT001-AC-008` | RQ-009 | `CAT-STO-001` | domain/storage contract | persistent path allowlist | `RED_CONFIRMED` |
| `FPRD-CAT001-AC-009` | RQ-009 | `CAT-STO-002` | domain/storage contract | product/variant/color relationship | `RED_CONFIRMED` |
| `FPRD-CAT001-AC-010` | RQ-010 | `CAT-DOM-006` | domain | complete issue list | `RED_CONFIRMED` |
| `FPRD-CAT001-AC-011` | RQ-010 | `CAT-APP-003` | application | `CAT-DB-005` atomic transaction | `RED_CONFIRMED` |
| `FPRD-CAT001-AC-012` | RQ-013 | `CAT-API-001` | presentation | active-only allowlist | `RED_CONFIRMED` |
| `FPRD-CAT001-AC-013` | RQ-013 | `CAT-API-002` | presentation | absence of inventory fields | `RED_CONFIRMED` |
| `FPRD-CAT001-AC-014` | RQ-014 | `CAT-APP-004` | application | `CAT-DB-006` cursor query | `RED_CONFIRMED` |
| `FPRD-CAT001-AC-015` | RQ-015 | `CAT-DB-007` | infrastructure adapter | P2002 + target mapped without Prisma leakage | `RED_CONFIRMED` |
| `FPRD-CAT001-AC-016` | RQ-016 | `CAT-SEC-001` | application/security | repository remains untouched | `RED_CONFIRMED` |
| `FPRD-CAT001-AC-017` | RQ-017 | `CAT-SEC-002` | PostgreSQL/Supabase integration | local role contract + remote read-only baseline | `RED_CONFIRMED` |
| `FPRD-CAT001-AC-018` | RQ-018 | `CAT-APP-005` | domain/application | versioned UTC envelope | `RED_CONFIRMED` |
| `FPRD-CAT001-AC-019` | RQ-011, RQ-013 | `CAT-APP-006` | domain/application | public listing after archive | `RED_CONFIRMED` |
| `FPRD-CAT001-AC-020` | RQ-006, PRD-BR-003 | `CAT-TRACE-001` | traceability | schema/entity field denylist | `RED_CONFIRMED` |

## Infrastructure Resolution

| Test | Evidence | Resolution |
|---|---|---|
| `CAT-DB-001..006` | sete testes executados contra PostgreSQL 17 isolado | RED por schema de produto ainda ausente |
| `CAT-SEC-002` | roles locais + baseline remoto sem grants comerciais | RED e boundary verificados |
| Storage contract | `CAT-STO-001..002` + baseline remoto sem bucket | contrato RED; criação remota adiada para release autorizada |

Nenhum teste foi marcado como aprovado a partir de mock. Fakes validam somente orquestração de aplicação.
