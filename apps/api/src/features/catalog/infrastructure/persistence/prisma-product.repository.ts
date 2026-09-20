import { z } from 'zod';

import type { ProductRepository } from '../../application/catalog.ports';
import { CatalogError } from '../../domain/catalog.error';
import type {
  CatalogProduct,
  ProductMedia,
  ProductStatus,
  ProductVariant,
} from '../../domain/catalog.types';
import type {
  PrismaCatalogExecutor,
  PrismaCatalogTransactionContext,
} from './prisma-catalog-unit-of-work';
import { mapCatalogPersistenceError } from './catalog-persistence-error.mapper';

const productStatusSchema = z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']);
const cursorSchema = z.object({
  createdAt: z.iso.datetime({ offset: true }),
  id: z.uuid(),
});

interface DecimalLike {
  toString(): string;
}

interface ProductRecord {
  id: string;
  name: string;
  slug: string;
  description: string;
  status: string;
  createdAt: Date;
  categories: Array<{ categoryId: string; isPrimary: boolean }>;
  variants: Array<{
    id: string;
    productId: string;
    colorId: string;
    sizeId: string;
    sku: string;
    priceAmount: DecimalLike | string | number;
    currency: string;
    barcode: string | null;
    status: string;
  }>;
  media: Array<{
    id: string;
    productId: string;
    storagePath: string;
    role: string;
    altText: string;
    position: number;
    variantId: string | null;
    colorId: string | null;
  }>;
}

interface ProductDelegate {
  create?: (args: Record<string, unknown>) => Promise<ProductRecord>;
  findUnique?: (args: Record<string, unknown>) => Promise<ProductRecord | null>;
  findMany?: (args: Record<string, unknown>) => Promise<ProductRecord[]>;
  update?: (args: Record<string, unknown>) => Promise<ProductRecord>;
}

export interface PrismaProductClient extends PrismaCatalogExecutor {
  product: ProductDelegate;
}

const relations = {
  categories: true,
  variants: true,
  media: true,
} as const;

const persistenceUnavailable = (): CatalogError =>
  new CatalogError(
    'CATALOG_PERSISTENCE_UNAVAILABLE',
    'CATALOG_PERSISTENCE_UNAVAILABLE: Prisma product delegate is incomplete',
  );

const executePersistence = async <T>(operation: () => Promise<T>): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    return mapCatalogPersistenceError(error);
  }
};

const parseStatus = (status: string): ProductStatus => {
  const parsed = productStatusSchema.safeParse(status);
  if (!parsed.success) {
    throw new CatalogError(
      'CATALOG_PERSISTENCE_INVALID',
      'CATALOG_PERSISTENCE_INVALID: unsupported product status',
    );
  }
  return parsed.data;
};

const mapRecord = (record: ProductRecord): CatalogProduct => {
  const categories = record.categories.map((category) => category.categoryId);
  const primary = record.categories.find((category) => category.isPrimary)?.categoryId;
  if (!primary || !categories.includes(primary)) {
    throw new CatalogError(
      'CATALOG_PERSISTENCE_INVALID',
      'CATALOG_PERSISTENCE_INVALID: product primary category is missing',
    );
  }

  const variants: ProductVariant[] = record.variants.map((variant) => {
    if (variant.currency !== 'BRL') {
      throw new CatalogError(
        'CATALOG_PERSISTENCE_INVALID',
        'CATALOG_PERSISTENCE_INVALID: unsupported currency',
      );
    }
    return {
      id: variant.id,
      productId: variant.productId,
      colorId: variant.colorId,
      sizeId: variant.sizeId,
      sku: variant.sku,
      price: { amount: variant.priceAmount.toString(), currency: 'BRL' },
      ...(variant.barcode ? { barcode: variant.barcode } : {}),
      status: parseStatus(variant.status),
    };
  });
  const media: ProductMedia[] = record.media.map((item) => ({
    id: item.id,
    productId: item.productId,
    storagePath: item.storagePath,
    role: item.role,
    altText: item.altText,
    position: item.position,
    ...(item.variantId ? { variantId: item.variantId } : {}),
    ...(item.colorId ? { colorId: item.colorId } : {}),
  }));

  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    description: record.description,
    categoryIds: categories,
    primaryCategoryId: primary,
    status: parseStatus(record.status),
    variants,
    media,
  };
};

