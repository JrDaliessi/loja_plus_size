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
    '/preview/vestido-aurora.webp',
    'C08948FBD237C17D4309D1F7410705B314DAC92F67A5C66E4C1AC82AF0CAB2E5',
  ],
  [
    '/preview/conjunto-horizonte.webp',
    'A74D9AC32427E29FCB633CA79081AD0D1967944CBD7FC90625A93870E56016B3',
  ],
  [
    '/preview/blusa-essencia.webp',
    '27A7B3A25E21F44C37C526FEAD16FFB1FD94000D59B2AD60C631088589DB9640',
  ],
  [
    '/preview/saia-movimento.webp',
    'A1DD124B54620C7BAF5DC15FAAF100EB95BEA7FF0B613E638794D94583442B73',
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

  it('WEBPREVIEW-D4-ASSET-001 preserves every approved local WebP contract', async () => {
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
      expect(asset.subarray(0, 4).toString('ascii')).toBe('RIFF');
      expect(asset.subarray(8, 12).toString('ascii')).toBe('WEBP');
      expect(asset.subarray(12, 16).toString('ascii')).toBe('VP8 ');
      expect(asset.readUInt16LE(26) & 0x3fff).toBe(item.image.width);
      expect(asset.readUInt16LE(28) & 0x3fff).toBe(item.image.height);
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
