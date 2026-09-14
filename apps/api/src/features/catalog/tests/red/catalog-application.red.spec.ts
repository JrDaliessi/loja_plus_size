import {
  activateCatalogProduct,
  archiveCatalogProduct,
  createProductDraft,
  listPublicCatalogProducts,
} from '../../application/catalog.use-cases';
import type { CatalogActor } from '../../application/catalog.ports';
import {
  FakeCatalogUnitOfWork,
  FakeProductRepository,
  catalogIds,
  completeDraftProduct,
} from '../fixtures/catalog.fixtures';

const writer: CatalogActor = {
  id: 'staff-001',
  permissions: ['catalog:read', 'catalog:write', 'catalog:publish'],
};

describe('FEATURE-CATALOG application RED contract', () => {
  test('CAT-APP-001 / AC-001 creates and returns a DRAFT product', async () => {
    const products = new FakeProductRepository();
    const unitOfWork = new FakeCatalogUnitOfWork();
    const result = await createProductDraft(
      { products, unitOfWork },
      writer,
      {
        name: 'Vestido Purple Noir',
        slug: 'vestido-purple-noir',
        description: 'Vestido midi roxo com caimento evasê.',
        categoryIds: [catalogIds.category],
        primaryCategoryId: catalogIds.category,
      },
    );
    expect(result.status).toBe('DRAFT');
    expect(result.id).toBeTruthy();
    expect(products.calls).toContain('create');
  });

  test('CAT-APP-002 / AC-002 rejects a duplicate slug without saving', async () => {
    const products = new FakeProductRepository([completeDraftProduct()]);
    const unitOfWork = new FakeCatalogUnitOfWork();
    await expect(
      createProductDraft({ products, unitOfWork }, writer, {
        name: 'Outro vestido',
        slug: 'vestido-purple-noir',
        description: 'Não deve sobrescrever o registro existente.',
        categoryIds: [catalogIds.category],
        primaryCategoryId: catalogIds.category,
      }),
    ).rejects.toMatchObject({ code: 'CATALOG_SLUG_CONFLICT' });
    expect(products.calls).not.toContain('save');
  });

  test('CAT-APP-003 / AC-011 activates within exactly one unit of work', async () => {
    const products = new FakeProductRepository([completeDraftProduct()]);
    const unitOfWork = new FakeCatalogUnitOfWork();
    const activated = await activateCatalogProduct(
      { products, unitOfWork },
      writer,
      catalogIds.product,
    );
    expect(activated.status).toBe('ACTIVE');
    expect(unitOfWork.runs).toBe(1);
  });

  test('CAT-APP-004 / AC-014 returns stable cursor pages', async () => {
    const first = { ...completeDraftProduct(), status: 'ACTIVE' as const };
    const second = {
      ...first,
      id: catalogIds.anotherProduct,
      slug: 'vestido-purple-noir-2',
    };
    const products = new FakeProductRepository([second, first]);
    const page = await listPublicCatalogProducts(products, { limit: 1 });
    expect(page.items).toHaveLength(1);
    expect(page.items[0]?.id).toBe(catalogIds.product);
    expect(page.nextCursor).toBeDefined();
  });

  test('CAT-SEC-001 / AC-016 denies mutation before repository access', async () => {
    const products = new FakeProductRepository();
    const unitOfWork = new FakeCatalogUnitOfWork();
    const unauthorized: CatalogActor = { id: 'customer-001', permissions: [] };
    await expect(
      createProductDraft({ products, unitOfWork }, unauthorized, {
        name: 'Produto não autorizado',
        slug: 'produto-nao-autorizado',
        description: 'A mutação deve ser negada.',
        categoryIds: [catalogIds.category],
        primaryCategoryId: catalogIds.category,
      }),
    ).rejects.toMatchObject({ code: 'CATALOG_FORBIDDEN' });
    expect(products.calls).toHaveLength(0);
  });

  test('CAT-APP-006 / AC-019 archives and removes product from public listing', async () => {
    const active = { ...completeDraftProduct(), status: 'ACTIVE' as const };
    const products = new FakeProductRepository([active]);
    const unitOfWork = new FakeCatalogUnitOfWork();
    const archived = await archiveCatalogProduct(
      { products, unitOfWork },
      writer,
      catalogIds.product,
    );
    const publicPage = await products.listPublic({ limit: 20 });
    expect(archived.id).toBe(active.id);
    expect(archived.status).toBe('ARCHIVED');
    expect(publicPage.items).toHaveLength(0);
  });
});
