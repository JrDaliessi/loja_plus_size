import { describe, expect, it } from 'vitest';

import { getPreviewCollection } from '../application/get-preview-collection';
import type { PreviewCollectionSource } from '../application/preview-collection-source';
import { previewItemsFixture } from './fixtures';

describe('getPreviewCollection — RED', () => {
  it('WEBPREVIEW-APP-001 returns ready with the four deterministic items', async () => {
    const source: PreviewCollectionSource = {
      async list() {
        return previewItemsFixture;
      },
    };

    await expect(getPreviewCollection(source)).resolves.toEqual({
      status: 'ready',
      items: previewItemsFixture,
    });
  });

  it('WEBPREVIEW-APP-002 returns the explicit empty state', async () => {
    const source: PreviewCollectionSource = {
      async list() {
        return [];
      },
    };

    await expect(getPreviewCollection(source)).resolves.toEqual({
      status: 'empty',
      items: [],
    });
  });

  it('WEBPREVIEW-APP-003 normalizes source failures without leaking details', async () => {
    const source: PreviewCollectionSource = {
      async list() {
        throw new Error('private provider detail');
      },
    };

    await expect(getPreviewCollection(source)).resolves.toEqual({
      status: 'error',
      message: 'Não foi possível carregar esta prévia agora.',
    });
  });
});
