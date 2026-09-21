import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

describe('storefront preview — Vercel monorepo contract', () => {
  it('WEBPREVIEW-D7-VERCEL-001 points Vercel at the Next.js workspace output', () => {
    const config = JSON.parse(
      readFileSync(resolve(process.cwd(), '..', '..', 'vercel.json'), 'utf8'),
    ) as Record<string, unknown>;

    expect(config).toMatchObject({
      framework: 'nextjs',
      installCommand: 'pnpm install --frozen-lockfile',
      buildCommand: 'pnpm --filter @plus-store/web build',
      outputDirectory: 'apps/web/.next',
    });
  });
});
