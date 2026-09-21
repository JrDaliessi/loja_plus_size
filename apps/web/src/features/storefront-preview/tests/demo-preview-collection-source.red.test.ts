import { describe, expect, it } from 'vitest';

import { demoPreviewCollectionSource } from '../infrastructure/demo-preview-collection-source';

describe('demoPreviewCollectionSource — RED', () => {
  it('WEBPREVIEW-INFRA-001 exposes four illustrative records without commerce fields', async () => {
    const items = await demoPreviewCollectionSource.list();

    expect(items).toHaveLength(4);
    for (const item of items) {
      expect(item.conceptLabel).toBe('Conceito visual');
      expect(item.image.alt).toMatch(/conceitual/i);
      expect(item).not.toHaveProperty('price');
      expect(item).not.toHaveProperty('stock');
      expect(item).not.toHaveProperty('availability');
    }
  });
});
