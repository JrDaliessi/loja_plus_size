---
id: SR-WEB-PREVIEW-01-RC1
small_release: SR-WEB-PREVIEW-01
feature: FEATURE-WEB-PREVIEW
status: READY_FOR_RELEASE
date: 2026-09-25
commit: 14685840fdda5893fe320be558f1d91114e0c29f
preview_deployment: dpl_FMdHXYoXZ5DDwdkVJZyK57xXX3TC
---

# SR-WEB-PREVIEW-01 — Purple Noir Preview Release Candidate

## Objective

Provide one shareable, demonstrative Purple Noir page for visual and technical
review before the commercial storefront is implemented.

## Included

- one statically prerendered Next.js route;
- Dark Luxury hero and manifesto with Light Editorial collection section;
- deterministic ready, empty and error presentation contracts;
- four original, optimized and provenance-tracked WebP assets;
- persistent demonstrative disclosure and `noindex, nofollow`;
- responsive, keyboard, focus, contrast and reduced-motion behavior;
- HTTP hardening headers without framework disclosure.

## Excluded

- live catalog, price, stock, freight, cart, checkout or payment;
- Supabase, database, Auth, Storage or remote API;
- personal-data collection, cookies or forms;
- production promotion.

## Evidence

- 14/14 requirements and acceptance criteria mapped;
- 14/14 acceptance criteria satisfied, including remote `AC-013`;
- 28/28 web and 80/80 API tests pass (108/108 total);
- lint, type-check and production builds pass;
- production and complete dependency audits report zero known vulnerabilities;
- five responsive widths, keyboard flow and eight WCAG AA contrast samples pass;
- final local browser check returns HTTP 200 with no overlay or console issue;
- [Dia 7 evidence](../features/FEATURE-WEB-PREVIEW/day7-evidence.md);
- [release readiness](../features/FEATURE-WEB-PREVIEW/release-readiness.md);
- [rollback plan](../features/FEATURE-WEB-PREVIEW/rollback-plan.md).

## Risks and debt

- PR #7 was merged; the Root Directory correction is isolated in PR #8;
- the Vercel Preview is `READY` and its response headers were verified;
- demonstrative content must retain disclosure and must not be presented as
  sellable inventory;
- `DEBT-DEP-001` remains low-severity, test-tooling-only maintenance debt.

## Release decision

The candidate passed local, CI and Vercel Preview validation. It remains
`READY_FOR_RELEASE`, not `RELEASED`: PR #8, human approval and production
promotion remain separate decisions, and production is unchanged.
