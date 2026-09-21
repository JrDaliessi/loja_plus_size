import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { PreviewCollectionResult } from '../application/preview-collection-source';
import { PreviewHome } from '../presentation/preview-home';
import { previewItemsFixture } from './fixtures';

const readyResult: PreviewCollectionResult = {
  status: 'ready',
  items: previewItemsFixture,
};

describe('storefront preview — Dia 6 experience validation', () => {
  it('WEBPREVIEW-D6-NAV-001 keeps every primary navigation link available on mobile', () => {
    render(<PreviewHome result={readyResult} />);

    const navigation = screen.getByRole('navigation', {
      name: 'Navegação principal',
    });
    expect(
      within(navigation)
        .getAllByRole('link')
        .map((link) => link.textContent),
    ).toEqual(['Início', 'Coleção', 'Manifesto']);

    const css = readFileSync(
      resolve(process.cwd(), 'src', 'app', 'globals.css'),
      'utf8',
    );
    expect(css).not.toMatch(
      /\.site-header nav a:first-child\s*\{[^}]*display:\s*none/si,
    );
  });

  it('WEBPREVIEW-D6-MOTION-001 preserves content under reduced motion', () => {
    const css = readFileSync(
      resolve(process.cwd(), 'src', 'app', 'globals.css'),
      'utf8',
    );

    expect(css).toMatch(/@media\s*\(prefers-reduced-motion:\s*reduce\)/i);
    expect(css).toMatch(/scroll-behavior:\s*auto/i);
    expect(css).not.toMatch(
      /@media\s*\(prefers-reduced-motion:\s*reduce\)[^{]*\{[\s\S]*display:\s*none/i,
    );
  });
});
