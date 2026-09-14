import type { CatalogProduct } from '../domain/catalog.types';

export type CatalogPermission =
  | 'catalog:read'
  | 'catalog:write'
  | 'catalog:publish'
  | 'media:write';

export interface CatalogActor {
  id: string;
  permissions: CatalogPermission[];
}

export interface ProductRepository {
  create(product: CatalogProduct): Promise<CatalogProduct>;
  findById(id: string): Promise<CatalogProduct | null>;
  findBySlug(slug: string): Promise<CatalogProduct | null>;
  save(product: CatalogProduct): Promise<CatalogProduct>;
  listPublic(input: {
    cursor?: string;
    limit: number;
  }): Promise<{ items: CatalogProduct[]; nextCursor?: string }>;
}

export interface CatalogUnitOfWork {
  run<T>(operation: () => Promise<T>): Promise<T>;
}
