import { existsSync, readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import nextConfig from '../../../../next.config';
import { demoPreviewCollectionSource } from '../infrastructure/demo-preview-collection-source';

const originalAssetBytes = 6_745_439;
const maximumOptimizedBytes = Math.floor(originalAssetBytes * 0.4);

describe('storefront preview — Dia 5 hardening', () => {
  it('WEBPREVIEW-D5-ASSET-001 uses valid WebP sources at least 60% smaller', async () => {
    const items = await demoPreviewCollectionSource.list();
    let optimizedBytes = 0;

    for (const item of items) {
      expect(item.image.src).toMatch(/^\/preview\/[a-z-]+\.webp$/);

      const assetPath = resolve(
        process.cwd(),
        'public',
        item.image.src.replace(/^\//, ''),
      );
      expect(existsSync(assetPath), `Missing ${assetPath}`).toBe(true);

      const asset = readFileSync(assetPath);
      expect(asset.subarray(0, 4).toString('ascii')).toBe('RIFF');
      expect(asset.subarray(8, 12).toString('ascii')).toBe('WEBP');
      optimizedBytes += statSync(assetPath).size;
    }

    expect(optimizedBytes).toBeLessThanOrEqual(maximumOptimizedBytes);
  });

  it('WEBPREVIEW-D5-SEC-001 applies the preview security header baseline', async () => {
    const rules = await nextConfig.headers?.();
    const previewRule = rules?.find((rule) => rule.source === '/:path*');
    const headers = new Map(
      previewRule?.headers.map(({ key, value }) => [key, value]),
    );

    expect(headers).toMatchObject(
      new Map([
        ['Permissions-Policy', 'camera=(), microphone=(), geolocation=()'],
        ['Referrer-Policy', 'strict-origin-when-cross-origin'],
        ['X-Content-Type-Options', 'nosniff'],
        ['X-Frame-Options', 'DENY'],
      ]),
    );
    expect(nextConfig.poweredByHeader).toBe(false);
  });
});
