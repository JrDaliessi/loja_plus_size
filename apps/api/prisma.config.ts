import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const localCatalogDatabaseUrl =
  'postgresql://postgres@127.0.0.1:55432/plus_store_day2_test';

export default defineConfig({
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
  },
  datasource: {
    url: process.env['DIRECT_URL'] ?? localCatalogDatabaseUrl,
  },
});
