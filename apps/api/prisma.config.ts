import 'dotenv/config';
import { defineConfig } from 'prisma/config';

const localSpikeDatabaseUrl =
  'postgresql://postgres@127.0.0.1:55432/plus_store_day2_prisma7_spike';

export default defineConfig({
  schema: './spikes/prisma7/schema.prisma',
  migrations: {
    path: './spikes/prisma7/migrations',
  },
  datasource: {
    url: process.env['DIRECT_URL'] ?? localSpikeDatabaseUrl,
  },
});
