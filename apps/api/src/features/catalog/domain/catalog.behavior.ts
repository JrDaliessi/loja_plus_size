import { randomUUID } from 'node:crypto';

import { CatalogError } from './catalog.error';
import type {
  CatalogEvent,
  CatalogProduct,
  Money,
  ProductMedia,
  ProductVariant,
  PublicationResult,
} from './catalog.types';

const fail = (code: string, message: string): never => {
  throw new CatalogError(code, `${code}: ${message}`);
};

export const canonicalizeSku = (value: string): string => {
  const canonical = value.trim().toUpperCase();
  if (!canonical) {
    return fail('CATALOG_INVALID_SKU', 'SKU is required');
  }
  return canonical;
};

export const createMoney = (amount: string, currency: 'BRL'): Money => {
  const normalized = amount.trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized) || Number(normalized) <= 0) {
    return fail('CATALOG_INVALID_PRICE', 'price must be positive with at most two decimal places');
  }

  const [whole, decimals = ''] = normalized.split('.');
  return { amount: `${whole}.${decimals.padEnd(2, '0')}`, currency };
};

export const normalizeBarcode = (value?: string): string | undefined => {
  const normalized = value?.trim();
  return normalized || undefined;
};

export const createOrderedSize = (
  code: string,
  label: string,
  position: number,
): { code: string; label: string; position: number } => {
  if (!code.trim() || !label.trim() || !Number.isInteger(position) || position < 0) {
    return fail('CATALOG_INVALID_SIZE', 'size requires code, label and a non-negative position');
  }
  return { code: code.trim().toUpperCase(), label: label.trim(), position };
};

export const addVariant = (
  product: CatalogProduct,
  variant: ProductVariant,
): CatalogProduct => {
  if (variant.productId !== product.id) {
    return fail('CATALOG_VARIANT_PRODUCT_MISMATCH', 'variant belongs to another product');
  }
  if (
    product.variants.some(
      (current) => current.colorId === variant.colorId && current.sizeId === variant.sizeId,
    )
  ) {
    return fail('CATALOG_VARIANT_CONFLICT', 'color and size combination already exists');
  }

  const barcode = normalizeBarcode(variant.barcode);
  const normalizedVariant: ProductVariant = {
    ...variant,
    sku: canonicalizeSku(variant.sku),
    price: createMoney(variant.price.amount, variant.price.currency),
    ...(barcode ? { barcode } : {}),
  };
  return { ...product, variants: [...product.variants, normalizedVariant] };
};

export const createProductMedia = (
  product: CatalogProduct,
  media: ProductMedia,
): ProductMedia => {
  const normalizedPath = media.storagePath.replace(/\\/g, '/');
  if (
    media.productId !== product.id ||
    !normalizedPath.startsWith(`${product.id}/`) ||
    normalizedPath.split('/').includes('..')
  ) {
    return fail('CATALOG_MEDIA_PRODUCT_MISMATCH', 'media must stay inside the product namespace');
  }
  if (!media.altText.trim() || !Number.isInteger(media.position) || media.position < 0) {
    return fail('CATALOG_INVALID_MEDIA', 'media requires alt text and a non-negative position');
  }
  if (media.variantId && !product.variants.some((variant) => variant.id === media.variantId)) {
    return fail('CATALOG_MEDIA_PRODUCT_MISMATCH', 'variant does not belong to product');
  }
  if (media.colorId && !product.variants.some((variant) => variant.colorId === media.colorId)) {
    return fail('CATALOG_MEDIA_PRODUCT_MISMATCH', 'color does not belong to product');
  }
  return { ...media, storagePath: normalizedPath, altText: media.altText.trim() };
};

export const evaluatePublication = (
  product: CatalogProduct,
): PublicationResult => {
  const issues: string[] = [];
  if (!product.description.trim()) issues.push('DESCRIPTION_REQUIRED');
  if (!product.primaryCategoryId || !product.categoryIds.includes(product.primaryCategoryId)) {
    issues.push('ACTIVE_CATEGORY_REQUIRED');
  }
  if (product.media.length === 0) issues.push('ACTIVE_MEDIA_REQUIRED');
  if (product.variants.every((variant) => variant.status !== 'ACTIVE')) {
    issues.push('ACTIVE_VARIANT_REQUIRED');
  }
  return { canActivate: issues.length === 0, issues };
};

export const activateProduct = (product: CatalogProduct): CatalogProduct => {
  const publication = evaluatePublication(product);
  if (!publication.canActivate) {
    return fail(
      'CATALOG_PUBLICATION_INCOMPLETE',
      `publication issues: ${publication.issues.join(',')}`,
    );
  }
  return { ...product, status: 'ACTIVE' };
};

export const archiveProduct = (product: CatalogProduct): CatalogProduct => ({
  ...product,
  status: 'ARCHIVED',
});

export const createCatalogEvent = (
  eventType: string,
  aggregateId: string,
  now: Date,
): CatalogEvent => ({
  eventId: randomUUID(),
  eventType,
  eventVersion: 1,
  aggregateId,
  occurredAt: now.toISOString(),
});

export const catalogEntityFieldNames = (): readonly string[] =>
  [
    'id',
    'name',
    'slug',
    'description',
    'categoryIds',
    'primaryCategoryId',
    'status',
    'variants',
    'media',
  ] as const;
