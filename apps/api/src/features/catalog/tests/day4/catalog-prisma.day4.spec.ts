import { jest } from '@jest/globals';

import {
  PrismaCatalogTransactionContext,
  PrismaCatalogUnitOfWork,
} from '../../infrastructure/persistence/prisma-catalog-unit-of-work';
import { PrismaProductRepository } from '../../infrastructure/persistence/prisma-product.repository';
import {
  catalogIds,
  completeDraftProduct,
} from '../fixtures/catalog.fixtures';

const databaseProduct = (overrides: Record<string, unknown> = {}) => ({
  id: catalogIds.product,
  name: 'Vestido Purple Noir',
  slug: 'vestido-purple-noir',
  description: 'Vestido midi roxo.',
  status: 'ACTIVE',
  createdAt: new Date('2026-09-20T10:00:00.000Z'),
  updatedAt: new Date('2026-09-20T10:00:00.000Z'),
  categories: [
    {
      productId: catalogIds.product,
      categoryId: catalogIds.category,
      isPrimary: true,
    },
  ],
  variants: [],
  media: [],
  ...overrides,
});

describe('FEATURE-CATALOG Dia 4 Prisma repository', () => {
  test('CAT-DB-008A persists a draft and its primary category atomically', async () => {
    const create = jest.fn(async () => databaseProduct({ status: 'DRAFT' }));
    const repository = new PrismaProductRepository({ product: { create } });
    const draft = { ...completeDraftProduct(), variants: [], media: [] };

    await expect(repository.create(draft)).resolves.toMatchObject({
      id: draft.id,
      status: 'DRAFT',
      primaryCategoryId: catalogIds.category,
    });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          id: draft.id,
          categories: {
            create: [{ categoryId: catalogIds.category, isPrimary: true }],
          },
        }),
      }),
    );
  });

  test('CAT-DB-008 performs stable keyset pagination and returns an opaque cursor', async () => {
    const first = databaseProduct();
    const second = databaseProduct({
      id: catalogIds.anotherProduct,
      slug: 'vestido-purple-noir-2',
      createdAt: new Date('2026-09-20T11:00:00.000Z'),
    });
    const findMany = jest.fn(async () => [first, second]);
    const repository = new PrismaProductRepository({ product: { findMany } });

    const page = await repository.listPublic({ limit: 1 });

    expect(page.items).toHaveLength(1);
    expect(page.nextCursor).toBeDefined();
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: 'ACTIVE' },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
        take: 2,
      }),
    );
  });

  test('CAT-DB-009 decodes the cursor into a two-column keyset predicate', async () => {
    const findMany = jest.fn(async () => [databaseProduct()]);
    const repository = new PrismaProductRepository({ product: { findMany } });
    const firstPage = await new PrismaProductRepository({
      product: {
        findMany: jest.fn(async () => [
          databaseProduct(),
          databaseProduct({
            id: catalogIds.anotherProduct,
            createdAt: new Date('2026-09-20T11:00:00.000Z'),
          }),
        ]),
      },
    }).listPublic({ limit: 1 });

    const cursor = firstPage.nextCursor;
    expect(cursor).toBeDefined();
    if (!cursor) throw new Error('expected pagination cursor');
    await repository.listPublic({ limit: 1, cursor });

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: 'ACTIVE',
          OR: [
            { createdAt: { gt: new Date('2026-09-20T10:00:00.000Z') } },
            {
              createdAt: new Date('2026-09-20T10:00:00.000Z'),
              id: { gt: catalogIds.product },
            },
          ],
        },
      }),
    );
  });

  test('CAT-DB-010 rejects malformed cursors before querying', async () => {
    const findMany = jest.fn(async () => []);
    const repository = new PrismaProductRepository({ product: { findMany } });

    await expect(repository.listPublic({ limit: 20, cursor: 'not-a-cursor' })).rejects.toMatchObject({
      code: 'CATALOG_INVALID_CURSOR',
    });
    expect(findMany).not.toHaveBeenCalled();
  });

  test('CAT-DB-011 routes repository work through exactly one Prisma transaction', async () => {
    const rootFindUnique = jest.fn(async () => null);
    const transactionFindUnique = jest.fn(async () =>
      databaseProduct(),
    );
    const transactionClient = { product: { findUnique: transactionFindUnique } };
    let transactionRuns = 0;
    const rootClient = {
      product: { findUnique: rootFindUnique },
      async $transaction<T>(
        operation: (client: typeof transactionClient) => Promise<T>,
      ): Promise<T> {
        transactionRuns += 1;
        return operation(transactionClient);
      },
    };
    const context = new PrismaCatalogTransactionContext();
    const repository = new PrismaProductRepository(rootClient, context);
    const unitOfWork = new PrismaCatalogUnitOfWork(rootClient, context);

    await unitOfWork.run(() => repository.findById(catalogIds.product));

    expect(transactionRuns).toBe(1);
    expect(transactionFindUnique).toHaveBeenCalledTimes(1);
    expect(rootFindUnique).not.toHaveBeenCalled();
  });

  test('CAT-DB-012 translates a Prisma unique violation at the repository boundary', async () => {
    const update = jest.fn(async () => {
      throw Object.assign(new Error('Unique constraint failed on products_slug_key'), {
        code: 'P2002',
        meta: { target: ['slug'] },
      });
    });
    const repository = new PrismaProductRepository({ product: { update } });

    await expect(repository.save(completeDraftProduct())).rejects.toMatchObject({
      code: 'CATALOG_SLUG_CONFLICT',
    });
  });
});
