export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface Money {
  amount: string;
  currency: 'BRL';
}

export interface ProductVariant {
  id: string;
  productId: string;
  colorId: string;
  sizeId: string;
  sku: string;
  price: Money;
  barcode?: string;
  status: ProductStatus;
}

export interface ProductMedia {
  id: string;
  productId: string;
  storagePath: string;
  role: string;
  altText: string;
  position: number;
  variantId?: string;
  colorId?: string;
}

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryIds: string[];
  primaryCategoryId: string;
  status: ProductStatus;
  variants: ProductVariant[];
  media: ProductMedia[];
}

export interface CatalogEvent {
  eventId: string;
  eventType: string;
  eventVersion: number;
  aggregateId: string;
  occurredAt: string;
}

export interface PublicationResult {
  canActivate: boolean;
  issues: string[];
}
