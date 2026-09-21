# Dia 6 Evidence — FEATURE-WEB-PREVIEW

Date: 2026-09-21

## Experience result

- The primary navigation keeps `Início`, `Coleção` and `Manifesto` visible at
  every validated width, including 320 and 375 px.
- The page preserves the Purple Noir Dark Luxury / Light Editorial hierarchy
  in full-page mobile and desktop inspection.
- All four editorial WebPs load with meaningful alternative text and non-zero
  natural width.
- One `h1`, named navigation, semantic header/main/footer landmarks, `pt-BR`,
  useful title/description and `noindex, nofollow` were confirmed in-browser.
- No commerce action or wording (`comprar`, `carrinho`, `checkout`,
  `pagamento`) appears in the demonstrative preview.

## TDD evidence

1. RED: `WEBPREVIEW-D6-NAV-001` failed because the mobile stylesheet hid the
   first primary navigation link.
2. GREEN: the smallest fix removed only that hiding rule; all three links then
   remained available.
3. `WEBPREVIEW-D6-MOTION-001` confirms reduced-motion styling disables smooth
   movement without hiding content.
4. Regression: 27/27 web tests and 80/80 API tests passed (107/107 total).

## Browser and accessibility evidence

- 320, 375, 768, 1280 and 1440 px: no horizontal overflow or error overlay;
- the three primary links are visible in every viewport;
- skip link is the first keyboard target, has a 3 px visible outline and moves
  focus to `main#conteudo-principal`;
- keyboard order reaches the brand, all navigation links, CTA and footer link;
- CTA changes the fragment to `#colecao` and exposes the collection in view;
- eight representative normal-text combinations passed WCAG AA contrast,
  ranging from 7.01:1 to 12.24:1;
- browser console warnings/errors: zero;
- reduced-motion behavior is covered by the executable stylesheet contract.

## Quality gates

- lint: PASS;
- TypeScript: PASS;
- production build: PASS; `/` remains statically prerendered;
- responsive and visual inspection: PASS;
- keyboard, focus, landmarks, metadata and contrast: PASS;
- PostgreSQL test target stopped after regression;
- no Supabase, remote API, secret, commercial claim or production promotion.

## Remaining work

`FPRD-WEBPREVIEW001-AC-013` still requires verification in the Vercel Preview
environment. Dia 7 must run the final quality/release gate after explicit human
approval; the current Dia 5 and Dia 6 changes remain local until a separately
authorized commit and push.
