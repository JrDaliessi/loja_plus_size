# Browser Verification — FEATURE-WEB-PREVIEW

## Activation

The local plan was executed on 2026-09-21 in Dia 3. It remains mandatory against
the future Vercel Preview Deployment before release approval.

## Local Flow

1. Start `@plus-store/web` with the approved Node.js 24 runtime.
2. Open `http://localhost:3000` with the browser verification tool.
3. Wait for network idle.
4. Confirm body has meaningful content, not an empty shell.
5. Confirm no Next.js error overlay.
6. Capture an annotated screenshot.
7. Inspect interactive elements and accessibility tree.
8. Verify the CTA by keyboard and its `#colecao` destination.
9. Inspect console errors and warnings.
10. Close the browser after evidence is collected.

## Responsive Scenarios

| ID | Viewport | Required evidence |
|---|---:|---|
| `WEBPREVIEW-E2E-RESP-320` | 320 px | no horizontal scroll or overlap; CTA usable |
| `WEBPREVIEW-E2E-RESP-375` | 375 px | mobile hierarchy and one-column cards |
| `WEBPREVIEW-E2E-RESP-768` | 768 px | two-column editorial grid |
| `WEBPREVIEW-E2E-RESP-1280` | 1280 px | complete desktop composition |
| `WEBPREVIEW-E2E-RESP-1440` | 1440 px | controlled max width and whitespace |

## Interaction and Accessibility

- `WEBPREVIEW-E2E-001`: disclosure, hero and four cards visible;
- `WEBPREVIEW-E2E-KEYBOARD-001`: skip link and CTA reachable in logical order;
- `WEBPREVIEW-E2E-FOCUS-001`: focus indicator remains visible beyond color;
- `WEBPREVIEW-E2E-IMAGE-001`: four optimized images load without layout shift;
- no serious/critical automated accessibility violation;
- one `h1`, named landmarks and meaningful alt text;
- reduced-motion preference does not hide content.

## Metadata and Runtime

- title and description appear in the rendered document;
- robots resolves to `noindex, nofollow`;
- no hydration warning or error overlay;
- no failed network request;
- no request to Supabase or a backend API;
- no unexpected Client Component bundle for the initial route.

## Vercel Preview

- `WEBPREVIEW-VERCEL-001`: deployment target is Preview and state is `READY`;
- use the branch/PR URL, never the production domain for initial approval;
- repeat content, console, keyboard and responsive checks against that URL;
- verify the production deployment remains unchanged;
- do not merge or promote until the human approves the preview.

## Failure Protocol

Capture screenshot and console/overlay evidence, fix the cause, and retry at most
twice in the same verification cycle. Correlate browser evidence with Vercel
runtime/build logs when a remote failure occurs.

## Local Result — 2026-09-21

- server: Next.js 16.3.5 on `http://localhost:3000`, HTTP 200;
- automation: Codex in-app browser fallback because the `agent-browser`
  executable was unavailable;
- page, disclosure, headings, four cards and landmarks: PASS;
- overlays and browser console errors: zero;
- CTA `#colecao`: PASS;
- skip link focus ring and focus transfer to `main`: PASS;
- four optimized images with useful alt text and non-zero natural width: PASS;
- 320/375 px: one column and no horizontal overflow;
- 768 px: two columns and no horizontal overflow;
- 1280/1440 px: four columns and no horizontal overflow;
- screenshots: desktop full page and mobile viewport visually inspected;
- evidence: `green-evidence.md`.

## Dia 6 Local Result — 2026-09-21

- 320, 375, 768, 1280 and 1440 px: PASS without horizontal overflow;
- `Início`, `Coleção` and `Manifesto`: visible at every validated width;
- full-page mobile and desktop visual inspection: PASS;
- skip link: first keyboard target, 3 px outline and focus transfer to
  `main#conteudo-principal`: PASS;
- keyboard order reaches brand, primary navigation, CTA and footer link: PASS;
- CTA fragment and visible `#colecao` target: PASS;
- one `h1`, landmarks, `pt-BR`, title, description and `noindex, nofollow`:
  PASS;
- four WebPs loaded with useful alt text and non-zero natural width: PASS;
- eight representative WCAG AA contrast samples: PASS (7.01:1–12.24:1);
- reduced-motion stylesheet contract: PASS;
- browser warnings/errors and overlays: zero;
- evidence: `day6-evidence.md`.

## Vercel Preview Result — 2026-09-25

- deployment `dpl_FMdHXYoXZ5DDwdkVJZyK57xXX3TC`: `READY`;
- source commit `14685840fdda5893fe320be558f1d91114e0c29f`;
- HTTP 200 with meaningful content and no Next.js error overlay;
- browser console errors: zero;
- four WebP images loaded with useful alt text and non-zero natural width;
- primary navigation targets: `#inicio`, `#colecao`, `#manifesto`;
- 320 px and 1440 px: navigation visible and no horizontal overflow;
- response headers include HSTS, frame denial, MIME protection, permissions
  policy, strict referrer policy and `x-robots-tag: noindex`;
- production was not promoted.
