import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

describe('storefront preview — Vercel monorepo contract', () => {
  it('WEBPREVIEW-D7-VERCEL-001 keeps the deployment contract beside the Next.js app', () => {
    const config = JSON.parse(
      readFileSync(resolve(process.cwd(), 'vercel.json'), 'utf8'),
    ) as Record<string, unknown>;

    expect(config).toMatchObject({
      framework: 'nextjs',
    });

    expect(config).not.toHaveProperty('outputDirectory');
  });
});
