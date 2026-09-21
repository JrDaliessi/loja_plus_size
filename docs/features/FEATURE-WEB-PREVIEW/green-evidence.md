# GREEN Evidence — FEATURE-WEB-PREVIEW — Dia 3

Date: 2026-09-21
Small release: `SR-WEB-PREVIEW-01`
State after execution: `IN_PROGRESS`

## RED to GREEN

- Dia 2 baseline: 19 executable tests, 14 expected RED and 5 passing guards.
- Dia 3 result: 6 test files and 19/19 tests GREEN.
- Covered behavior: application ready/empty/error, deterministic demo adapter,
  Purple Noir tokens and contrast, metadata/noindex, disclosure, semantic
  headings, non-transactional CTA, four concept cards, image alternatives,
  absence of commercial claims, architecture boundaries and axe checks.
- JSDOM printed its known `HTMLCanvasElement.getContext` capability message
  during axe execution; the accessibility test and suite remained GREEN.

## Static and Build Gates

| Gate | Command | Result |
|---|---|---|
| web type-check | `pnpm --filter @plus-store/web run type-check` | PASS |
| web lint | `pnpm --filter @plus-store/web run lint` | PASS |
| web tests | `pnpm --filter @plus-store/web exec vitest run ...` | 19/19 PASS |
| web build | `pnpm --filter @plus-store/web run build` | PASS; `/` static |
| monorepo lint | `pnpm run lint` | PASS |
| monorepo regression | `pnpm run test` | 80/80 API + 19/19 web PASS |
| monorepo build | `pnpm run build` | PASS |

The first monorepo regression attempt correctly exposed that the isolated
PostgreSQL test service was stopped. The service was started with the project
script, the full regression passed, and the service was stopped afterwards.

## Browser Verification

The `agent-browser` executable described by the verification skill was absent,
so the connected Codex in-app browser was used as an equivalent browser
automation surface. The local Next.js server returned HTTP 200 and was stopped
after verification.

| Check | Evidence | Result |
|---|---|---|
| meaningful page | disclosure, header, hero, collection, manifesto and footer in accessibility tree | PASS |
| framework overlay | no Next/Vite error overlay at initial and final checks | PASS |
| console | zero browser error logs | PASS |
| images | four images complete with non-zero natural width after collection navigation | PASS |
| CTA | `Conhecer a coleção` changed URL to `/#colecao` | PASS |
| keyboard | first Tab exposed a 3 px focus ring on the skip link; Enter moved focus to `main#conteudo-principal` | PASS |
| metadata | title rendered as `Plus Store — Prévia Purple Noir`; robots `noindex, nofollow` | PASS |

Responsive evidence:

| Width | Grid | Horizontal overflow | Disclosure | Result |
|---:|---:|---|---|---|
| 320 | 1 column | none | present | PASS |
| 375 | 1 column | none | present | PASS |
| 768 | 2 columns | none | present | PASS |
| 1280 | 4 columns | none | present | PASS |
| 1440 | 4 columns | none | present | PASS |

Desktop and mobile screenshots were visually inspected during the browser run.
The Dark Luxury hero, Light Editorial collection, photography, typography and
controlled violet accents match the approved Purple Noir direction.

## Architecture and React Review

- Server Components remain the default; no `'use client'` boundary was added.
- Route composition only wires the application use case, demo adapter and view.
- Presentation does not access Supabase, Prisma, database variables or remote
  `fetch`.
- No client hooks, effects, global state, waterfall or serialized excess were
  introduced.
- `next/image` declares dimensions, `sizes` and useful conceptual alt text.
- Component scope remains one page and one feature; no generic catalog or
  design-system abstraction was added prematurely.

## Remaining Gates

- Vercel Preview Deployment was not created in Dia 3.
- Production promotion remains unauthorized.
- Dia 4 requires a new command/approval before controlled expansion.
