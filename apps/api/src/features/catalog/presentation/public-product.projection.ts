import { CatalogNotImplementedError } from '../domain/catalog.error';
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

export const toPublicProduct = (_product: CatalogProduct): PublicProductDto => {
  throw new CatalogNotImplementedError('toPublicProduct');
};
