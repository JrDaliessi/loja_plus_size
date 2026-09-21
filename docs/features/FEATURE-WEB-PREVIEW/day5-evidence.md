# Dia 5 Evidence — FEATURE-WEB-PREVIEW

Date: 2026-09-21

## Hardening result

- Four generated PNG sources totaling 6,745,439 bytes were converted to WebP
  with `sharp 0.35.4`, quality `88`, effort `6` and smart chroma subsampling.
- The four current WebPs total 307,958 bytes: a 6,437,481-byte reduction
  (`95.43%`) while preserving `1122x1402` dimensions and the approved framing.
- The redundant PNG working-tree copies were removed after individual visual
  inspection; their original hashes remain in provenance and Git history.
- The app continues to use `next/image` with explicit dimensions and responsive
  `sizes`.
- Global preview responses now include `Permissions-Policy`, `Referrer-Policy`,
  `X-Content-Type-Options` and `X-Frame-Options`.
- `X-Powered-By` was disabled.

## TDD evidence

1. RED: WebP/size and security-header contracts failed before implementation.
2. GREEN: both Dia 5 contracts passed after the minimum implementation.
3. Additional RED: framework disclosure contract failed while
   `poweredByHeader` was undefined.
4. Additional GREEN: the contract passed with `poweredByHeader: false`.
5. Regression: 25/25 web tests and 80/80 API tests passed (105/105 total).

## Browser and HTTP evidence

- 320, 375, 768, 1280 and 1440 px: no horizontal overflow or error overlay;
- four cards and four optimized images loaded at every breakpoint;
- full-page mobile inspection preserved composition and visual quality;
- browser console warnings/errors: zero;
- local HTTP response returned all four approved security headers and omitted
  `X-Powered-By`.

## Quality gates

- lint: PASS;
- TypeScript: PASS;
- production build: PASS, route `/` remains statically prerendered;
- React review: no TSX behavior changed, no hook, client boundary or bundle
  dependency introduced;
- PostgreSQL test target stopped after regression;
- no Supabase, remote API, secret, commercial claim or production promotion.

## Remaining work

`FPRD-WEBPREVIEW001-AC-013` still requires verification in the Vercel Preview
environment. Dia 6 remains subject to explicit human approval.
