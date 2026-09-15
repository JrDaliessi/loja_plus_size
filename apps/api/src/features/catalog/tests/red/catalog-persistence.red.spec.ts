import { mapCatalogPersistenceError } from '../../infrastructure/persistence/catalog-persistence-error.mapper';

describe('FEATURE-CATALOG persistence RED contract', () => {
  test('CAT-DB-007 / AC-015 maps Prisma 7 P2002 SKU violations', () => {
    expect(() =>
      mapCatalogPersistenceError({
        code: 'P2002',
        message: 'Unique constraint failed',
        meta: {
          modelName: 'ProductVariant',
          target: ['sku'],
        },
      }),
    ).toThrow('CATALOG_SKU_CONFLICT');
  });
});
