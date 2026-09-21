# Dia 4 Evidence — FEATURE-WEB-PREVIEW

Date: 2026-09-21

## Controlled expansion

- `PreviewEmptyState` announces non-critical absence with `role="status"`,
  `aria-live="polite"` and an atomic message.
- `PreviewErrorState` announces the normalized safe error with `role="alert"`,
  `aria-live="assertive"` and no provider, endpoint or stack detail.
- Open Graph metadata declares the Brazilian locale (`pt_BR`) while preserving
  `noindex, nofollow`.
- At the Dia 4 checkpoint, the four local PNG contracts verified path, PNG
  signature, physical dimensions (`1122x1402`) and approved SHA-256 hashes.
  Dia 5 later replaced the deployment copies with traced WebPs.

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

## Subsequent resolution

- `DEBT-WEB-001` was resolved in Dia 5 with a 95.43% reduction and preserved
  visual result; see `day5-evidence.md`.
- Preview Deployment validation remains planned for `FPRD-WEBPREVIEW001-AC-013`.
