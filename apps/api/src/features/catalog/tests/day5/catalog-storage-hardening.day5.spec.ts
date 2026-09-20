import { jest } from '@jest/globals';

import {
  SupabaseProductMediaStorageAdapter,
  type SupabaseStorageClient,
} from '../../infrastructure/storage/supabase-product-media-storage.adapter';
import { catalogIds } from '../fixtures/catalog.fixtures';

describe('FEATURE-CATALOG Dia 5 Storage hardening', () => {
  test('CAT-STO-008 normalizes thrown provider failures during signed upload creation', async () => {
    const adapter = new SupabaseProductMediaStorageAdapter(
      {
        storage: {
          from: jest.fn<SupabaseStorageClient['storage']['from']>(() => ({
            createSignedUploadUrl: jest.fn(async () => {
              throw new Error('provider endpoint and credentials must not escape');
            }),
          })),
        },
      },
      'product-media',
    );

    await expect(
      adapter.requestUpload({
        productId: catalogIds.product,
        mediaId: catalogIds.media,
        contentType: 'image/webp',
        contentLength: 512,
      }),
    ).rejects.toMatchObject({ code: 'CATALOG_STORAGE_UNAVAILABLE' });
  });

  test('CAT-STO-009 normalizes thrown provider failures during object verification', async () => {
    const adapter = new SupabaseProductMediaStorageAdapter(
      {
        storage: {
          from: jest.fn<SupabaseStorageClient['storage']['from']>(() => ({
            list: jest.fn(async () => {
              throw new Error('provider endpoint and credentials must not escape');
            }),
          })),
        },
      },
      'product-media',
    );

    await expect(
      adapter.objectExists(`${catalogIds.product}/${catalogIds.media}.webp`),
    ).rejects.toMatchObject({ code: 'CATALOG_STORAGE_UNAVAILABLE' });
  });

  test('CAT-STO-010 bounds reconciliation concurrency to ten Storage requests', async () => {
    let active = 0;
    let peak = 0;
    const list = jest.fn(async () => {
      active += 1;
      peak = Math.max(peak, active);
      await new Promise((resolve) => setTimeout(resolve, 5));
      active -= 1;
      return { data: [], error: null };
    });
    const adapter = new SupabaseProductMediaStorageAdapter(
      {
        storage: {
          from: jest.fn<SupabaseStorageClient['storage']['from']>(() => ({ list })),
        },
      },
      'product-media',
    );
    const paths = Array.from(
      { length: 25 },
      (_, index) =>
        `${catalogIds.product}/018f0f4d-0000-7000-8000-${index.toString().padStart(12, '0')}.webp`,
    );

    await expect(adapter.findMissingObjects(paths)).resolves.toEqual(paths);
    expect(peak).toBeLessThanOrEqual(10);
  });
});
