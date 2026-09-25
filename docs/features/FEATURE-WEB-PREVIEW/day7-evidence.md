# Dia 7 Evidence — FEATURE-WEB-PREVIEW

Date: 2026-09-25

## Final gate result

- 28/28 web tests and 80/80 API tests passed (108/108 total).
- Monorepo lint, TypeScript and production builds passed.
- Production and complete dependency audits reported zero known
  vulnerabilities.
- `git diff --check` found no whitespace error; only existing Windows line-ending
  notices were emitted.
- The isolated PostgreSQL target was started for regression and stopped after
  the gate.

## Full-story verification

Story: `/` renders as a Server Component, invokes the preview collection use
case, reads four deterministic items from the local demo adapter and passes the
result to the Purple Noir presentation. There is no client request, remote API,
database or Supabase boundary in this release.

| Boundary | Status | Evidence |
|---|---|---|
| Route to application use case | PASS | `page.tsx` awaits `getPreviewCollection` |
| Application to demo source | PASS | typed port and deterministic local adapter |
| Result to presentation | PASS | ready, empty and error contracts are executable |
| Browser render | PASS | HTTP 200, meaningful content, four cards and four images |
| Keyboard interaction | PASS | skip link and CTA targets validated |
| Runtime surface | PASS | no overlay, warning or console error |
| Remote boundary absence | PASS | source/test scans find no `fetch`, Supabase or Prisma in web runtime |

The browser harness did not expose Resource Timing entries during the final
check. This does not block the local-only story because the implementation and
architecture guards independently prove that no remote request path exists.

## Security and release boundaries

- no secret or environment variable is required by the preview;
- no commerce action, price, stock, freight or payment claim is present;
- security headers and removal of `X-Powered-By` remain covered;
- `noindex, nofollow` and the persistent demonstrative disclosure remain active;
- no commit, push, pull request, deployment, merge or production promotion was
  performed in Dia 7.

## Remote Preview evidence

- GitHub Actions run `36166771641`: PASS;
- Vercel deployment `dpl_FMdHXYoXZ5DDwdkVJZyK57xXX3TC`: `READY`;
- source commit: `14685840fdda5893fe320be558f1d91114e0c29f`;
- HTTP 200, four images loaded, no framework overlay and zero console errors;
- 320 px and 1440 px: navigation visible and no horizontal overflow;
- security headers and `x-robots-tag: noindex` present in the remote response;
- `FPRD-WEBPREVIEW001-AC-013`: GREEN.

The first two attempts failed with `STATIC_BUILD_NO_OUT_DIR` and
`NEXT_NO_VERSION`. The project Root Directory was corrected to `apps/web`, and
the deployment contract was moved beside the Next.js app before the successful
Preview.

## Decision

The repository artifact remains `READY_FOR_RELEASE`. It is not `RELEASED`:
technical validation is complete, but human Preview approval, PR merge and any
production promotion are separate decisions.
