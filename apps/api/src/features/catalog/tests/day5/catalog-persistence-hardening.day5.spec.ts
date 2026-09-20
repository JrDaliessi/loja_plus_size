import { jest } from '@jest/globals';

import {
  PrismaCatalogTransactionContext,
  PrismaCatalogUnitOfWork,
} from '../../infrastructure/persistence/prisma-catalog-unit-of-work';
import { PrismaProductRepository } from '../../infrastructure/persistence/prisma-product.repository';

describe('FEATURE-CATALOG Dia 5 persistence hardening', () => {
  test('CAT-DB-013 maps read failures to a stable dependency error', async () => {
    const repository = new PrismaProductRepository({
      product: {
        findMany: jest.fn(async () => {
          throw new Error('postgres endpoint and credentials must not escape');
        }),
      },
    });

    await expect(repository.listPublic({ limit: 20 })).rejects.toMatchObject({
      code: 'CATALOG_PERSISTENCE_UNAVAILABLE',
    });
  });

  test('CAT-DB-014 limits interactive transaction wait and execution time', async () => {
    let receivedOptions: unknown;
    const client = {
      product: {},
      async $transaction<T>(
        operation: (transaction: { product: object }) => Promise<T>,
        options?: unknown,
      ): Promise<T> {
        receivedOptions = options;
        return operation({ product: {} });
      },
    };
    const unitOfWork = new PrismaCatalogUnitOfWork(
      client,
      new PrismaCatalogTransactionContext(),
    );

    await unitOfWork.run(async () => 'ok');

    expect(receivedOptions).toEqual({ maxWait: 2_000, timeout: 5_000 });
  });
});
