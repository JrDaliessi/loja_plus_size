import { CatalogError } from '../../domain/catalog.error';

export interface PersistenceFailure {
  code?: string;
  constraint?: string;
  message: string;
  meta?: {
    modelName?: string;
    target?: string | string[];
  };
}

export const mapCatalogPersistenceError = (error: unknown): never => {
  const failure =
    typeof error === 'object' && error !== null
      ? (error as Partial<PersistenceFailure>)
      : {};
  const target = Array.isArray(failure.meta?.target)
    ? failure.meta.target.join(',')
    : (failure.meta?.target ?? failure.constraint ?? '');

  if (failure.code === 'P2002') {
    if (target.includes('sku')) {
      throw new CatalogError('CATALOG_SKU_CONFLICT', 'CATALOG_SKU_CONFLICT: SKU already exists');
    }
    if (target.includes('slug')) {
      throw new CatalogError('CATALOG_SLUG_CONFLICT', 'CATALOG_SLUG_CONFLICT: slug already exists');
    }
    if (
      target.includes('product_id') &&
      target.includes('color_id') &&
      target.includes('size_id')
    ) {
      throw new CatalogError(
        'CATALOG_VARIANT_CONFLICT',
        'CATALOG_VARIANT_CONFLICT: color and size combination already exists',
      );
    }
    if (target.includes('barcode')) {
      throw new CatalogError('CATALOG_BARCODE_CONFLICT', 'CATALOG_BARCODE_CONFLICT: barcode already exists');
    }
  }

  throw new CatalogError(
    'CATALOG_PERSISTENCE_UNAVAILABLE',
    'CATALOG_PERSISTENCE_UNAVAILABLE: catalog persistence failed',
  );
};
