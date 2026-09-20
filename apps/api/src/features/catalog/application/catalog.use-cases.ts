import { randomBytes } from 'node:crypto';

import { activateProduct, archiveProduct } from '../domain/catalog.behavior';
import { CatalogError } from '../domain/catalog.error';
import type { CatalogProduct } from '../domain/catalog.types';
import type {
  CatalogActor,
  CatalogUnitOfWork,
  ProductRepository,
} from './catalog.ports';

export interface CatalogDependencies {
  products: ProductRepository;
  unitOfWork: CatalogUnitOfWork;
}

const requirePermission = (
  actor: CatalogActor,
  permission: CatalogActor['permissions'][number],
): void => {
  if (!actor.permissions.includes(permission)) {
    throw new CatalogError('CATALOG_FORBIDDEN', 'CATALOG_FORBIDDEN: insufficient permission');
  }
};

const createUuidV7 = (): string => {
  const bytes = randomBytes(16);
  let timestamp = BigInt(Date.now());
  for (let index = 5; index >= 0; index -= 1) {
    bytes[index] = Number(timestamp & 0xffn);
    timestamp >>= 8n;
  }
  bytes[6] = (bytes[6]! & 0x0f) | 0x70;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};

export const createProductDraft = async (
  dependencies: CatalogDependencies,
  actor: CatalogActor,
  input: Omit<CatalogProduct, 'id' | 'status' | 'variants' | 'media'>,
): Promise<CatalogProduct> => {
  requirePermission(actor, 'catalog:write');
  return dependencies.unitOfWork.run(async () => {
    if (await dependencies.products.findBySlug(input.slug)) {
      throw new CatalogError('CATALOG_SLUG_CONFLICT', 'CATALOG_SLUG_CONFLICT: slug already exists');
    }
    return dependencies.products.create({
      ...input,
      id: createUuidV7(),
      status: 'DRAFT',
      variants: [],
      media: [],
    });
  });
};

export const activateCatalogProduct = async (
  dependencies: CatalogDependencies,
  actor: CatalogActor,
  productId: string,
): Promise<CatalogProduct> => {
  requirePermission(actor, 'catalog:publish');
  return dependencies.unitOfWork.run(async () => {
    const product = await dependencies.products.findById(productId);
    if (!product) {
      throw new CatalogError('CATALOG_PRODUCT_NOT_FOUND', 'CATALOG_PRODUCT_NOT_FOUND: product not found');
    }
    return dependencies.products.save(activateProduct(product));
  });
};

export const archiveCatalogProduct = async (
  dependencies: CatalogDependencies,
  actor: CatalogActor,
  productId: string,
): Promise<CatalogProduct> => {
  requirePermission(actor, 'catalog:publish');
  return dependencies.unitOfWork.run(async () => {
    const product = await dependencies.products.findById(productId);
    if (!product) {
      throw new CatalogError('CATALOG_PRODUCT_NOT_FOUND', 'CATALOG_PRODUCT_NOT_FOUND: product not found');
    }
    return dependencies.products.save(archiveProduct(product));
  });
};

export const listPublicCatalogProducts = async (
  products: ProductRepository,
  input: { cursor?: string; limit: number },
): Promise<{ items: CatalogProduct[]; nextCursor?: string }> => {
  if (!Number.isInteger(input.limit) || input.limit < 1 || input.limit > 100) {
    throw new CatalogError('CATALOG_INVALID_PAGE', 'CATALOG_INVALID_PAGE: limit must be between 1 and 100');
  }
  const page = await products.listPublic({ ...input, limit: input.limit + 1 });
  const items = page.items.slice(0, input.limit);
  const last = items.at(-1);
  const nextCursor =
    page.nextCursor ??
    (page.items.length > input.limit && last
      ? Buffer.from(last.id, 'utf8').toString('base64url')
      : undefined);
  return nextCursor ? { items, nextCursor } : { items };
};
