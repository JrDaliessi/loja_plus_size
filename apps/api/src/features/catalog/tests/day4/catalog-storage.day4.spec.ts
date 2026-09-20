import { jest } from '@jest/globals';

import {
  SupabaseProductMediaStorageAdapter,
  type SupabaseStorageClient,
} from '../../infrastructure/storage/supabase-product-media-storage.adapter';
import { catalogIds } from '../fixtures/catalog.fixtures';

describe('FEATURE-CATALOG Dia 4 Storage adapter', () => {
  test('CAT-STO-002 issues a non-upsert signed upload for a server-controlled path', async () => {
    const createSignedUploadUrl = jest.fn(async () => ({
      data: { signedUrl: 'https://storage.example/upload', token: 'signed-token' },
      error: null,
    }));
    const from = jest.fn<SupabaseStorageClient['storage']['from']>(() => ({
      createSignedUploadUrl,
    }));
    const adapter = new SupabaseProductMediaStorageAdapter({ storage: { from } }, 'product-media');

    await expect(
      adapter.requestUpload({
        productId: catalogIds.product,
        mediaId: catalogIds.media,
        contentType: 'image/webp',
        contentLength: 2_000_000,
      }),
    ).resolves.toEqual({
      storagePath: `${catalogIds.product}/${catalogIds.media}.webp`,
      signedUrl: 'https://storage.example/upload',
      token: 'signed-token',
    });

    expect(from).toHaveBeenCalledWith('product-media');
    expect(createSignedUploadUrl).toHaveBeenCalledWith(
      `${catalogIds.product}/${catalogIds.media}.webp`,
      { upsert: false },
    );
  });

  test.each([
    ['application/pdf', 100],
    ['image/webp', 10_000_001],
  ])('CAT-STO-003 rejects disallowed content metadata before Storage access', async (contentType, contentLength) => {
    const from = jest.fn<SupabaseStorageClient['storage']['from']>();
    const adapter = new SupabaseProductMediaStorageAdapter({ storage: { from } }, 'product-media');

    await expect(
      adapter.requestUpload({
        productId: catalogIds.product,
        mediaId: catalogIds.media,
        contentType,
        contentLength,
      }),
    ).rejects.toMatchObject({ code: 'CATALOG_INVALID_MEDIA_UPLOAD' });
    expect(from).not.toHaveBeenCalled();
  });

  test('CAT-STO-004 verifies object completion without exposing bucket mutation', async () => {
    const list = jest.fn(async () => ({
      data: [{ name: `${catalogIds.media}.webp` }],
      error: null,
    }));
    const adapter = new SupabaseProductMediaStorageAdapter(
      {
        storage: {
          from: jest.fn<SupabaseStorageClient['storage']['from']>(() => ({ list })),
        },
      },
      'product-media',
    );
    const path = `${catalogIds.product}/${catalogIds.media}.webp`;

    await expect(adapter.objectExists(path)).resolves.toBe(true);
    expect(list).toHaveBeenCalledWith(catalogIds.product, {
      limit: 1,
      search: `${catalogIds.media}.webp`,
    });
  });

  test('CAT-STO-005 rejects path traversal before querying Storage', async () => {
    const from = jest.fn<SupabaseStorageClient['storage']['from']>();
    const adapter = new SupabaseProductMediaStorageAdapter({ storage: { from } }, 'product-media');

    await expect(adapter.objectExists(`${catalogIds.product}/../secret`)).rejects.toMatchObject({
      code: 'CATALOG_INVALID_MEDIA_PATH',
    });
    expect(from).not.toHaveBeenCalled();
  });

  test('CAT-STO-006 maps Storage failures without leaking provider details', async () => {
    const createSignedUploadUrl = jest.fn(async () => ({
      data: null,
      error: { message: 'provider-internal-detail' },
    }));
    const adapter = new SupabaseProductMediaStorageAdapter(
      {
        storage: {
          from: jest.fn<SupabaseStorageClient['storage']['from']>(() => ({
            createSignedUploadUrl,
          })),
        },
      },
      'product-media',
    );

    await expect(
      adapter.requestUpload({
        productId: catalogIds.product,
        mediaId: catalogIds.media,
        contentType: 'image/png',
        contentLength: 100,
      }),
    ).rejects.toMatchObject({ code: 'CATALOG_STORAGE_UNAVAILABLE' });
  });

  test('CAT-STO-007 reconciles metadata paths and reports only missing objects', async () => {
    const existingPath = `${catalogIds.product}/${catalogIds.media}.webp`;
    const missingPath = `${catalogIds.product}/${catalogIds.anotherProduct}.webp`;
    const list = jest.fn(async (_folder: string, options: { limit: number; search: string }) => ({
      data:
        options.search === `${catalogIds.media}.webp`
          ? [{ name: `${catalogIds.media}.webp` }]
          : [],
      error: null,
    }));
    const adapter = new SupabaseProductMediaStorageAdapter(
      {
        storage: {
          from: jest.fn<SupabaseStorageClient['storage']['from']>(() => ({ list })),
        },
      },
      'product-media',
    );

    await expect(adapter.findMissingObjects([existingPath, missingPath])).resolves.toEqual([
      missingPath,
    ]);
  });
});
