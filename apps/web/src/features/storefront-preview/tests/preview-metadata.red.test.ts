import { describe, expect, it } from 'vitest';

import { previewMetadata } from '../presentation/preview-metadata';

describe('preview metadata — RED', () => {
  it('WEBPREVIEW-META-001 defines a useful title and description', () => {
    expect(previewMetadata.title).toBe('Plus Store — Prévia Purple Noir');
    expect(previewMetadata.description).toMatch(/moda plus size/i);
  });

  it('WEBPREVIEW-META-002 prevents indexing illustrative content', () => {
    expect(previewMetadata.robots).toMatchObject({
      index: false,
      follow: false,
    });
  });
});
