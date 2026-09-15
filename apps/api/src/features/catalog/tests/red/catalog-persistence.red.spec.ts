import { mapCatalogPersistenceError } from '../../infrastructure/persistence/catalog-persistence-error.mapper';

describe('FEATURE-CATALOG persistence RED contract', () => {
  test('CAT-DB-007 / AC-015 maps unique violations without Prisma 7 error codes', () => {
    expect(() =>
      mapCatalogPersistenceError({
        constraint: 'product_variants_sku_key',
        message: 'unique constraint violation',
      }),
    ).toThrow('CATALOG_SKU_CONFLICT');
  });
});
