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
