import { spawn, spawnSync } from 'node:child_process';

const databaseUrl =
  process.env.CATALOG_TEST_DATABASE_URL ??
  'postgresql://postgres@127.0.0.1:55432/plus_store_day2_test';
const psqlBinary = process.env.PSQL_BIN ?? 'psql';

interface SqlResult {
  status: number | null;
  stdout: string;
  stderr: string;
}

const psqlEnvironment = {
  ...process.env,
  PGCLIENTENCODING: process.platform === 'win32' ? 'WIN1252' : 'UTF8',
};

const assertIsolatedDatabase = (): void => {
  const target = new URL(databaseUrl);
  const localHosts = new Set(['127.0.0.1', 'localhost', '::1']);

  if (!localHosts.has(target.hostname)) {
    throw new Error(
      `CATALOG_TEST_UNSAFE_DATABASE: expected localhost, received ${target.hostname}`,
    );
  }

  if (target.pathname !== '/plus_store_day2_test') {
    throw new Error(
      `CATALOG_TEST_UNSAFE_DATABASE: expected plus_store_day2_test, received ${target.pathname.slice(1)}`,
    );
  }
};

const argsFor = (statement: string): string[] => [
  '--dbname',
  databaseUrl,
  '--no-psqlrc',
  '--set',
  'ON_ERROR_STOP=1',
  '--set',
  'VERBOSITY=verbose',
  '--tuples-only',
  '--no-align',
  '--command',
  statement,
];

const runSql = (statement: string): SqlResult => {
  assertIsolatedDatabase();
  const result = spawnSync(psqlBinary, argsFor(statement), {
    encoding: 'utf8',
    env: psqlEnvironment,
    windowsHide: true,
  });

  if (result.error) {
    throw result.error;
  }

  return {
    status: result.status,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
};

const expectSqlSuccess = (statement: string): string => {
  const result = runSql(statement);
  expect(result.stderr).toBe('');
  expect(result.status).toBe(0);
  return result.stdout;
};

const ensureCatalogSchema = (): void => {
  const relations = expectSqlSuccess(`
    select concat_ws(',',
      to_regclass('app.products'),
      to_regclass('app.categories'),
      to_regclass('app.colors'),
      to_regclass('app.sizes'),
      to_regclass('app.product_variants')
    );
  `);

  expect(relations).toBe(
    'app.products,app.categories,app.colors,app.sizes,app.product_variants',
  );
};

const resetCatalog = (): void => {
  expectSqlSuccess(`
    truncate table
      app.product_media,
      app.product_variants,
      app.product_categories,
      app.product_collections,
      app.products,
      app.categories,
      app.brands,
      app.collections,
      app.colors,
      app.sizes
    cascade;
  `);
};

const prepareDatabase = (): void => {
  ensureCatalogSchema();
  resetCatalog();
};

const ids = {
  product: '018f0f4d-0000-7000-8000-000000000001',
  product2: '018f0f4d-0000-7000-8000-000000000002',
  product3: '018f0f4d-0000-7000-8000-000000000009',
  color: '018f0f4d-0000-7000-8000-000000000004',
  color2: '018f0f4d-0000-7000-8000-000000000005',
  size: '018f0f4d-0000-7000-8000-000000000006',
  size2: '018f0f4d-0000-7000-8000-00000000000a',
  variant: '018f0f4d-0000-7000-8000-000000000007',
  variant2: '018f0f4d-0000-7000-8000-00000000000b',
  variant3: '018f0f4d-0000-7000-8000-00000000000c',
} as const;

const insertProduct = (
  id: string,
  slug: string,
  createdAt = '2026-09-14T12:00:00.000Z',
): string => `
  insert into app.products
    (id, name, slug, description, status, created_at, updated_at)
  values
    ('${id}', 'Vestido Purple Noir', '${slug}',
     'Vestido midi roxo com caimento evasê.', 'DRAFT', '${createdAt}', '${createdAt}');
`;

const seedVariantReferences = (): void => {
  expectSqlSuccess(`
    ${insertProduct(ids.product, 'vestido-purple-noir')}
    insert into app.colors (id, name, slug, display_order, status)
    values
      ('${ids.color}', 'Roxo', 'roxo', 0, 'ACTIVE'),
      ('${ids.color2}', 'Preto', 'preto', 1, 'ACTIVE');
    insert into app.sizes (id, code, label, display_order, status)
    values
      ('${ids.size}', 'G3', 'G3', 0, 'ACTIVE'),
      ('${ids.size2}', 'G4', 'G4', 1, 'ACTIVE');
  `);
};

const insertVariant = (input: {
  id: string;
  colorId: string;
  sizeId: string;
  sku: string;
  barcode?: string;
}): string => `
  insert into app.product_variants
    (id, product_id, color_id, size_id, sku, barcode, price_amount,
     currency, status, created_at, updated_at)
  values
    ('${input.id}', '${ids.product}', '${input.colorId}', '${input.sizeId}',
     '${input.sku}', ${input.barcode ? `'${input.barcode}'` : 'null'}, 299.90,
     'BRL', 'ACTIVE', '2026-09-14T12:00:00.000Z',
     '2026-09-14T12:00:00.000Z');
`;

const runConcurrent = async (
  firstStatement: string,
  secondStatement: string,
): Promise<[SqlResult, SqlResult]> => {
  assertIsolatedDatabase();

  const execute = (statement: string): Promise<SqlResult> =>
    new Promise((resolve, reject) => {
      const child = spawn(psqlBinary, argsFor(statement), {
        env: psqlEnvironment,
        windowsHide: true,
      });
      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (chunk: Buffer) => {
        stdout += chunk.toString();
      });
      child.stderr.on('data', (chunk: Buffer) => {
        stderr += chunk.toString();
      });
      child.on('error', reject);
      child.on('close', (status) => {
        resolve({ status, stdout: stdout.trim(), stderr: stderr.trim() });
      });
    });

  return Promise.all([execute(firstStatement), execute(secondStatement)]);
};

