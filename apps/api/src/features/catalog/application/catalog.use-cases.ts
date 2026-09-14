import { CatalogNotImplementedError } from '../domain/catalog.error';
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

const missing = (capability: string): never => {
  throw new CatalogNotImplementedError(capability);
};

export const createProductDraft = async (
  _dependencies: CatalogDependencies,
  _actor: CatalogActor,
  _input: Omit<CatalogProduct, 'id' | 'status' | 'variants' | 'media'>,
): Promise<CatalogProduct> => missing('createProductDraft');

export const activateCatalogProduct = async (
  _dependencies: CatalogDependencies,
  _actor: CatalogActor,
  _productId: string,
): Promise<CatalogProduct> => missing('activateCatalogProduct');

export const archiveCatalogProduct = async (
  _dependencies: CatalogDependencies,
  _actor: CatalogActor,
  _productId: string,
): Promise<CatalogProduct> => missing('archiveCatalogProduct');

export const listPublicCatalogProducts = async (
  _products: ProductRepository,
  _input: { cursor?: string; limit: number },
): Promise<{ items: CatalogProduct[]; nextCursor?: string }> =>
  missing('listPublicCatalogProducts');
