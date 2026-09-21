# Dia 4 Evidence — FEATURE-WEB-PREVIEW

Date: 2026-09-21

## Controlled expansion

- `PreviewEmptyState` announces non-critical absence with `role="status"`,
  `aria-live="polite"` and an atomic message.
- `PreviewErrorState` announces the normalized safe error with `role="alert"`,
  `aria-live="assertive"` and no provider, endpoint or stack detail.
- Open Graph metadata declares the Brazilian locale (`pt_BR`) while preserving
  `noindex, nofollow`.
- The four local PNG contracts now verify path, PNG signature, physical
  dimensions (`1122x1402`) and approved SHA-256 hashes.

## TDD evidence

1. RED: 4/4 new Dia 4 tests failed for the intended missing contracts:
   accessible roles, asset dimension agreement and Open Graph locale.
2. GREEN: 4/4 Dia 4 tests passed after the minimum implementation.
3. Regression: 23/23 web tests and 80/80 API tests passed (103/103 total).

## Quality gates

- web and monorepo lint: PASS;
- web and monorepo TypeScript checks: PASS;
- web and monorepo production builds: PASS;
- Next.js route `/`: statically prerendered;
- browser console warnings/errors: zero;
- responsive checks at 320, 375, 768, 1280 and 1440 px: no horizontal
  overflow, four cards and four successfully loaded images;
- desktop and full-page mobile visual inspection: PASS;
- React review: Server Components preserved, no hooks or client boundary added,
  props remain serializable and state components remain presentation-only;
- PostgreSQL test target stopped after regression.

## Scope preserved

No Supabase access, remote API, secret, commercial claim, additional route,
architecture rewrite, production promotion or new generated asset was added.

## Remaining work

- `DEBT-WEB-001`: optimize the 6,745,439-byte source asset set during Dia 5
  without changing the approved visual result.
- Preview Deployment validation remains planned for `FPRD-WEBPREVIEW001-AC-013`.
