import axeCore from 'axe-core';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { PreviewCollectionResult } from '../application/preview-collection-source';
import { PreviewHome } from '../presentation/preview-home';
import { previewItemsFixture } from './fixtures';

const readyResult: PreviewCollectionResult = {
  status: 'ready',
  items: previewItemsFixture,
};

describe('PreviewHome — RED', () => {
  it('WEBPREVIEW-UI-001 identifies the experience as a demonstrative preview', () => {
    render(<PreviewHome result={readyResult} />);

    expect(
      screen.getByText(/prévia demonstrativa — dados e imagens ilustrativos/i),
    ).toBeVisible();
  });

  it('WEBPREVIEW-UI-002 renders one H1 and the editorial collection heading', () => {
    render(<PreviewHome result={readyResult} />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { name: /coleção/i })).toBeVisible();
  });

  it('WEBPREVIEW-UI-003 offers only an in-page non-transactional CTA', () => {
    render(<PreviewHome result={readyResult} />);

    expect(
      screen.getByRole('link', { name: /conhecer a coleção/i }),
    ).toHaveAttribute('href', '#colecao');
  });

  it('WEBPREVIEW-UI-004 renders all four concept cards and their labels', () => {
    render(<PreviewHome result={readyResult} />);

    for (const item of previewItemsFixture) {
      expect(screen.getByText(item.name)).toBeVisible();
    }
    expect(screen.getAllByText('Conceito visual')).toHaveLength(4);
  });

  it('WEBPREVIEW-UI-005 does not render commercial claims', () => {
    const { container } = render(<PreviewHome result={readyResult} />);
    const text = container.textContent ?? '';

    expect(text).not.toMatch(/R\$|comprar|adicionar ao carrinho|em estoque|frete/i);
  });

  it('WEBPREVIEW-UI-006 gives every concept image useful alternative text', () => {
    render(<PreviewHome result={readyResult} />);

    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(4);
    for (const image of images) {
      expect(image).toHaveAccessibleName(/conceitual/i);
      expect(image).toHaveAttribute('sizes');
    }
  });

  it('WEBPREVIEW-UI-007 renders the explicit empty state', () => {
    render(<PreviewHome result={{ status: 'empty', items: [] }} />);

    expect(screen.getByText(/seleção conceitual está sendo preparada/i)).toBeVisible();
  });

  it('WEBPREVIEW-UI-008 renders the safe error message', () => {
    render(
      <PreviewHome
        result={{
          status: 'error',
          message: 'Não foi possível carregar esta prévia agora.',
        }}
      />,
    );

    expect(
      screen.getByText('Não foi possível carregar esta prévia agora.'),
    ).toBeVisible();
  });

  it('WEBPREVIEW-A11Y-001 has no serious or critical axe violations', async () => {
    const { container } = render(<PreviewHome result={readyResult} />);
    const result = await axeCore.run(container);
    const blocking = result.violations.filter(({ impact }) =>
      impact === 'critical' || impact === 'serious',
    );

    expect(blocking).toEqual([]);
  });
});
