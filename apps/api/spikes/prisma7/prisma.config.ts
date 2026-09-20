import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const localSpikeDatabaseUrl =
  'postgresql://postgres@127.0.0.1:55432/plus_store_day2_prisma7_spike';

export default defineConfig({
  schema: './schema.prisma',
  migrations: {
    path: './migrations',
  },
  datasource: {
    url: process.env['DIRECT_URL'] ?? localSpikeDatabaseUrl,
  },
});
