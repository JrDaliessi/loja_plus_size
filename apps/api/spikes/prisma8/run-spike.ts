import { isStructuredError } from '@prisma/orm-postgres/utils/structured-error';
import { randomUUID } from 'node:crypto';

import { db } from './db.ts';

const executionId = randomUUID();
const createdEmail = `prisma8-spike-${executionId}@plus-store.test`;
const rollbackEmail = `prisma8-rollback-${executionId}@plus-store.test`;

const assert: (condition: unknown, message: string) => asserts condition = (
  condition,
  message,
) => {
  if (!condition) {
    throw new Error(`PRISMA8_SPIKE_FAILED: ${message}`);
  }
};

const main = async (): Promise<void> => {
  const created = await db.orm.public.User.create({
    email: createdEmail,
    name: 'Prisma 8 Spike',
  });
  const found = await db.orm.public.User.where({ email: createdEmail }).first();

  assert(created.email === createdEmail, 'create() did not return the inserted row');
  assert(found?.id === created.id, 'first() did not read the inserted row');

  let uniqueErrorCode: string | undefined;
  try {
    await db.orm.public.User.create({
      email: createdEmail,
      name: 'Duplicate Prisma 8 Spike',
    });
  } catch (error) {
    if (isStructuredError(error)) {
      uniqueErrorCode = error.code;
    } else if (
      typeof error === 'object' &&
      error !== null &&
      'sqlState' in error &&
      error.sqlState === '23505' &&
      'constraint' in error &&
      typeof error.constraint === 'string'
    ) {
      uniqueErrorCode = `SQLSTATE_23505:${error.constraint}`;
    } else {
      throw error;
    }
  }

  assert(uniqueErrorCode, 'unique violation was not a structured Prisma 8 error');

  try {
    await db.transaction(async (transaction) => {
      await transaction.orm.public.User.create({
        email: rollbackEmail,
        name: 'Must roll back',
      });
      throw new Error('PRISMA8_SPIKE_EXPECTED_ROLLBACK');
    });
  } catch (error) {
    assert(
      error instanceof Error &&
        error.message === 'PRISMA8_SPIKE_EXPECTED_ROLLBACK',
      'transaction surfaced an unexpected rollback error',
    );
  }

  const rolledBack = await db.orm.public.User
    .where({ email: rollbackEmail })
    .first();
  assert(rolledBack === null, 'transaction callback did not roll back');

  console.log(
    JSON.stringify({
      connection: 'ok',
      create: 'ok',
      read: 'ok',
      uniqueViolation: uniqueErrorCode,
      transactionRollback: 'ok',
    }),
  );
};

try {
  await main();
} finally {
  await db.close();
}