const encodeCursor = (record: ProductRecord): string =>
  Buffer.from(
    JSON.stringify({ createdAt: record.createdAt.toISOString(), id: record.id }),
    'utf8',
  ).toString('base64url');

const decodeCursor = (cursor: string): z.infer<typeof cursorSchema> => {
  try {
    const value: unknown = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
    return cursorSchema.parse(value);
  } catch {
    throw new CatalogError(
      'CATALOG_INVALID_CURSOR',
      'CATALOG_INVALID_CURSOR: malformed catalog cursor',
    );
  }
};

export class PrismaProductRepository implements ProductRepository {
  constructor(
    private readonly rootClient: PrismaProductClient,
    private readonly context?: PrismaCatalogTransactionContext,
  ) {}

  private client(): PrismaProductClient {
    const client = this.context?.current(this.rootClient) ?? this.rootClient;
    return client as PrismaProductClient;
  }

  async create(product: CatalogProduct): Promise<CatalogProduct> {
    const delegate = this.client().product;
    if (!delegate.create) throw persistenceUnavailable();
    const record = await executePersistence(() =>
      delegate.create!({
        data: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          status: product.status,
          categories: {
            create: product.categoryIds.map((categoryId) => ({
              categoryId,
              isPrimary: categoryId === product.primaryCategoryId,
            })),
          },
        },
        include: relations,
      }),
    );
    return mapRecord(record);
  }

  async findById(id: string): Promise<CatalogProduct | null> {
    const delegate = this.client().product;
    if (!delegate.findUnique) throw persistenceUnavailable();
    const record = await executePersistence(() =>
      delegate.findUnique!({ where: { id }, include: relations }),
    );
    return record ? mapRecord(record) : null;
  }

  async findBySlug(slug: string): Promise<CatalogProduct | null> {
    const delegate = this.client().product;
    if (!delegate.findUnique) throw persistenceUnavailable();
    const record = await executePersistence(() =>
      delegate.findUnique!({ where: { slug }, include: relations }),
    );
    return record ? mapRecord(record) : null;
  }

  async save(product: CatalogProduct): Promise<CatalogProduct> {
    const delegate = this.client().product;
    if (!delegate.update) throw persistenceUnavailable();
    const record = await executePersistence(() =>
      delegate.update!({
        where: { id: product.id },
        data: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          status: product.status,
        },
        include: relations,
      }),
    );
    return mapRecord(record);
  }

  async listPublic(input: {
    cursor?: string;
    limit: number;
  }): Promise<{ items: CatalogProduct[]; nextCursor?: string }> {
    const delegate = this.client().product;
    if (!delegate.findMany) throw persistenceUnavailable();
    const cursor = input.cursor ? decodeCursor(input.cursor) : undefined;
    const where = cursor
      ? {
          status: 'ACTIVE',
          OR: [
            { createdAt: { gt: new Date(cursor.createdAt) } },
            {
              createdAt: new Date(cursor.createdAt),
              id: { gt: cursor.id },
            },
          ],
        }
      : { status: 'ACTIVE' };
    const records = await executePersistence(() =>
      delegate.findMany!({
        where,
        include: relations,
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        take: input.limit + 1,
      }),
    );
    const pageRecords = records.slice(0, input.limit);
    const items = pageRecords.map(mapRecord);
    const last = pageRecords.at(-1);
    const nextCursor = records.length > input.limit && last ? encodeCursor(last) : undefined;
    return nextCursor ? { items, nextCursor } : { items };
  }
}
