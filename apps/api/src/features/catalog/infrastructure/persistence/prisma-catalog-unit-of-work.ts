import { AsyncLocalStorage } from 'node:async_hooks';

import type { CatalogUnitOfWork } from '../../application/catalog.ports';

export interface PrismaCatalogExecutor {
  product: unknown;
}

export interface PrismaTransactionalClient extends PrismaCatalogExecutor {
  $transaction<T>(
    operation: (client: PrismaCatalogExecutor) => Promise<T>,
  ): Promise<T>;
}

export class PrismaCatalogTransactionContext {
  private readonly storage = new AsyncLocalStorage<PrismaCatalogExecutor>();

  current<T extends PrismaCatalogExecutor>(fallback: T): PrismaCatalogExecutor | T {
    return this.storage.getStore() ?? fallback;
  }

  run<T>(client: PrismaCatalogExecutor, operation: () => Promise<T>): Promise<T> {
    return this.storage.run(client, operation);
  }
}

export class PrismaCatalogUnitOfWork implements CatalogUnitOfWork {
  constructor(
    private readonly client: PrismaTransactionalClient,
    private readonly context: PrismaCatalogTransactionContext,
  ) {}

  run<T>(operation: () => Promise<T>): Promise<T> {
    return this.client.$transaction((transaction) =>
      this.context.run(transaction, operation),
    );
  }
}
