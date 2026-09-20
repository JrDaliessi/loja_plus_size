import { CatalogError } from '../domain/catalog.error';
import type { CatalogProduct } from '../domain/catalog.types';

export interface PublicProductDto {
  id: string;
  name: string;
  slug: string;
  description: string;
  variants: Array<{
    sku: string;
    colorId: string;
    sizeId: string;
    price: { amount: string; currency: 'BRL' };
  }>;
}

export const toPublicProduct = (product: CatalogProduct): PublicProductDto => {
  if (product.status !== 'ACTIVE') {
    throw new CatalogError(
      'CATALOG_PRODUCT_NOT_FOUND',
      'CATALOG_PRODUCT_NOT_FOUND: product is not publicly visible',
    );
  }
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    variants: product.variants
      .filter((variant) => variant.status === 'ACTIVE')
      .map(({ sku, colorId, sizeId, price }) => ({
        sku,
        colorId,
        sizeId,
        price: { ...price },
      })),
  };
};
