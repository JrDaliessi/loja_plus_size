import { toPublicProduct } from '../presentation/public-product.projection';
import type { CreateProductDraftRequest } from '../presentation/catalog.schemas';
import type { CatalogActor } from './catalog.ports';
import type { CatalogDependencies } from './catalog.use-cases';
import {
  activateCatalogProduct,
  archiveCatalogProduct,
  createProductDraft,
  listPublicCatalogProducts,
} from './catalog.use-cases';

export class CatalogApplicationService {
  constructor(private readonly dependencies: CatalogDependencies) {}

  createDraft(actor: CatalogActor, input: CreateProductDraftRequest) {
    return createProductDraft(this.dependencies, actor, input);
  }

  activate(actor: CatalogActor, productId: string) {
    return activateCatalogProduct(this.dependencies, actor, productId);
  }

  archive(actor: CatalogActor, productId: string) {
    return archiveCatalogProduct(this.dependencies, actor, productId);
  }

  async listPublic(input: { cursor?: string; limit: number }) {
    const page = await listPublicCatalogProducts(this.dependencies.products, input);
    return {
      items: page.items.map(toPublicProduct),
      ...(page.nextCursor ? { nextCursor: page.nextCursor } : {}),
    };
  }
}
