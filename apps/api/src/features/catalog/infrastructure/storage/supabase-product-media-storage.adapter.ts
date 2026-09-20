import { z } from 'zod';

import { CatalogError } from '../../domain/catalog.error';

const uploadRequestSchema = z.object({
  productId: z.uuid(),
  mediaId: z.uuid(),
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  contentLength: z.number().int().positive().max(10_000_000),
});

const extensionByContentType = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
} as const;

interface StorageError {
  message: string;
}

interface StorageBucketClient {
  createSignedUploadUrl(
    path: string,
    options: { upsert: false },
  ): Promise<{
    data: { signedUrl: string; token: string } | null;
    error: StorageError | null;
  }>;
  list(
    path: string,
    options: { limit: number; search: string },
  ): Promise<{
    data: Array<{ name: string }> | null;
    error: StorageError | null;
  }>;
}

export interface SupabaseStorageClient {
  storage: {
    from(bucket: string): Partial<StorageBucketClient>;
  };
}

export interface ProductMediaUploadGrant {
  storagePath: string;
  signedUrl: string;
  token: string;
}

const storageUnavailable = (): CatalogError =>
  new CatalogError(
    'CATALOG_STORAGE_UNAVAILABLE',
    'CATALOG_STORAGE_UNAVAILABLE: media storage operation failed',
  );

export class SupabaseProductMediaStorageAdapter {
  constructor(
    private readonly client: SupabaseStorageClient,
    private readonly bucket: string,
  ) {
    if (!bucket.trim()) {
      throw new CatalogError(
        'CATALOG_STORAGE_CONFIGURATION_INVALID',
        'CATALOG_STORAGE_CONFIGURATION_INVALID: bucket is required',
      );
    }
  }

  async requestUpload(input: unknown): Promise<ProductMediaUploadGrant> {
    const parsed = uploadRequestSchema.safeParse(input);
    if (!parsed.success) {
      throw new CatalogError(
        'CATALOG_INVALID_MEDIA_UPLOAD',
        'CATALOG_INVALID_MEDIA_UPLOAD: unsupported media metadata',
      );
    }

    const { productId, mediaId, contentType } = parsed.data;
    const extension = extensionByContentType[contentType];
    const storagePath = `${productId}/${mediaId}.${extension}`;
    const bucket = this.client.storage.from(this.bucket);
    if (!bucket.createSignedUploadUrl) {
      throw storageUnavailable();
    }
    let result: Awaited<ReturnType<StorageBucketClient['createSignedUploadUrl']>>;
    try {
      result = await bucket.createSignedUploadUrl(storagePath, { upsert: false });
    } catch {
      throw storageUnavailable();
    }
    if (result.error || !result.data) {
      throw storageUnavailable();
    }

    return {
      storagePath,
      signedUrl: result.data.signedUrl,
      token: result.data.token,
    };
  }

  async objectExists(storagePath: string): Promise<boolean> {
    const normalized = storagePath.replace(/\\/g, '/');
    const segments = normalized.split('/');
    if (
      segments.length !== 2 ||
      segments.includes('..') ||
      !segments[0] ||
      !segments[1]
    ) {
      throw new CatalogError(
        'CATALOG_INVALID_MEDIA_PATH',
        'CATALOG_INVALID_MEDIA_PATH: path must remain inside a product namespace',
      );
    }

    const bucket = this.client.storage.from(this.bucket);
    if (!bucket.list) {
      throw storageUnavailable();
    }
    let result: Awaited<ReturnType<StorageBucketClient['list']>>;
    try {
      result = await bucket.list(segments[0], {
        limit: 1,
        search: segments[1],
      });
    } catch {
      throw storageUnavailable();
    }
    if (result.error || !result.data) {
      throw storageUnavailable();
    }
    return result.data.some((object) => object.name === segments[1]);
  }

  async findMissingObjects(storagePaths: string[]): Promise<string[]> {
    const uniquePaths = [...new Set(storagePaths)];
    if (uniquePaths.length > 100) {
      throw new CatalogError(
        'CATALOG_INVALID_MEDIA_RECONCILIATION',
        'CATALOG_INVALID_MEDIA_RECONCILIATION: at most 100 paths are allowed',
      );
    }
    const missing: string[] = [];
    const batchSize = 10;
    for (let start = 0; start < uniquePaths.length; start += batchSize) {
      const batch = uniquePaths.slice(start, start + batchSize);
      const existence = await Promise.all(
        batch.map(async (storagePath) => ({
          storagePath,
          exists: await this.objectExists(storagePath),
        })),
      );
      missing.push(
        ...existence
          .filter((result) => !result.exists)
          .map((result) => result.storagePath),
      );
    }
    return missing;
  }
}
