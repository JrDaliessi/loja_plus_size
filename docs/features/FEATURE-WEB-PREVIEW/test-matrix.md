# Validation Matrix — FEATURE-WEB-PREVIEW

Status legend:

- `GREEN`: observed passing locally in unit/component/static/browser validation;
- `PLANNED`: requires the Vercel Preview environment;
- `RED HISTORY`: failing baseline observed before implementation in Dia 2.

| AC | Requirement | Primary validation | Layer | Day 4 status |
|---|---|---|---|---|
| `FPRD-WEBPREVIEW001-AC-001` | `FPRD-WEBPREVIEW001-RQ-001`, `FPRD-WEBPREVIEW001-RQ-002`, `FPRD-WEBPREVIEW001-RQ-004` | `WEBPREVIEW-UI-001`, `002`, `004`; `WEBPREVIEW-E2E-001` | component/browser | GREEN |
| `FPRD-WEBPREVIEW001-AC-002` | `FPRD-WEBPREVIEW001-RQ-004` | `WEBPREVIEW-UI-005`; `WEBPREVIEW-INFRA-001` | component/adapter | GREEN |
| `FPRD-WEBPREVIEW001-AC-003` | `FPRD-WEBPREVIEW001-RQ-003`, `FPRD-WEBPREVIEW001-RQ-007` | `WEBPREVIEW-UI-003`; `WEBPREVIEW-E2E-KEYBOARD-001` | component/browser | GREEN |
| `FPRD-WEBPREVIEW001-AC-004` | `FPRD-WEBPREVIEW001-RQ-005` | `WEBPREVIEW-APP-001`; `WEBPREVIEW-INFRA-001`; `WEBPREVIEW-ARCH-001` | application/architecture | GREEN |
| `FPRD-WEBPREVIEW001-AC-005` | `FPRD-WEBPREVIEW001-RQ-006` | `WEBPREVIEW-E2E-RESP-320`, `375`, `768`, `1280`, `1440` | browser | GREEN |
| `FPRD-WEBPREVIEW001-AC-006` | `FPRD-WEBPREVIEW001-RQ-007`, `FPRD-WEBPREVIEW001-RQ-008` | `WEBPREVIEW-A11Y-001`; `WEBPREVIEW-E2E-KEYBOARD-001`; accessibility tree inspection | component/browser | GREEN |
| `FPRD-WEBPREVIEW001-AC-007` | `FPRD-WEBPREVIEW001-RQ-008` | `WEBPREVIEW-DS-001`, `002`; `WEBPREVIEW-E2E-FOCUS-001` | token/browser | GREEN |
| `FPRD-WEBPREVIEW001-AC-008` | `FPRD-WEBPREVIEW001-RQ-009` | `WEBPREVIEW-UI-006`; `WEBPREVIEW-E2E-IMAGE-001` | component/browser | GREEN |
| `FPRD-WEBPREVIEW001-AC-009` | `FPRD-WEBPREVIEW001-RQ-010` | `WEBPREVIEW-META-001`, `002`; inspect rendered head | unit/browser | GREEN |
| `FPRD-WEBPREVIEW001-AC-010` | `FPRD-WEBPREVIEW001-RQ-011` | `WEBPREVIEW-ARCH-002`; build/client bundle inspection | architecture/build | GREEN |
| `FPRD-WEBPREVIEW001-AC-011` | `FPRD-WEBPREVIEW001-RQ-014` | `WEBPREVIEW-APP-001..003`; `WEBPREVIEW-UI-007`, `008` | application/component | GREEN |
| `FPRD-WEBPREVIEW001-AC-012` | `FPRD-WEBPREVIEW001-RQ-012` | `WEBPREVIEW-TOOL-001`; lint, full test and `next build` | static/build | GREEN |
| `FPRD-WEBPREVIEW001-AC-013` | `FPRD-WEBPREVIEW001-RQ-013` | `WEBPREVIEW-VERCEL-001`; preview browser verification | deployment/browser | PLANNED |
| `FPRD-WEBPREVIEW001-AC-014` | `FPRD-WEBPREVIEW001-RQ-005`, `FPRD-WEBPREVIEW001-RQ-011` | `WEBPREVIEW-ARCH-001`; tracked-secret and bundle scans | architecture/security | GREEN local |

## Traceability Result

- acceptance criteria mapped: 14/14;
- requirements represented: 14/14;
- executable tests: 23/23 GREEN;
- local browser scenarios: 9/9 GREEN;
- acceptance criteria locally satisfied: 13/14;
- deployment criterion still planned: 1/14 (`AC-013`);
- Dia 2 RED history remains in `red-evidence.md`.

## Dia 4 supplemental contracts

| Contract | Validation | Status |
|---|---|---|
| `WEBPREVIEW-D4-STATE-001` | empty state uses polite live status | GREEN |
| `WEBPREVIEW-D4-STATE-002` | safe error uses assertive alert | GREEN |
| `WEBPREVIEW-D4-ASSET-001` | four PNG paths, signatures, dimensions and hashes | GREEN |
| `WEBPREVIEW-D4-META-001` | Open Graph declares `pt_BR` | GREEN |
