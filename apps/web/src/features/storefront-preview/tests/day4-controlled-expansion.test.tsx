import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { PreviewCollectionResult } from '../application/preview-collection-source';
import { demoPreviewCollectionSource } from '../infrastructure/demo-preview-collection-source';
import { PreviewHome } from '../presentation/preview-home';
import { previewMetadata } from '../presentation/preview-metadata';

const assetHashes = new Map<string, string>([
  [
    '/preview/vestido-aurora.png',
    '2473727C02E66558274ECDDC1B51F894FF83298AD339E0210A2B028518520B7C',
  ],
  [
    '/preview/conjunto-horizonte.png',
    '548D34CDCD634AC64559F514B0EC2E5C5CEA26218483880C4BB0F49CFD9D62C6',
  ],
  [
    '/preview/blusa-essencia.png',
    'C0CE42E66A8BA9468626CF8798E81462ED543E0C40CD81031D0267B160B9DA57',
  ],
  [
    '/preview/saia-movimento.png',
    '67C9C2FCC31B19FA91464B354023A36FE207DF2E556D81E7D75C1B6F95B1E563',
  ],
]);

describe('storefront preview — Dia 4 controlled expansion', () => {
  it('WEBPREVIEW-D4-STATE-001 announces the empty state politely', () => {
    const result: PreviewCollectionResult = { status: 'empty', items: [] };

    render(<PreviewHome result={result} />);

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveTextContent(/seleção conceitual está sendo preparada/i);
  });

  it('WEBPREVIEW-D4-STATE-002 announces the normalized error assertively', () => {
    const result: PreviewCollectionResult = {
      status: 'error',
      message: 'Não foi possível carregar esta prévia agora.',
    };

    render(<PreviewHome result={result} />);

    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('aria-live', 'assertive');
    expect(alert).toHaveTextContent('Não foi possível carregar esta prévia agora.');
    expect(alert).not.toHaveTextContent(/provider|endpoint|stack/i);
  });

  it('WEBPREVIEW-D4-ASSET-001 preserves every approved local PNG contract', async () => {
    const items = await demoPreviewCollectionSource.list();

    expect(items).toHaveLength(assetHashes.size);
    for (const item of items) {
      const assetPath = resolve(
        process.cwd(),
        'public',
        item.image.src.replace(/^\//, ''),
      );
      expect(existsSync(assetPath), `Missing ${assetPath}`).toBe(true);

      const asset = readFileSync(assetPath);
      expect(asset.subarray(1, 4).toString('ascii')).toBe('PNG');
      expect(asset.readUInt32BE(16)).toBe(item.image.width);
      expect(asset.readUInt32BE(20)).toBe(item.image.height);
      expect(createHash('sha256').update(asset).digest('hex').toUpperCase()).toBe(
        assetHashes.get(item.image.src),
      );
    }
  });

  it('WEBPREVIEW-D4-META-001 declares the approved Brazilian locale', () => {
    expect(previewMetadata.openGraph).toMatchObject({
      type: 'website',
      locale: 'pt_BR',
    });
  });
});
