# RED Evidence — FEATURE-WEB-PREVIEW

Date: 2026-09-20

## Environment

- Node.js: 24.21.0
- pnpm: 11.19.0
- Vitest: 5.0.1
- jsdom: 30.1.0
- Testing Library React: 16.3.3
- axe-core: 4.13.0

## Infrastructure Gate

```text
pnpm --filter @plus-store/web run type-check
```

Result: PASS. Test infrastructure and RED seams compile under strict TypeScript.
The root `pnpm run type-check` also passed for both `@plus-store/web` and the
existing `@plus-store/api`, confirming no type regression in the catalog slice.

An initial incompatible `axe-core` import was corrected before RED was
accepted; configuration failure was not misclassified as missing behavior.

Both production-only and full dependency audits reported zero known
vulnerabilities. The existing deprecated `glob@10.5.0` transitive remains
tracked separately as `DEBT-DEP-001` and was not introduced as hidden debt.

## RED Command

```text
pnpm --filter @plus-store/web run test:web:red
```

Observed result:

```text
Test Files  5 failed | 1 passed (6)
Tests       14 failed | 5 passed (19)
Exit status 1
```

## Expected Failures

| Area | Failed | Evidence |
|---|---:|---|
| application | 3 | use case intentionally throws `not implemented` |
| demo adapter | 1 | returns zero instead of four illustrative records |
| presentation | 7 | disclosure, headings, CTA, cards, images and states absent |
| metadata | 2 | title/description/robots absent |
| design tokens | 1 | `packages/ui/src/tokens.css` absent |

## Passing Guards

- commercial claims are absent from the placeholder;
- axe finds no serious/critical violation in the placeholder;
- no Supabase, Prisma, remote fetch or secret reference exists;
- no `'use client'` directive exists;
- approved contrast pairs pass and white on `#8B5CF6` remains rejected.

Passing placeholder guards do not approve the final experience. They must be
reexecuted against the completed page and complemented by browser evidence.

## Conclusion

RED is valid: failures reach approved missing behavior after successful
dependency resolution and type-check. No production behavior, remote resource,
Vercel deployment or Supabase mutation was created.
