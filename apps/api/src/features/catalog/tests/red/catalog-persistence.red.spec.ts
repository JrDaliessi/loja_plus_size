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

  test.todo(
    'CAT-DB-001 / AC-002 rejects duplicate slug in PostgreSQL without mutation',
  );
  test.todo(
    'CAT-DB-002 / AC-004 preserves product+color+size uniqueness under concurrency',
  );
  test.todo('CAT-DB-003 / AC-005 preserves global SKU uniqueness under concurrency');
  test.todo('CAT-DB-004 / AC-007 preserves partial barcode uniqueness');
  test.todo('CAT-DB-005 / AC-011 activates product atomically');
  test.todo('CAT-DB-006 / AC-014 returns stable cursor pages from PostgreSQL');
  test.todo(
    'CAT-SEC-002 / AC-017 keeps commercial tables outside public Data API access',
  );
});
