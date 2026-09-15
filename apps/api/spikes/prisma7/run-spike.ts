import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import { randomUUID } from 'node:crypto';

import { Prisma, PrismaClient } from './generated/client.ts';

const localSpikeDatabaseUrl =
  'postgresql://postgres@127.0.0.1:55432/plus_store_day2_prisma7_spike';
const databaseUrl = process.env['DATABASE_URL'] ?? localSpikeDatabaseUrl;

const parsedDatabaseUrl = new URL(databaseUrl);
const allowedHosts = new Set(['127.0.0.1', 'localhost']);

if (
  !allowedHosts.has(parsedDatabaseUrl.hostname) ||
  parsedDatabaseUrl.pathname !== '/plus_store_day2_prisma7_spike'
) {
  throw new Error(
    'PRISMA7_SPIKE_FAILED: only the isolated local Prisma 7 spike database is allowed',
  );
}

const adapter = new PrismaPg({ connectionString: databaseUrl });
const prisma = new PrismaClient({ adapter });
const executionId = randomUUID();
const createdEmail = `prisma7-spike-${executionId}@plus-store.test`;
const rollbackEmail = `prisma7-rollback-${executionId}@plus-store.test`;

const assert: (condition: unknown, message: string) => asserts condition = (
  condition,
  message,
) => {
  if (!condition) {
    throw new Error(`PRISMA7_SPIKE_FAILED: ${message}`);
  }
};

const main = async (): Promise<void> => {
  const created = await prisma.spikeUser.create({
    data: {
      email: createdEmail,
      name: 'Prisma 7 Spike',
    },
  });
  const found = await prisma.spikeUser.findUnique({
    where: { email: createdEmail },
  });

  assert(created.email === createdEmail, 'create() did not return the inserted row');
  assert(found?.id === created.id, 'findUnique() did not read the inserted row');

  let uniqueErrorCode: string | undefined;
  try {
    await prisma.spikeUser.create({
      data: {
        email: createdEmail,
        name: 'Duplicate Prisma 7 Spike',
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      uniqueErrorCode = error.code;
    } else {
      throw error;
    }
  }

  assert(uniqueErrorCode === 'P2002', 'unique violation did not map to P2002');

  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.spikeUser.create({
        data: {
          email: rollbackEmail,
          name: 'Must roll back',
        },
      });
      throw new Error('PRISMA7_SPIKE_EXPECTED_ROLLBACK');
    });
  } catch (error) {
    assert(
      error instanceof Error &&
        error.message === 'PRISMA7_SPIKE_EXPECTED_ROLLBACK',
      'transaction surfaced an unexpected rollback error',
    );
  }

  const rolledBack = await prisma.spikeUser.findUnique({
    where: { email: rollbackEmail },
  });
  assert(rolledBack === null, 'interactive transaction did not roll back');

  await prisma.spikeUser.delete({ where: { id: created.id } });

  console.log(
    JSON.stringify({
      connection: 'ok',
      create: 'ok',
      read: 'ok',
      uniqueViolation: uniqueErrorCode,
      transactionRollback: 'ok',
      cleanup: 'ok',
    }),
  );
};

try {
  await main();
} finally {
  await prisma.$disconnect();
}
