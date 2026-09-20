import type { CatalogActor } from '../../application/catalog.ports';
import type { CatalogProduct } from '../../domain/catalog.types';
import type {
  CatalogPageQuery,
  CreateProductDraftRequest,
} from '../catalog.schemas';
import type { PublicProductDto } from '../public-product.projection';

export const CATALOG_IDENTITY = Symbol('CATALOG_IDENTITY');
export const CATALOG_HTTP_SERVICE = Symbol('CATALOG_HTTP_SERVICE');

export interface CatalogIdentity {
  authenticate(authorization?: string): Promise<CatalogActor>;
}

export interface CatalogHttpService {
  createDraft(
    actor: CatalogActor,
    input: CreateProductDraftRequest,
  ): Promise<CatalogProduct>;
  activate(actor: CatalogActor, productId: string): Promise<CatalogProduct>;
  archive(actor: CatalogActor, productId: string): Promise<CatalogProduct>;
  listPublic(input: CatalogPageQuery): Promise<{
    items: PublicProductDto[];
    nextCursor?: string;
  }>;
}