describe('FEATURE-CATALOG PostgreSQL RED contract', () => {
  jest.setTimeout(20_000);

  test('CAT-DB-001 / AC-002 rejects duplicate slug without mutation', () => {
    prepareDatabase();
    expectSqlSuccess(insertProduct(ids.product, 'vestido-purple-noir'));

    const duplicate = runSql(
      insertProduct(ids.product2, 'vestido-purple-noir'),
    );
    const count = expectSqlSuccess(
      "select count(*) from app.products where slug = 'vestido-purple-noir';",
    );

    expect(duplicate.status).not.toBe(0);
    expect(duplicate.stderr).toContain('23505');
    expect(count).toBe('1');
  });

  test('CAT-DB-002 / AC-004 preserves product+color+size uniqueness under concurrency', async () => {
    prepareDatabase();
    seedVariantReferences();

    const [first, second] = await runConcurrent(
      `begin; ${insertVariant({ id: ids.variant, colorId: ids.color, sizeId: ids.size, sku: 'PN-001' })} select pg_sleep(0.4); commit;`,
      `begin; ${insertVariant({ id: ids.variant2, colorId: ids.color, sizeId: ids.size, sku: 'PN-002' })} commit;`,
    );

    expect([first.status, second.status].filter((status) => status === 0)).toHaveLength(1);
    expect(`${first.stderr}\n${second.stderr}`).toContain('23505');
    expect(expectSqlSuccess('select count(*) from app.product_variants;')).toBe('1');
  });

  test('CAT-DB-003 / AC-005 preserves global SKU uniqueness under concurrency', async () => {
    prepareDatabase();
    seedVariantReferences();

    const [first, second] = await runConcurrent(
      `begin; ${insertVariant({ id: ids.variant, colorId: ids.color, sizeId: ids.size, sku: 'PN-SHARED' })} select pg_sleep(0.4); commit;`,
      `begin; ${insertVariant({ id: ids.variant2, colorId: ids.color2, sizeId: ids.size2, sku: 'PN-SHARED' })} commit;`,
    );

    expect([first.status, second.status].filter((status) => status === 0)).toHaveLength(1);
    expect(`${first.stderr}\n${second.stderr}`).toContain('23505');
    expect(expectSqlSuccess("select count(*) from app.product_variants where sku = 'PN-SHARED';")).toBe('1');
  });

  test('CAT-DB-004 / AC-007 preserves partial barcode uniqueness', () => {
    prepareDatabase();
    seedVariantReferences();

    expectSqlSuccess(`
      ${insertVariant({ id: ids.variant, colorId: ids.color, sizeId: ids.size, sku: 'PN-001' })}
      ${insertVariant({ id: ids.variant2, colorId: ids.color2, sizeId: ids.size, sku: 'PN-002' })}
      ${insertVariant({ id: ids.variant3, colorId: ids.color, sizeId: ids.size2, sku: 'PN-003', barcode: '7891234567890' })}
    `);
    const duplicate = runSql(
      insertVariant({
        id: '018f0f4d-0000-7000-8000-00000000000d',
        colorId: ids.color2,
        sizeId: ids.size2,
        sku: 'PN-004',
        barcode: '7891234567890',
      }),
    );

    expect(duplicate.status).not.toBe(0);
    expect(duplicate.stderr).toContain('23505');
  });

  test('CAT-DB-005 / AC-011 rolls activation back atomically after a persistence failure', () => {
    prepareDatabase();
    seedVariantReferences();
    expectSqlSuccess(
      insertVariant({ id: ids.variant, colorId: ids.color, sizeId: ids.size, sku: 'PN-001' }),
    );

    const transaction = runSql(`
      begin;
      update app.products set status = 'ACTIVE' where id = '${ids.product}';
      ${insertVariant({ id: ids.variant2, colorId: ids.color, sizeId: ids.size, sku: 'PN-002' })}
      commit;
    `);
    const status = expectSqlSuccess(
      `select status from app.products where id = '${ids.product}';`,
    );

    expect(transaction.status).not.toBe(0);
    expect(transaction.stderr).toContain('23505');
    expect(status).toBe('DRAFT');
  });

  test('CAT-DB-006 / AC-014 returns stable keyset cursor pages', () => {
    prepareDatabase();
    const timestamp = '2026-09-14T12:00:00.000Z';
    expectSqlSuccess(`
      ${insertProduct(ids.product, 'produto-1', timestamp)}
      ${insertProduct(ids.product2, 'produto-2', timestamp)}
      ${insertProduct(ids.product3, 'produto-3', timestamp)}
    `);

    const firstPage = expectSqlSuccess(`
      select string_agg(id::text, ',' order by created_at, id)
      from (
        select id, created_at from app.products
        order by created_at, id limit 2
      ) page;
    `).split(',');
    const secondPage = expectSqlSuccess(`
      select string_agg(id::text, ',' order by created_at, id)
      from (
        select id, created_at from app.products
        where (created_at, id) > ('${timestamp}', '${firstPage[1]}')
        order by created_at, id limit 2
      ) page;
    `).split(',');

    expect(firstPage).toEqual([ids.product, ids.product2]);
    expect(secondPage).toEqual([ids.product3]);
    expect(new Set([...firstPage, ...secondPage]).size).toBe(3);
  });

  test('CAT-SEC-002 / AC-017 keeps commercial tables outside public Data API roles', () => {
    prepareDatabase();
    expectSqlSuccess(`
      do $$
      begin
        if not exists (select 1 from pg_roles where rolname = 'anon') then
          create role anon nologin;
        end if;
        if not exists (select 1 from pg_roles where rolname = 'authenticated') then
          create role authenticated nologin;
        end if;
      end
      $$;
    `);

    const privileges = expectSqlSuccess(`
      select concat_ws(',',
        has_schema_privilege('anon', 'app', 'usage'),
        has_schema_privilege('authenticated', 'app', 'usage')
      );
    `);

    expect(privileges).toBe('f,f');
  });
});
