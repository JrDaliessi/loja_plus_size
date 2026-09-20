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

export const mapCatalogPersistenceError = (error: PersistenceFailure): never => {
  const target = Array.isArray(error.meta?.target)
    ? error.meta.target.join(',')
    : (error.meta?.target ?? error.constraint ?? '');

  if (error.code === 'P2002') {
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
    'CATALOG_PERSISTENCE_FAILURE',
    'CATALOG_PERSISTENCE_FAILURE: catalog persistence failed',
  );
};
